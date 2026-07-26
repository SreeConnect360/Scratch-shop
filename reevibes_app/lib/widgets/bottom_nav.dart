import 'package:flutter/material.dart';
import '../services/haptic_service.dart';

/// Premium bottom navigation bar matching ReeVibes dark theme.
///
/// Navigates the WebView to corresponding routes on the website.
class BottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int index, String path) onTap;

  const BottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  static const _items = [
    _NavItem(icon: Icons.home_rounded, label: 'Home', path: '/'),
    _NavItem(icon: Icons.grid_view_rounded, label: 'Categories', path: '/categories'),
    _NavItem(icon: Icons.shopping_bag_rounded, label: 'Cart', path: '/cart'),
    _NavItem(icon: Icons.favorite_rounded, label: 'Wishlist', path: '/wishlist'),
    _NavItem(icon: Icons.person_rounded, label: 'Account', path: '/account'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0D0D0D),
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.06),
            width: 0.5,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(_items.length, (index) {
              final item = _items[index];
              final isSelected = index == currentIndex;

              return Expanded(
                child: InkWell(
                  onTap: () {
                    HapticService.instance.selectionClick();
                    onTap(index, item.path);
                  },
                  splashColor: const Color(0xFFD4AF37).withValues(alpha: 0.1),
                  highlightColor: Colors.transparent,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        curve: Curves.easeOut,
                        child: Icon(
                          item.icon,
                          size: 22,
                          color: isSelected
                              ? const Color(0xFFD4AF37)
                              : Colors.white.withValues(alpha: 0.45),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.label,
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          letterSpacing: 0.8,
                          color: isSelected
                              ? const Color(0xFFD4AF37)
                              : Colors.white.withValues(alpha: 0.4),
                        ),
                      ),
                      // Active indicator dot
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.only(top: 4),
                        width: isSelected ? 4 : 0,
                        height: isSelected ? 4 : 0,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFFD4AF37),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;
  final String path;

  const _NavItem({required this.icon, required this.label, required this.path});
}
