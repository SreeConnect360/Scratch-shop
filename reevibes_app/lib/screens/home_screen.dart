import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/theme/app_colors.dart';
import '../services/connectivity_service.dart';
import '../services/haptic_service.dart';
import '../widgets/webview_widget.dart';
import 'offline_screen.dart';

/// Main Host Screen for the ReeVibes Mobile Web Application.
///
/// Features:
/// - Loads the live reevibes.com mobile experience directly
/// - Auto-detects connectivity & seamlessly presents OfflineScreen if offline
/// - Handles Android hardware back button (WebView history vs app exit)
/// - Integrated pull-to-refresh & luxury dark UI styling
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final GlobalKey<ReeVibesWebViewState> _webKey = GlobalKey<ReeVibesWebViewState>();
  DateTime? _lastBackPress;
  bool _isConnected = true;
  StreamSubscription<bool>? _connectivitySub;

  @override
  void initState() {
    super.initState();
    _isConnected = ConnectivityService.instance.isConnected;
    _connectivitySub = ConnectivityService.instance.onConnectivityChanged.listen((connected) {
      if (mounted) {
        setState(() => _isConnected = connected);
        if (connected) {
          _webKey.currentState?.reload();
        }
      }
    });
  }

  @override
  void dispose() {
    _connectivitySub?.cancel();
    super.dispose();
  }

  Future<bool> _handleBackPress() async {
    final webState = _webKey.currentState;
    if (webState != null && await webState.canGoBack()) {
      await webState.goBack();
      return false;
    }

    final now = DateTime.now();
    if (_lastBackPress != null && now.difference(_lastBackPress!) < const Duration(seconds: 2)) {
      return true;
    }
    _lastBackPress = now;
    await HapticService.instance.lightTap();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Press back again to exit ReeVibes',
            style: TextStyle(color: Colors.white, fontSize: 13),
          ),
          duration: const Duration(seconds: 2),
          backgroundColor: AppColors.surfaceElevated,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = MediaQuery.of(context).platformBrightness == Brightness.dark;
    final backgroundColor = isDarkMode ? const Color(0xFF0A0A0A) : const Color(0xFFFFFFFF);

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDarkMode ? Brightness.light : Brightness.dark,
        statusBarBrightness: isDarkMode ? Brightness.dark : Brightness.light,
        systemNavigationBarColor: isDarkMode ? const Color(0xFF0D0D0D) : const Color(0xFFFFFFFF),
        systemNavigationBarIconBrightness: isDarkMode ? Brightness.light : Brightness.dark,
      ),
    );

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldExit = await _handleBackPress();
        if (shouldExit && mounted) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SafeArea(
          top: true,
          bottom: false,
          child: !_isConnected
              ? OfflineScreen(
                  onRetry: () async {
                    final connected = await ConnectivityService.instance.checkNow();
                    if (connected && mounted) {
                      setState(() => _isConnected = true);
                      _webKey.currentState?.reload();
                    }
                  },
                )
              : ReeVibesWebView(
                  key: _webKey,
                ),
        ),
      ),
    );
  }
}
