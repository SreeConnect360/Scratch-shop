import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/shop_provider.dart';

/// Top Navigation Header Bar matching ReeVibes mobile web interface.
class TopHeaderBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onSearchTap;
  final VoidCallback onNotificationTap;
  final String? announcementText;

  const TopHeaderBar({
    super.key,
    required this.onSearchTap,
    required this.onNotificationTap,
    this.announcementText = 'COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹15,000',
  });

  @override
  Size get preferredSize => Size.fromHeight(announcementText != null ? 88.0 : 60.0);

  @override
  Widget build(BuildContext context) {
    final unreadNotifs = context.watch<ShopProvider>().unreadNotificationCount;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Optional Announcement Banner
        if (announcementText != null)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
            color: AppColors.goldGlow,
            child: Text(
              announcementText!,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: AppColors.gold,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.1,
              ),
            ),
          ),

        // Main Glass Header
        Container(
          height: 60,
          padding: const EdgeInsets.symmetric(horizontal: 16),
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
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    width: 5,
                    height: 5,
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
    );
  }
}
