import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';
import 'orders_screen.dart';
import 'notifications_screen.dart';
import 'static_pages_screen.dart';

/// Native User Account Hub & Profile Settings Screen.
class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  void _showEditProfileDialog(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final user = auth.userProfile;
    if (user == null) return;

    final nameController = TextEditingController(text: user.fullName);
    final phoneController = TextEditingController(text: user.phone);
    final dobController = TextEditingController(text: user.dob);
    String selectedGender = user.gender.isNotEmpty ? user.gender : 'Unspecified';

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'EDIT PROFILE DETAILS',
                        style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text('FULL NAME', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: nameController,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: 'Full Name'),
                  ),
                  const SizedBox(height: 14),
                  Text('PHONE NUMBER', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: phoneController,
                    keyboardType: TextInputType.phone,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: '+91 98765 43210'),
                  ),
                  const SizedBox(height: 14),
                  Text('GENDER', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: ['Female', 'Male', 'Non-Binary', 'Unspecified'].contains(selectedGender) ? selectedGender : 'Unspecified',
                    dropdownColor: AppColors.surfaceElevated,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    items: ['Female', 'Male', 'Non-Binary', 'Unspecified']
                        .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                        .toList(),
                    onChanged: (val) => setModalState(() => selectedGender = val!),
                  ),
                  const SizedBox(height: 14),
                  Text('DATE OF BIRTH', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: dobController,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: 'YYYY-MM-DD'),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () async {
                        final success = await auth.updateProfile(
                          fullName: nameController.text.trim(),
                          phone: phoneController.text.trim(),
                          gender: selectedGender,
                          dob: dobController.text.trim(),
                        );
                        if (context.mounted) {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(success ? 'Profile updated successfully!' : 'Profile saved locally.'),
                              backgroundColor: AppColors.surfaceElevated,
                            ),
                          );
                        }
                      },
                      child: const Text('SAVE PROFILE CHANGES'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthProvider>();
    final isAuthenticated = authState.isAuthenticated;
    final user = authState.userProfile;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'MY ACCOUNT',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // USER PROFILE CARD / LOGIN PROMPT
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: isAuthenticated
                  ? Column(
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: AppColors.goldGlow,
                              backgroundImage: user?.avatarUrl.isNotEmpty == true ? NetworkImage(user!.avatarUrl) : null,
                              child: user?.avatarUrl.isEmpty != false
                                  ? Text(
                                      user?.fullName.substring(0, 1).toUpperCase() ?? 'U',
                                      style: GoogleFonts.playfairDisplay(
                                        color: AppColors.gold,
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    user?.fullName ?? 'ReeVibes Member',
                                    style: GoogleFonts.playfairDisplay(
                                      color: AppColors.textPrimary,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    user?.email ?? '',
                                    style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                                  ),
                                  if (user?.phone.isNotEmpty == true) ...[
                                    const SizedBox(height: 2),
                                    Text(
                                      user!.phone,
                                      style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 40,
                          child: OutlinedButton.icon(
                            onPressed: () => _showEditProfileDialog(context),
                            icon: const Icon(Icons.edit_outlined, size: 16, color: AppColors.gold),
                            label: const Text('EDIT PROFILE DETAILS'),
                          ),
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome to ReeVibes',
                          style: GoogleFonts.playfairDisplay(
                            color: AppColors.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Sign in to access your orders, saved addresses, and exclusive couture perks.',
                          style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 46,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const LoginScreen()),
                              );
                            },
                            child: const Text('SIGN IN / REGISTER'),
                          ),
                        ),
                      ],
                    ),
            ),
            const SizedBox(height: 24),

            // MENU OPTIONS
            _AccountMenuTile(
              icon: Icons.local_shipping_outlined,
              title: 'Orders & Tracking',
              subtitle: 'View active orders, status history, and returns',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const OrdersScreen()),
                );
              },
            ),
            const SizedBox(height: 10),
            _AccountMenuTile(
              icon: Icons.notifications_none_rounded,
              title: 'Notifications & Alerts',
              subtitle: 'Order tracking alerts and flash sale notifications',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const NotificationsScreen()),
                );
              },
            ),
            const SizedBox(height: 10),
            _AccountMenuTile(
              icon: Icons.help_outline_rounded,
              title: 'Help & Customer Support',
              subtitle: '24/7 Concierge, FAQs, and Contact Us',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const StaticPagesScreen(title: 'Help & Support')),
                );
              },
            ),
            const SizedBox(height: 10),
            _AccountMenuTile(
              icon: Icons.shield_outlined,
              title: 'Privacy Policy & Terms',
              subtitle: 'Read legal agreements and data policies',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const StaticPagesScreen(title: 'Privacy Policy')),
                );
              },
            ),
            const SizedBox(height: 32),

            // SIGN OUT BUTTON
            if (isAuthenticated)
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppColors.surface,
                        title: Text('Sign Out', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary)),
                        content: Text('Are you sure you want to sign out of your account?', style: GoogleFonts.outfit(color: AppColors.textSecondary)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel'),
                          ),
                          ElevatedButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Sign Out'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      if (context.mounted) {
                        context.read<AuthProvider>().signOut();
                      }
                    }
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: AppColors.error),
                  ),
                  child: const Text('SIGN OUT'),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _AccountMenuTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _AccountMenuTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: AppColors.surfaceElevated,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppColors.gold, size: 20),
        ),
        title: Text(
          title,
          style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
        ),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
      ),
    );
  }
}
