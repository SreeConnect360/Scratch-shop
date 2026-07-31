import 'dart:async';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';
import '../config/app_config.dart';
import '../services/haptic_service.dart';
import '../services/download_service.dart';
import '../services/supabase_service.dart';
import '../services/webview_bridge.dart';

/// Core WebView widget that loads reevibes.com with full native integration.
///
/// Features:
/// - JavaScript enabled with cookie/session persistence
/// - Native Google Sign-In bridge & OAuth URL interception
/// - Pinch-to-zoom & double-tap zoom disabled
/// - External URL handling (payments, OAuth)
/// - JS ↔ Flutter haptic bridge
/// - Pull-to-refresh
/// - Android back button WebView history navigation
class ReeVibesWebView extends StatefulWidget {
  final Function(WebViewController controller)? onControllerCreated;
  final VoidCallback? onPageStarted;
  final VoidCallback? onPageFinished;
  final Function(String url)? onUrlChanged;

  const ReeVibesWebView({
    super.key,
    this.onControllerCreated,
    this.onPageStarted,
    this.onPageFinished,
    this.onUrlChanged,
  });

  @override
  State<ReeVibesWebView> createState() => ReeVibesWebViewState();
}

class ReeVibesWebViewState extends State<ReeVibesWebView> {
  late final WebViewController _controller;
  final _bridge = WebViewBridge.instance;
  bool _isLoading = true;
  double _progress = 0;

  WebViewController get controller => _controller;

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF0A0A0A))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (url) {
            setState(() => _isLoading = true);
            widget.onPageStarted?.call();
          },
          onPageFinished: (url) {
            setState(() => _isLoading = false);
            widget.onPageFinished?.call();
            // Inject JS bridge & zoom prevention scripts after page load
            _controller.runJavaScript(_bridge.injectedJavaScript);
            _controller.runJavaScript(_bridge.actionObserverScript);
          },
          onProgress: (progress) {
            setState(() => _progress = progress / 100.0);
          },
          onNavigationRequest: (request) {
            return _handleNavigation(request);
          },
          onWebResourceError: (error) {
            debugPrint('WebView error: ${error.description}');
          },
          onHttpError: (error) {
            debugPrint('HTTP error: ${error.response?.statusCode}');
          },
        ),
      )
      // Enable file chooser for uploads
      ..setOnJavaScriptAlertDialog((request) async {
        if (!mounted) return;
        await showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('ReeVibes'),
            content: Text(request.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      })
      ..setOnJavaScriptConfirmDialog((request) async {
        if (!mounted) return false;
        final result = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('ReeVibes'),
            content: Text(request.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('OK'),
              ),
            ],
          ),
        );
        return result ?? false;
      });

    // Add JS channels for native bridges
    _controller.addJavaScriptChannel(
      'FlutterHaptic',
      onMessageReceived: (message) {
        HapticService.instance.triggerByName(message.message);
      },
    );

    _controller.addJavaScriptChannel(
      'FlutterShare',
      onMessageReceived: (message) {
        Share.share(message.message);
      },
    );

    _controller.addJavaScriptChannel(
      'FlutterDownload',
      onMessageReceived: (message) async {
        final path = await DownloadService.instance.downloadFile(message.message);
        if (path != null) {
          debugPrint('Downloaded to: $path');
        }
      },
    );

    _controller.addJavaScriptChannel(
      'FlutterGoogleSignIn',
      onMessageReceived: (message) async {
        await _performNativeGoogleSignIn();
      },
    );

    _controller.addJavaScriptChannel(
      'FlutterConsole',
      onMessageReceived: (message) {
        debugPrint('WebView console: ${message.message}');
      },
    );

    // Load the website
    _controller.loadRequest(Uri.parse(AppConfig.websiteUrl));
    widget.onControllerCreated?.call(_controller);
  }

  Future<void> _performNativeGoogleSignIn() async {
    try {
      final response = await SupabaseService.instance.signInWithGoogleNative();
      if (response != null && response['email'] != null) {
        await HapticService.instance.success();
        await _controller.reload();
      }
    } catch (e) {
      debugPrint('Google Sign-In trigger error: $e');
    }
  }

  NavigationDecision _handleNavigation(NavigationRequest request) {
    final url = request.url;

    // Check if Google Sign-In OAuth request is triggered in WebView
    if (url.contains('accounts.google.com/gsi/') ||
        url.contains('accounts.google.com/o/oauth2/v2/auth') ||
        (url.contains('supabase.co/auth/v1/authorize') && url.contains('provider=google'))) {
      _performNativeGoogleSignIn();
      return NavigationDecision.prevent;
    }

    // Check if URL should be opened externally
    for (final pattern in AppConfig.externalDomainPatterns) {
      if (url.contains(pattern)) {
        _launchExternal(url);
        return NavigationDecision.prevent;
      }
    }

    // Check if URL is from a trusted domain
    final uri = Uri.tryParse(url);
    if (uri != null && uri.host.isNotEmpty) {
      final isTrusted = AppConfig.trustedDomains.any(
        (domain) => uri.host == domain || uri.host.endsWith('.$domain'),
      );
      if (!isTrusted && !url.startsWith('data:') && !url.startsWith('blob:')) {
        _launchExternal(url);
        return NavigationDecision.prevent;
      }
    }

    widget.onUrlChanged?.call(url);
    return NavigationDecision.navigate;
  }

  Future<void> _launchExternal(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  /// Navigate to a specific path on the website.
  Future<void> navigateTo(String path) async {
    final url = '${AppConfig.websiteUrl}$path';
    await _controller.loadRequest(Uri.parse(url));
  }

  /// Reload the current page.
  Future<void> reload() async {
    await _controller.reload();
  }

  /// Check if WebView can go back.
  Future<bool> canGoBack() async {
    return await _controller.canGoBack();
  }

  /// Go back in WebView history.
  Future<void> goBack() async {
    if (await _controller.canGoBack()) {
      await _controller.goBack();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        WebViewWidget(controller: _controller),
        // Progress bar
        if (_isLoading)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: LinearProgressIndicator(
              value: _progress > 0 ? _progress : null,
              backgroundColor: Colors.transparent,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFD4AF37)),
              minHeight: 2,
            ),
          ),
      ],
    );
  }
}
