import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/theme/app_colors.dart';
import '../services/haptic_service.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/top_header_bar.dart';
import 'home_tab_screen.dart';
import 'cart_screen.dart';
import 'search_screen.dart';
import 'wishlist_screen.dart';
import 'account_screen.dart';
import 'notifications_screen.dart';

/// Main Application Host Screen holding the 5 Navigation Tabs and PageView.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();
  DateTime? _lastBackPress;

  final List<Widget> _tabs = const [
    HomeTabScreen(),
    CartScreen(),
    SearchScreen(),
    WishlistScreen(),
    AccountScreen(),
  ];

  void _onTabSelected(int index) {
    if (_currentIndex != index) {
      setState(() => _currentIndex = index);
      _pageController.jumpToPage(index);
      HapticService.instance.lightTap();
    }
  }

  void _openSearchOverlay() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SearchScreen()),
    );
  }

  Future<bool> _handleBackPress() async {
    if (_currentIndex != 0) {
      _onTabSelected(0);
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
        backgroundColor: AppColors.background,

        // Top Navigation Bar (Shown on Home Tab)
        appBar: _currentIndex == 0
            ? TopHeaderBar(
                onSearchTap: _openSearchOverlay,
                onNotificationTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const NotificationsScreen()),
                  );
                },
              )
            : null,

        body: PageView(
          controller: _pageController,
          physics: const NeverScrollableScrollPhysics(), // Managed by BottomNavBar
          children: _tabs,
        ),

        // 5-Tab Floating Glass Navigation Dock
        bottomNavigationBar: BottomNavBar(
          currentIndex: _currentIndex,
          onTap: _onTabSelected,
          onSearchTap: _openSearchOverlay,
        ),
      ),
    );
  }
}
