import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/user_profile.dart';
import '../models/coupon.dart';
import '../models/order.dart';
import '../models/address.dart';
import '../providers/auth_provider.dart';
import '../providers/wishlist_provider.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'orders_screen.dart';
import 'static_pages_screen.dart';

/// Maison ReeVibes User Account Dashboard matching Website functionality, layout, and live backend sync.
class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Coupon> _coupons = [];
  List<Order> _orders = [];
  List<Address> _addresses = [];
  List<Map<String, dynamic>> _returnRequests = [];
  bool _isLoadingCoupons = false;
  bool _isLoadingOrders = false;
  bool _isLoadingAddresses = false;

  final _giftCardController = TextEditingController();
  bool _isRedeeming = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
    _loadDashboardData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _giftCardController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    _fetchCoupons();
    _fetchOrders();
    _fetchAddresses();
    _fetchReturnRequests();
  }

  Future<void> _fetchCoupons() async {
    setState(() => _isLoadingCoupons = true);
    final rawCoupons = await ApiService.instance.fetchCoupons();
    if (rawCoupons != null && mounted) {
      setState(() {
        _coupons = rawCoupons.map((c) => Coupon.fromJson(c)).toList();
        _isLoadingCoupons = false;
      });
    } else if (mounted) {
      setState(() => _isLoadingCoupons = false);
    }
  }

  Future<void> _fetchOrders() async {
    setState(() => _isLoadingOrders = true);
    final rawOrders = await ApiService.instance.fetchOrders();
    if (rawOrders != null && mounted) {
      final auth = context.read<AuthProvider>();
      final uid = auth.userProfile?.id ?? '';
      setState(() {
        _orders = rawOrders
            .map((o) => Order.fromJson(o))
            .where((o) => o.userId.isEmpty || o.userId == uid || 'USR-${o.userId}' == uid || uid == 'USR-${o.userId}')
            .toList();
        _isLoadingOrders = false;
      });
    } else if (mounted) {
      setState(() => _isLoadingOrders = false);
    }
  }

  Future<void> _fetchAddresses() async {
    setState(() => _isLoadingAddresses = true);
    final auth = context.read<AuthProvider>();
    final user = auth.userProfile;
    if (user != null) {
      final cust = await ApiService.instance.fetchCustomer(user.id);
      if (cust != null && cust['addresses'] != null && cust['addresses'].toString().isNotEmpty) {
        try {
          final decoded = jsonDecode(cust['addresses'].toString());
          if (decoded is List) {
            final addrs = decoded.map((a) => Address.fromJson(Map<String, dynamic>.from(a))).toList();
            if (mounted) {
              setState(() {
                _addresses = addrs;
                _isLoadingAddresses = false;
              });
              return;
            }
          }
        } catch (_) {}
      }
    }
    if (mounted) {
      setState(() => _isLoadingAddresses = false);
    }
  }

  Future<void> _saveAddressesToBackend(List<Address> newAddresses) async {
    final auth = context.read<AuthProvider>();
    final user = auth.userProfile;
    if (user != null) {
      final targetId = user.id.startsWith('USR-') ? user.id : 'USR-${user.id}';
      final jsonList = newAddresses.map((a) => a.toJson()).toList();
      await ApiService.instance.syncCustomerRecord({
        'id': targetId,
        'email': user.email,
        'addresses': jsonEncode(jsonList),
      });
      setState(() => _addresses = newAddresses);
    }
  }

  Future<void> _fetchReturnRequests() async {
    final rets = await ApiService.instance.fetchReturnRequests();
    if (rets != null && mounted) {
      setState(() => _returnRequests = rets);
    }
  }

  // Profile completeness percentage
  int _calculateCompleteness(UserProfile? user) {
    if (user == null) return 0;
    int score = 0;
    if (user.fullName.isNotEmpty) score += 20;
    if (user.email.isNotEmpty) score += 20;
    if (user.phone.isNotEmpty) score += 20;
    if (user.dob.isNotEmpty) score += 15;
    if (user.gender.isNotEmpty) score += 15;
    if (user.country.isNotEmpty) score += 10;
    return score;
  }

  // Edit Profile Modal BottomSheet
  void _showEditProfileDialog(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final user = auth.userProfile;
    if (user == null) return;

    final nameController = TextEditingController(text: user.fullName);
    final phoneController = TextEditingController(text: user.phone);
    final dobController = TextEditingController(text: user.dob);
    final countryController = TextEditingController(text: user.country.isNotEmpty ? user.country : 'India');
    String selectedGender = ['Female', 'Male', 'Non-Binary', 'Unspecified'].contains(user.gender)
        ? user.gender
        : 'Unspecified';

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
                        'EDIT MAISON DOSSIER',
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
                    decoration: const InputDecoration(hintText: 'Jane Doe'),
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
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('GENDER', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<String>(
                              value: selectedGender,
                              dropdownColor: AppColors.surfaceElevated,
                              style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 13),
                              items: ['Female', 'Male', 'Non-Binary', 'Unspecified']
                                  .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                                  .toList(),
                              onChanged: (val) => setModalState(() => selectedGender = val!),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('DATE OF BIRTH', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            TextField(
                              controller: dobController,
                              style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 13),
                              decoration: const InputDecoration(hintText: 'YYYY-MM-DD'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text('COUNTRY', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: countryController,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: 'India'),
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
                          country: countryController.text.trim(),
                        );
                        if (context.mounted) {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(success ? 'Profile updated and synchronized with backend!' : 'Profile saved locally.'),
                              backgroundColor: AppColors.surfaceElevated,
                            ),
                          );
                        }
                      },
                      child: const Text('SAVE MAISON CHANGES'),
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

  // Change Email Modal with OTP Verification
  void _showChangeEmailModal(BuildContext context) {
    final newEmailController = TextEditingController();
    final otpController = TextEditingController();
    int step = 1;
    bool isSending = false;
    bool isVerifying = false;
    String? errorMsg;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (modalContext) {
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
                        'CHANGE EMAIL ADDRESS',
                        style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                        onPressed: () => Navigator.pop(modalContext),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  if (step == 1) ...[
                    Text(
                      'Enter your new email address. We will send an OTP code for verification.',
                      style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: newEmailController,
                      keyboardType: TextInputType.emailAddress,
                      style: GoogleFonts.outfit(color: AppColors.textPrimary),
                      decoration: const InputDecoration(
                        hintText: 'newemail@example.com',
                        prefixIcon: Icon(Icons.email_outlined, color: AppColors.textMuted),
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (errorMsg != null)
                      Text(errorMsg!, style: GoogleFonts.outfit(color: AppColors.error, fontSize: 12)),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: isSending
                            ? null
                            : () async {
                                final mail = newEmailController.text.trim();
                                if (mail.isEmpty || !mail.contains('@')) {
                                  setModalState(() => errorMsg = 'Please enter a valid email address.');
                                  return;
                                }
                                setModalState(() {
                                  isSending = true;
                                  errorMsg = null;
                                });
                                final auth = context.read<AuthProvider>();
                                final res = await auth.sendOtp(mail, 'SIGNUP');
                                setModalState(() => isSending = false);
                                if (res['success'] == true) {
                                  setModalState(() {
                                    step = 2;
                                    errorMsg = null;
                                  });
                                } else {
                                  setModalState(() => errorMsg = res['message'] ?? 'Failed to send OTP.');
                                }
                              },
                        child: isSending
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                            : const Text('SEND VERIFICATION OTP'),
                      ),
                    ),
                  ] else ...[
                    Text(
                      'Enter the 6-digit verification code sent to ${newEmailController.text.trim()}:',
                      style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: otpController,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 6.0),
                      decoration: const InputDecoration(hintText: '000000', counterText: ''),
                    ),
                    const SizedBox(height: 16),
                    if (errorMsg != null)
                      Text(errorMsg!, style: GoogleFonts.outfit(color: AppColors.error, fontSize: 12)),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: isVerifying
                            ? null
                            : () async {
                                final code = otpController.text.trim();
                                setModalState(() {
                                  isVerifying = true;
                                  errorMsg = null;
                                });
                                final auth = context.read<AuthProvider>();
                                final mail = newEmailController.text.trim();
                                final res = await auth.verifyOtp(mail, code);
                                setModalState(() => isVerifying = false);

                                if (res['success'] == true) {
                                  await auth.updateEmail(mail);
                                  if (modalContext.mounted) {
                                    Navigator.pop(modalContext);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Email address updated successfully!'),
                                        backgroundColor: AppColors.surfaceElevated,
                                      ),
                                    );
                                  }
                                } else {
                                  setModalState(() => errorMsg = res['message'] ?? 'Invalid OTP code.');
                                }
                              },
                        child: isVerifying
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                            : const Text('VERIFY & UPDATE EMAIL'),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Delete Account Confirmation Modal
  void _showDeleteAccountModal(BuildContext context) {
    final confirmController = TextEditingController();
    bool isDeleting = false;

    showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return AlertDialog(
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: const BorderSide(color: AppColors.error),
              ),
              title: Text(
                'DELETE ACCOUNT PERMANENTLY',
                style: GoogleFonts.outfit(color: AppColors.error, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'This action is irreversible. All your dossier details, wishlist items, and member perks will be removed.',
                    style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Type DELETE to confirm:',
                    style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: confirmController,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: 'DELETE'),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                  onPressed: isDeleting
                      ? null
                      : () async {
                          if (confirmController.text.trim() != 'DELETE') {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please type DELETE exactly.'), backgroundColor: AppColors.error),
                            );
                            return;
                          }
                          setModalState(() => isDeleting = true);
                          final auth = context.read<AuthProvider>();
                          await auth.deleteAccount();
                          if (dialogContext.mounted) {
                            Navigator.pop(dialogContext);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Your account has been deleted.'),
                                backgroundColor: AppColors.error,
                              ),
                            );
                          }
                        },
                  child: const Text('PERMANENTLY DELETE'),
                ),
              ],
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
    final completeness = _calculateCompleteness(user);

    if (!isAuthenticated) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(
            'MY ACCOUNT',
            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.account_circle_outlined, color: AppColors.gold, size: 56),
                  const SizedBox(height: 16),
                  Text(
                    'Welcome to ReeVibes Atelier',
                    style: GoogleFonts.playfairDisplay(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to access your orders, saved addresses, coupons, and luxury dossier.',
                    style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
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
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'MAISON ACCOUNT DASHBOARD',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppColors.gold),
            onPressed: () => _loadDashboardData(),
            tooltip: 'Refresh Dashboard',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: AppColors.gold,
          labelColor: AppColors.gold,
          unselectedLabelColor: AppColors.textMuted,
          labelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.0),
          tabs: const [
            Tab(text: 'PROFILE'),
            Tab(text: 'ADDRESSES'),
            Tab(text: 'ORDERS'),
            Tab(text: 'COUPONS'),
            Tab(text: 'WALLET'),
            Tab(text: 'SETTINGS'),
          ],
        ),
      ),
      body: Column(
        children: [
          // MAISON USER CARD HEADER
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(bottom: BorderSide(color: AppColors.surfaceBorder)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
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
                    const SizedBox(width: 14),
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
                        ],
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () => _showEditProfileDialog(context),
                      icon: const Icon(Icons.edit_outlined, size: 14, color: AppColors.gold),
                      label: const Text('EDIT'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Dossier Completeness Bar
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: completeness / 100.0,
                          backgroundColor: AppColors.surfaceBorder,
                          color: AppColors.gold,
                          minHeight: 5,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'Dossier: $completeness%',
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // TAB VIEWS
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. PROFILE DOSSIER TAB
                _buildProfileDossierTab(context, user),

                // 2. SAVED ADDRESSES TAB
                _buildAddressesTab(context),

                // 3. ORDERS & RETURNS TAB
                _buildOrdersTab(context),

                // 4. MAISON COUPONS TAB
                _buildCouponsTab(context),

                // 5. WALLET TAB
                _buildWalletTab(context, user),

                // 6. SETTINGS & SECURITY TAB
                _buildSettingsTab(context),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 1. PROFILE DOSSIER TAB
  Widget _buildProfileDossierTab(BuildContext context, UserProfile? user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PERSONAL DOSSIER DETAILS',
            style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceBorder),
            ),
            child: Column(
              children: [
                _buildDossierTile(Icons.person_outline, 'Full Name', user?.fullName ?? 'Not specified'),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                _buildDossierTile(Icons.email_outlined, 'Email Address', user?.email ?? 'Not specified'),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                _buildDossierTile(Icons.phone_outlined, 'Phone Number', user?.phone.isNotEmpty == true ? user!.phone : 'Not specified'),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'MAISON DETAILS',
            style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceBorder),
            ),
            child: Column(
              children: [
                _buildDossierTile(Icons.wc_outlined, 'Gender', user?.gender.isNotEmpty == true ? user!.gender : 'Unspecified'),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                _buildDossierTile(Icons.cake_outlined, 'Date of Birth', user?.dob.isNotEmpty == true ? user!.dob : 'Not specified'),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                _buildDossierTile(Icons.public_outlined, 'Country', user?.country.isNotEmpty == true ? user!.country : 'India'),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () => _showEditProfileDialog(context),
              icon: const Icon(Icons.edit_note_rounded, color: Colors.black),
              label: const Text('UPDATE PROFILE DOSSIER'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDossierTile(IconData icon, String title, String value) {
    return ListTile(
      leading: Icon(icon, color: AppColors.gold, size: 20),
      title: Text(title, style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
      subtitle: Text(value, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w600)),
    );
  }

  // 2. SAVED ADDRESSES TAB
  Widget _buildAddressesTab(BuildContext context) {
    if (_isLoadingAddresses) {
      return const Center(child: CircularProgressIndicator(color: AppColors.gold));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'SAVED DELIVERY ADDRESSES',
                style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
              ElevatedButton.icon(
                onPressed: () => _showAddOrEditAddressDialog(context),
                icon: const Icon(Icons.add_rounded, size: 16, color: Colors.black),
                label: const Text('ADD NEW'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_addresses.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Column(
                children: [
                  const Icon(Icons.location_off_outlined, color: AppColors.textMuted, size: 40),
                  const SizedBox(height: 12),
                  Text('No Saved Addresses', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  Text('Add a default delivery address to speed up checkout.', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12), textAlign: TextAlign.center),
                ],
              ),
            )
          else
            ..._addresses.map((addr) {
              return Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: addr.isDefault ? AppColors.gold : AppColors.surfaceBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(addr.fullName, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
                            if (addr.isDefault) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(color: AppColors.goldGlow, borderRadius: BorderRadius.circular(6)),
                                child: Text('DEFAULT', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 10, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ],
                        ),
                        PopupMenuButton<String>(
                          icon: const Icon(Icons.more_vert_rounded, color: AppColors.textMuted, size: 20),
                          color: AppColors.surfaceElevated,
                          onSelected: (action) async {
                            if (action == 'DEFAULT') {
                              final updated = _addresses.map((a) => Address(
                                id: a.id,
                                fullName: a.fullName,
                                phone: a.phone,
                                streetAddress: a.streetAddress,
                                city: a.city,
                                state: a.state,
                                zipCode: a.zipCode,
                                country: a.country,
                                isDefault: a.id == addr.id,
                              )).toList();
                              await _saveAddressesToBackend(updated);
                            } else if (action == 'EDIT') {
                              _showAddOrEditAddressDialog(context, existingAddress: addr);
                            } else if (action == 'DELETE') {
                              final updated = _addresses.where((a) => a.id != addr.id).toList();
                              await _saveAddressesToBackend(updated);
                            }
                          },
                          itemBuilder: (context) => [
                            if (!addr.isDefault)
                              const PopupMenuItem(value: 'DEFAULT', child: Text('Set as Default')),
                            const PopupMenuItem(value: 'EDIT', child: Text('Edit Address')),
                            const PopupMenuItem(value: 'DELETE', child: Text('Delete Address', style: TextStyle(color: AppColors.error))),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(addr.formatted, style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13, height: 1.3)),
                    const SizedBox(height: 4),
                    Text('Phone: ${addr.phone}', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12)),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  void _showAddOrEditAddressDialog(BuildContext context, {Address? existingAddress}) {
    final auth = context.read<AuthProvider>();
    final user = auth.userProfile;

    final nameController = TextEditingController(text: existingAddress?.fullName ?? user?.fullName ?? '');
    final phoneController = TextEditingController(text: existingAddress?.phone ?? user?.phone ?? '');
    final streetController = TextEditingController(text: existingAddress?.streetAddress ?? '');
    final cityController = TextEditingController(text: existingAddress?.city ?? '');
    final stateController = TextEditingController(text: existingAddress?.state ?? '');
    final zipController = TextEditingController(text: existingAddress?.zipCode ?? '');
    final countryController = TextEditingController(text: existingAddress?.country ?? user?.country ?? 'India');
    bool isDefault = existingAddress?.isDefault ?? (_addresses.isEmpty);
    bool isDetectingLocation = false;

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
            Future<void> detectCurrentLocation() async {
              setModalState(() => isDetectingLocation = true);
              try {
                final response = await http.get(Uri.parse('https://ipapi.co/json/')).timeout(const Duration(seconds: 6));
                if (response.statusCode == 200) {
                  final data = jsonDecode(response.body);
                  if (data is Map) {
                    final pin = data['postal']?.toString() ?? data['zip']?.toString() ?? '';
                    final cty = data['city']?.toString() ?? '';
                    final st = data['region']?.toString() ?? data['state']?.toString() ?? '';
                    final ctry = data['country_name']?.toString() ?? 'India';

                    if (pin.isNotEmpty) zipController.text = pin;
                    if (cty.isNotEmpty) cityController.text = cty;
                    if (st.isNotEmpty) stateController.text = st;
                    if (ctry.isNotEmpty) countryController.text = ctry;
                    if (streetController.text.isEmpty && cty.isNotEmpty) {
                      streetController.text = '$cty, $st';
                    }

                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Location detected & address auto-filled!'), backgroundColor: AppColors.surfaceElevated),
                      );
                    }
                  }
                }
              } catch (e) {
                debugPrint('Location detection error: $e');
              }
              setModalState(() => isDetectingLocation = false);
            }

            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          existingAddress != null ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS',
                          style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // USE CURRENT LOCATION BUTTON
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: isDetectingLocation ? null : detectCurrentLocation,
                        icon: isDetectingLocation
                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: AppColors.gold, strokeWidth: 2))
                            : const Icon(Icons.my_location_rounded, size: 16, color: AppColors.gold),
                        label: Text(
                          isDetectingLocation ? 'DETECTING LOCATION...' : 'USE CURRENT LOCATION',
                          style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.gold, width: 1.2),
                          backgroundColor: AppColors.goldGlow.withOpacity(0.15),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    Text('FULL NAME', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    TextField(controller: nameController, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: 'Jane Doe')),
                    const SizedBox(height: 12),
                    Text('PHONE NUMBER', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    TextField(controller: phoneController, keyboardType: TextInputType.phone, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: '+91 98765 43210')),
                    const SizedBox(height: 12),
                    Text('STREET ADDRESS', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    TextField(controller: streetController, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: 'Flat, House No, Apartment, Street')),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('CITY', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              TextField(controller: cityController, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: 'Mumbai')),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('STATE', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              TextField(controller: stateController, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: 'Maharashtra')),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('ZIP CODE', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              TextField(controller: zipController, keyboardType: TextInputType.number, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: '400001')),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('COUNTRY', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              TextField(controller: countryController, style: GoogleFonts.outfit(color: AppColors.textPrimary), decoration: const InputDecoration(hintText: 'India')),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    SwitchListTile(
                      activeColor: AppColors.gold,
                      contentPadding: EdgeInsets.zero,
                      title: Text('Set as Default Delivery Address', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                      value: isDefault,
                      onChanged: (val) => setModalState(() => isDefault = val),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () async {
                          if (nameController.text.trim().isEmpty || streetController.text.trim().isEmpty || cityController.text.trim().isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all required fields.'), backgroundColor: AppColors.error));
                            return;
                          }

                          final newAddr = Address(
                            id: existingAddress?.id ?? 'addr_${DateTime.now().millisecondsSinceEpoch}',
                            fullName: nameController.text.trim(),
                            phone: phoneController.text.trim(),
                            streetAddress: streetController.text.trim(),
                            city: cityController.text.trim(),
                            state: stateController.text.trim(),
                            zipCode: zipController.text.trim(),
                            country: countryController.text.trim().isNotEmpty ? countryController.text.trim() : 'India',
                            isDefault: isDefault,
                          );

                          List<Address> updatedList = List.from(_addresses);
                          if (existingAddress != null) {
                            final idx = updatedList.indexWhere((a) => a.id == existingAddress.id);
                            if (idx >= 0) updatedList[idx] = newAddr;
                          } else {
                            updatedList.add(newAddr);
                          }

                          if (isDefault) {
                            updatedList = updatedList.map((a) => Address(
                              id: a.id,
                              fullName: a.fullName,
                              phone: a.phone,
                              streetAddress: a.streetAddress,
                              city: a.city,
                              state: a.state,
                              zipCode: a.zipCode,
                              country: a.country,
                              isDefault: a.id == newAddr.id,
                            )).toList();
                          }

                          await _saveAddressesToBackend(updatedList);

                          if (context.mounted) {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Address saved successfully!'), backgroundColor: AppColors.surfaceElevated));
                          }
                        },
                        child: const Text('SAVE ADDRESS'),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // 3. ORDERS & RETURNS TAB
  Widget _buildOrdersTab(BuildContext context) {
    if (_isLoadingOrders) {
      return const Center(child: CircularProgressIndicator(color: AppColors.gold));
    }

    if (_orders.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.local_shipping_outlined, color: AppColors.textMuted, size: 48),
              const SizedBox(height: 12),
              Text('No Active Orders Found', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Explore our high-fashion curations and place your first order.', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const OrdersScreen()));
                },
                child: const Text('EXPLORE CURATIONS'),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: _orders.length,
      separatorBuilder: (context, index) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final order = _orders[index];
        final isDelivered = order.status == OrderStatus.delivered;
        final isCancelable = order.status == OrderStatus.placed || order.status == OrderStatus.confirmed || order.status == OrderStatus.processing;
        final returnReq = _returnRequests.firstWhere((r) => r['orderId'] == order.orderNumber || r['orderId'] == order.id, orElse: () => {});
        final dateStr = '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year}';

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.surfaceBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    order.orderNumber,
                    style: GoogleFonts.outfit(color: AppColors.gold, fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.goldGlow,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                    ),
                    child: Text(
                      order.statusDisplay,
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Placed on $dateStr • ${order.items.length} Item(s)',
                style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 4),
              Text(
                'Total Amount: ₹${order.totalAmount.toStringAsFixed(2)}',
                style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
              ),
              if (returnReq.isNotEmpty) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(color: AppColors.surfaceElevated, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.gold.withOpacity(0.3))),
                  child: Row(
                    children: [
                      const Icon(Icons.assignment_return_outlined, color: AppColors.gold, size: 16),
                      const SizedBox(width: 8),
                      Text(
                        'Return Request Status: ${returnReq['status'] ?? "Requested"}',
                        style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _showOrderDetailsModal(context, order, returnReq),
                      style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 10)),
                      child: const Text('ORDER DETAILS & TRACKING'),
                    ),
                  ),
                  if (isCancelable) ...[
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () => _confirmCancelOrder(context, order),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10)),
                      child: const Text('CANCEL'),
                    ),
                  ],
                  if (isDelivered && returnReq.isEmpty) ...[
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () => _showReturnRequestModal(context, order),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.gold, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10)),
                      child: const Text('RETURN / REFUND'),
                    ),
                  ],
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showOrderDetailsModal(BuildContext context, Order order, Map<String, dynamic> returnReq) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        final isPlaced = true;
        final isProcessing = order.status != OrderStatus.placed;
        final isShipped = order.status == OrderStatus.shipped || order.status == OrderStatus.outForDelivery || order.status == OrderStatus.delivered;
        final isDelivered = order.status == OrderStatus.delivered;
        final dateStr = '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year}';
        final estStr = order.estimatedDelivery != null ? '${order.estimatedDelivery!.day}/${order.estimatedDelivery!.month}/${order.estimatedDelivery!.year}' : 'Pending Delivery';
        final trackingStr = order.trackingNumber != null && order.trackingNumber!.isNotEmpty ? order.trackingNumber! : 'Express Courier';

        return Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ORDER #${order.orderNumber}',
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Tracking Timeline
                Text('LIVE TRACKING STATUS', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.surfaceBorder)),
                  child: Column(
                    children: [
                      _buildTrackingStep('Order Placed', dateStr, isPlaced),
                      _buildTrackingStep('Processing & Preparation', 'Atelier Dispatch Center', isProcessing),
                      _buildTrackingStep('Shipped / Out for Delivery', trackingStr, isShipped),
                      _buildTrackingStep('Delivered', estStr, isDelivered),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Items List
                Text('ORDER ITEMS', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ...order.items.map((item) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(12)),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(item.product.primaryImage, width: 48, height: 48, fit: BoxFit.cover, errorBuilder: (ctx, err, stack) => Container(width: 48, height: 48, color: AppColors.surfaceElevated)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.product.name, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
                              Text('Size: ${item.selectedSize} • Color: ${item.selectedColor} • Qty: ${item.quantity}', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11)),
                            ],
                          ),
                        ),
                        Text('₹${item.totalPrice.toStringAsFixed(2)}', style: GoogleFonts.outfit(color: AppColors.gold, fontWeight: FontWeight.bold, fontSize: 13)),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 12),
                // Shipping Address
                Text('DELIVERY ADDRESS', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(order.shippingAddress.formatted, style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 12)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTrackingStep(String title, String subtitle, bool isDone) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(isDone ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded, color: isDone ? AppColors.gold : AppColors.textMuted, size: 20),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.outfit(color: isDone ? AppColors.textPrimary : AppColors.textMuted, fontWeight: FontWeight.bold, fontSize: 13)),
              Text(subtitle, style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11)),
            ],
          ),
        ],
      ),
    );
  }

  void _confirmCancelOrder(BuildContext context, Order order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text('Cancel Order #${order.orderNumber}?', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary)),
        content: Text('Are you sure you want to cancel this order? This action cannot be undone.', style: GoogleFonts.outfit(color: AppColors.textSecondary)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('No, Keep Order')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () async {
              Navigator.pop(context);
              final success = await ApiService.instance.cancelOrder(order.id);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(success ? 'Order cancelled successfully.' : 'Failed to cancel order.'), backgroundColor: success ? AppColors.surfaceElevated : AppColors.error));
                _fetchOrders();
              }
            },
            child: const Text('CANCEL ORDER'),
          ),
        ],
      ),
    );
  }

  void _showReturnRequestModal(BuildContext context, Order order) {
    String selectedReason = 'Wrong Size/Fit';
    final commentsController = TextEditingController();
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('RETURN & REFUND REQUEST', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                      IconButton(icon: const Icon(Icons.close_rounded, color: AppColors.textMuted), onPressed: () => Navigator.pop(context)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text('SELECT REASON FOR RETURN', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: selectedReason,
                    dropdownColor: AppColors.surfaceElevated,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 13),
                    items: ['Wrong Size/Fit', 'Defective Product', 'Wrong Item Received', 'Changed Mind', 'Quality Not As Expected']
                        .map((r) => DropdownMenuItem(value: r, child: Text(r)))
                        .toList(),
                    onChanged: (val) => setModalState(() => selectedReason = val!),
                  ),
                  const SizedBox(height: 14),
                  Text('ADDITIONAL COMMENTS', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: commentsController,
                    maxLines: 3,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary),
                    decoration: const InputDecoration(hintText: 'Please describe the issue or reason for returning...'),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: isSubmitting
                          ? null
                          : () async {
                              setModalState(() => isSubmitting = true);
                              final auth = context.read<AuthProvider>();
                              final payload = {
                                'orderId': order.orderNumber,
                                'customerEmail': auth.userProfile?.email ?? '',
                                'reason': selectedReason,
                                'comments': commentsController.text.trim(),
                                'requestDate': DateTime.now().toIso8601String(),
                                'status': 'Return Requested',
                              };
                              final success = await ApiService.instance.submitReturnRequest(payload);
                              setModalState(() => isSubmitting = false);
                              if (context.mounted) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(success ? 'Return request submitted successfully!' : 'Failed to submit return request.'), backgroundColor: success ? AppColors.surfaceElevated : AppColors.error));
                                _fetchReturnRequests();
                              }
                            },
                      child: isSubmitting ? const CircularProgressIndicator(color: Colors.black) : const Text('SUBMIT RETURN REQUEST'),
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

  // 3. MAISON COUPONS TAB
  Widget _buildCouponsTab(BuildContext context) {
    if (_isLoadingCoupons) {
      return const Center(child: CircularProgressIndicator(color: AppColors.gold));
    }

    if (_coupons.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.confirmation_number_outlined, color: AppColors.textMuted, size: 48),
            const SizedBox(height: 12),
            Text('No Coupons Available', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: _coupons.length,
      separatorBuilder: (context, index) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final coupon = _coupons[index];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.gold.withOpacity(0.4)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: AppColors.goldGlow,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.local_offer_outlined, color: AppColors.gold, size: 24),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      coupon.code,
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${coupon.discountPercent.toStringAsFixed(0)}% OFF — ${coupon.description}',
                      style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 12),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Min spend: ₹${coupon.minOrderAmount.toStringAsFixed(0)}',
                      style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.copy_rounded, color: AppColors.gold, size: 20),
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: coupon.code));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Copied coupon code ${coupon.code}!'), backgroundColor: AppColors.surfaceElevated),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // 5. WALLET TAB
  Widget _buildWalletTab(BuildContext context, UserProfile? user) {
    final balance = user?.walletBalance ?? 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Balance Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2A2012), Color(0xFF141414)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.gold.withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('AVAILABLE WALLET BALANCE', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                    const Icon(Icons.account_balance_wallet_outlined, color: AppColors.gold, size: 24),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  '₹${balance.toStringAsFixed(2)}',
                  style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary, fontSize: 32, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Redeem Voucher Code Section
          Text('REDEEM GIFT CARD OR VOUCHER', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _giftCardController,
                  style: GoogleFonts.outfit(color: AppColors.textPrimary, letterSpacing: 1.2),
                  decoration: const InputDecoration(hintText: 'e.g. WELCOME500 or VIP1000'),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: _isRedeeming
                    ? null
                    : () async {
                        final code = _giftCardController.text.trim();
                        if (code.isEmpty) return;
                        setState(() => _isRedeeming = true);
                        final auth = context.read<AuthProvider>();
                        final res = await auth.redeemGiftCard(code);
                        setState(() => _isRedeeming = false);
                        _giftCardController.clear();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(res['message'] ?? 'Redeemed code!'),
                              backgroundColor: res['success'] == true ? AppColors.surfaceElevated : AppColors.error,
                            ),
                          );
                        }
                      },
                child: _isRedeeming
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                    : const Text('REDEEM'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 6. SETTINGS & SECURITY TAB
  Widget _buildSettingsTab(BuildContext context) {
    final auth = context.read<AuthProvider>();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('SECURITY & PRIVACY', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceBorder),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.mark_email_read_outlined, color: AppColors.gold),
                  title: Text('Change Email Address', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                  subtitle: Text('Update and verify your login email', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
                  onTap: () => _showChangeEmailModal(context),
                ),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                ListTile(
                  leading: const Icon(Icons.lock_reset_rounded, color: AppColors.gold),
                  title: Text('Password Security', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                  subtitle: Text('Manage authentication password', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Use Forgot Password on Login screen to reset password via OTP.'), backgroundColor: AppColors.surfaceElevated),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('LEGAL & POLICIES', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceBorder),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.privacy_tip_outlined, color: AppColors.gold),
                  title: Text('Privacy Policy', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const StaticPagesScreen(title: 'Privacy Policy')));
                  },
                ),
                const Divider(height: 1, color: AppColors.surfaceBorder),
                ListTile(
                  leading: const Icon(Icons.gavel_outlined, color: AppColors.gold),
                  title: Text('Terms of Service', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textMuted, size: 14),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const StaticPagesScreen(title: 'Terms of Service')));
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // SIGN OUT BUTTON
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
                      TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                      ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sign Out')),
                    ],
                  ),
                );

                if (confirm == true && context.mounted) {
                  auth.signOut(
                    cartProvider: context.read<CartProvider>(),
                    wishlistProvider: context.read<WishlistProvider>(),
                  );
                }
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.error,
                side: const BorderSide(color: AppColors.error),
              ),
              child: const Text('SIGN OUT OF ACCOUNT'),
            ),
          ),
          const SizedBox(height: 16),

          // DELETE ACCOUNT BUTTON
          SizedBox(
            width: double.infinity,
            height: 50,
            child: TextButton.icon(
              onPressed: () => _showDeleteAccountModal(context),
              icon: const Icon(Icons.delete_forever_rounded, color: AppColors.error, size: 20),
              label: Text('DELETE ACCOUNT PERMANENTLY', style: GoogleFonts.outfit(color: AppColors.error, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
