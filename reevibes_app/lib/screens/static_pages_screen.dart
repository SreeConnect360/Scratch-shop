import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_colors.dart';

/// Native Screen rendering static pages (About Us, Terms, Privacy Policy, Help & Support).
class StaticPagesScreen extends StatelessWidget {
  final String title;

  const StaticPagesScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          title.toUpperCase(),
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'ReeVibes Haute Couture',
              style: GoogleFonts.playfairDisplay(
                color: AppColors.textPrimary,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Luxury Fashion Curation & Concierge',
              style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const Divider(color: AppColors.surfaceBorder),
            const SizedBox(height: 16),

            Text(
              'At ReeVibes, we curate bespoke fashion, handcrafted garments, and exclusive atelier collections from global luxury houses. Our commitment is to deliver extraordinary quality, authentic craftsmanship, and seamless digital concierge services to our patrons worldwide.',
              style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 14, height: 1.6),
            ),
            const SizedBox(height: 24),

            Text(
              'CUSTOMER CONCIERGE & SUPPORT',
              style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
            ),
            const SizedBox(height: 8),
            Text(
              'Email: hello@reevibes.com\nHours: Mon - Sat (10:00 AM - 7:00 PM IST)\nAddress: ReeVibes Atelier, Jubilee Hills, Hyderabad, India',
              style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13, height: 1.6),
            ),
          ],
        ),
      ),
    );
  }
}
