import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/shop_provider.dart';

/// Top Navigation Header Bar matching ReeVibes luxury mobile interface.
/// Features top empty black spacing bar for clean notch/status bar alignment.
class TopHeaderBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onSearchTap;
  final VoidCallback onNotificationTap;
  final String? announcementText;

  const TopHeaderBar({
    super.key,
    required this.onSearchTap,
    required this.onNotificationTap,
    this.announcementText,
  });

  @override
  Size get preferredSize => const Size.fromHeight(84.0);

  @override
  Widget build(BuildContext context) {
    final unreadNotifs = context.watch<ShopProvider>().unreadNotificationCount;
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      color: Colors.black,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. EMPTY BLACK TOP BAR (Pushes logo down for clean mobile alignment)
          SizedBox(height: topPadding > 0 ? topPadding + 4 : 20.0),

          // 2. MAIN HEADER BAR
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 18),
            decoration: const BoxDecoration(
              color: AppColors.background,
              border: Border(
                bottom: BorderSide(color: AppColors.surfaceBorder, width: 1),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // ReeVibes Luxury Brand Title
                Row(
                  children: [
                    Text(
                      'ReeVibes',
                      style: GoogleFonts.playfairDisplay(
                        color: AppColors.textPrimary,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.4,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.gold,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),

                // Action Icons: Search & Notifications
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.search_rounded, color: AppColors.textPrimary, size: 22),
                      onPressed: onSearchTap,
                    ),
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.notifications_outlined, color: AppColors.textPrimary, size: 22),
                          onPressed: onNotificationTap,
                        ),
                        if (unreadNotifs > 0)
                          Positioned(
                            top: 10,
                            right: 10,
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.gold,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
