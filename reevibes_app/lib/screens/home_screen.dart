import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/connectivity_service.dart';
import '../services/haptic_service.dart';
import '../services/notification_service.dart';
import '../widgets/webview_widget.dart';
import '../widgets/bottom_nav.dart';
import 'offline_screen.dart';

/// Main application screen containing the WebView, bottom navigation,
/// connectivity monitoring, and offline fallback.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  final _webViewKey = GlobalKey<ReeVibesWebViewState>();
  int _currentNavIndex = 0;
  bool _isOnline = true;
  bool _showOffline = false;
  StreamSubscription<bool>? _connectivitySub;
  DateTime? _lastBackPress;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    _isOnline = ConnectivityService.instance.isConnected;
    _showOffline = !_isOnline;

    _connectivitySub = ConnectivityService.instance.onConnectivityChanged.listen((connected) {
      if (!mounted) return;
      setState(() {
        _isOnline = connected;
        if (connected && _showOffline) {
          _showOffline = false;
          _webViewKey.currentState?.reload();
        } else if (!connected) {
          _showOffline = true;
        }
      });
    });

    // Check for pending deep links from notifications
    _checkPendingDeepLinks();
  }

  void _checkPendingDeepLinks() {
    final deepLink = NotificationService.instance.consumePendingDeepLink();
    if (deepLink != null) {
      Future.delayed(const Duration(milliseconds: 500), () {
        _webViewKey.currentState?.navigateTo(deepLink);
      });
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _connectivitySub?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      ConnectivityService.instance.checkNow();
      _checkPendingDeepLinks();
    }
  }

  void _onNavTap(int index, String path) {
    setState(() => _currentNavIndex = index);
    _webViewKey.currentState?.navigateTo(path);
  }

  void _onUrlChanged(String url) {
    final path = Uri.tryParse(url)?.path ?? '/';
    int newIndex = 0;
    if (path.startsWith('/categories') || path.startsWith('/category') || path.startsWith('/brand')) {
      newIndex = 1;
    } else if (path.startsWith('/cart')) {
      newIndex = 2;
    } else if (path.startsWith('/wishlist')) {
      newIndex = 3;
    } else if (path.startsWith('/account') || path.startsWith('/login') || path.startsWith('/register')) {
      newIndex = 4;
    }
    if (newIndex != _currentNavIndex && mounted) {
      setState(() => _currentNavIndex = newIndex);
    }
  }

  /// Handle Android back button: navigate WebView history first, then show exit toast.
  Future<bool> _handleBackPress() async {
    final canGoBack = await _webViewKey.currentState?.canGoBack() ?? false;
    if (canGoBack) {
      await _webViewKey.currentState?.goBack();
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
            'Press back again to exit',
            style: TextStyle(color: Colors.white, fontSize: 13),
          ),
          duration: const Duration(seconds: 2),
          backgroundColor: const Color(0xFF1A1A1A),
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
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;
        final shouldExit = await _handleBackPress();
        if (shouldExit && mounted) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF0A0A0A),
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              // Offline banner (shown inline when connectivity drops)
              if (!_isOnline && !_showOffline)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
                  color: const Color(0xFFD4AF37).withValues(alpha: 0.15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.wifi_off_rounded,
                        size: 14,
                        color: const Color(0xFFD4AF37).withValues(alpha: 0.8),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'You are offline',
                        style: TextStyle(
                          color: const Color(0xFFD4AF37).withValues(alpha: 0.8),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),

              // Main content area
              Expanded(
                child: _showOffline
                    ? OfflineScreen(
                        onRetry: () {
                          setState(() => _showOffline = false);
                          _webViewKey.currentState?.reload();
                        },
                      )
                    : RefreshIndicator(
                        onRefresh: () async {
                          await HapticService.instance.lightTap();
                          await _webViewKey.currentState?.reload();
                        },
                        color: const Color(0xFFD4AF37),
                        backgroundColor: const Color(0xFF1A1A1A),
                        child: ReeVibesWebView(
                          key: _webViewKey,
                          onUrlChanged: _onUrlChanged,
                        ),
                      ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: BottomNav(
          currentIndex: _currentNavIndex,
          onTap: _onNavTap,
        ),
      ),
    );
  }
}
