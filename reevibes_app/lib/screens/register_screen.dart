import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

/// Native Registration Screen featuring Email OTP Verification, Live Password Strength Indicator, Confirm Password, and Resilient Account Creation.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isRegistering = false;
  bool _isSendingOtp = false;
  bool _emailVerified = false;

  bool get _hasMinLength => _passwordController.text.length >= 6 && _passwordController.text.length < 16;
  bool get _hasLowercase => _passwordController.text.contains(RegExp(r'[a-z]'));
  bool get _hasUppercase => _passwordController.text.contains(RegExp(r'[A-Z]'));
  bool get _hasNumber => _passwordController.text.contains(RegExp(r'[0-9]'));
  bool get _hasSymbol => _passwordController.text.contains(RegExp(r'[^A-Za-z0-9]'));

  double get _strengthScore {
    int score = 0;
    if (_hasMinLength) score++;
    if (_hasLowercase) score++;
    if (_hasUppercase) score++;
    if (_hasNumber) score++;
    if (_hasSymbol) score++;
    return score / 5.0;
  }

  Color get _strengthColor {
    final s = _strengthScore;
    if (s <= 0.2) return Colors.red;
    if (s <= 0.6) return Colors.orange;
    if (s <= 0.8) return Colors.amber;
    return Colors.green;
  }

  String get _strengthText {
    final s = _strengthScore;
    if (s <= 0.2) return 'Very Weak';
    if (s <= 0.6) return 'Moderate';
    if (s <= 0.8) return 'Strong';
    return 'Very Strong';
  }

  @override
  void initState() {
    super.initState();
    _passwordController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // Trigger Email OTP Send and open Verification Modal with Duplicate Avoidance
  Future<void> _handleSendOtp() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid email address first.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isSendingOtp = true);

    // 1. DUPLICATE ACCOUNT CHECK
    try {
      final existingCust = await ApiService.instance.fetchCustomer(email);
      if (existingCust != null && existingCust['email'] != null && existingCust['email'].toString().isNotEmpty) {
        setState(() => _isSendingOtp = false);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('An account with email "$email" is already registered! Please sign in.'),
            backgroundColor: AppColors.error,
          ),
        );
        return;
      }
    } catch (_) {}

    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    final res = await auth.sendOtp(email, 'SIGNUP');
    setState(() => _isSendingOtp = false);

    if (!mounted) return;

    if (res['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'OTP sent to $email!'),
          backgroundColor: AppColors.surfaceElevated,
        ),
      );
      _showOtpModal(email);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Failed to send OTP.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  // OTP Verification Modal Dialog with 30s Countdown Timer and Status Feedback
  void _showOtpModal(String email) {
    final otpController = TextEditingController();
    int countdown = 30;
    Timer? timer;
    bool isVerifying = false;
    bool isResending = false;
    String? modalError;
    String? modalSuccess;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            // Start 30s countdown timer for Resend button
            timer ??= Timer.periodic(const Duration(seconds: 1), (t) {
              if (countdown > 0) {
                setModalState(() => countdown--);
              } else {
                t.cancel();
              }
            });

            return AlertDialog(
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: AppColors.surfaceBorder),
              ),
              title: Row(
                children: [
                  const Icon(Icons.shield_outlined, color: AppColors.gold, size: 22),
                  const SizedBox(width: 10),
                  Text(
                    'VERIFY EMAIL OTP',
                    style: GoogleFonts.outfit(
                      color: AppColors.gold,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'We sent a 6-digit verification code to:',
                    style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    email,
                    style: GoogleFonts.outfit(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),

                  // 6-Digit Code Input
                  TextField(
                    controller: otpController,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      color: AppColors.gold,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 8.0,
                    ),
                    decoration: InputDecoration(
                      hintText: '000000',
                      hintStyle: GoogleFonts.outfit(
                        color: AppColors.textMuted.withOpacity(0.3),
                        fontSize: 24,
                        letterSpacing: 8.0,
                      ),
                      counterText: '',
                      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Error / Success feedback messages
                  if (modalError != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      decoration: BoxDecoration(
                        color: AppColors.error.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.error.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              modalError!,
                              style: GoogleFonts.outfit(color: AppColors.error, fontSize: 12),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  if (modalSuccess != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.green.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle_outline_rounded, color: Colors.green, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            modalSuccess!,
                            style: GoogleFonts.outfit(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Resend OTP Action & Timer
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      TextButton.icon(
                        onPressed: (countdown > 0 || isResending || isVerifying)
                            ? null
                            : () async {
                                setModalState(() {
                                  isResending = true;
                                  modalError = null;
                                });
                                final auth = context.read<AuthProvider>();
                                final res = await auth.sendOtp(email, 'SIGNUP');
                                setModalState(() {
                                  isResending = false;
                                  if (res['success'] == true) {
                                    countdown = 30;
                                    modalError = null;
                                  } else {
                                    modalError = res['message'] ?? 'Failed to resend OTP.';
                                  }
                                });
                              },
                        icon: isResending
                            ? const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.gold),
                              )
                            : const Icon(Icons.refresh_rounded, size: 14, color: AppColors.gold),
                        label: Text(
                          isResending
                              ? 'Sending...'
                              : countdown > 0
                                  ? 'Resend OTP (${countdown}s)'
                                  : 'Resend OTP',
                          style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          timer?.cancel();
                          Navigator.pop(dialogContext);
                        },
                        child: Text(
                          'Cancel',
                          style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              actions: [
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: isVerifying
                        ? null
                        : () async {
                            final code = otpController.text.trim();
                            if (code.length != 6) {
                              setModalState(() => modalError = 'Please enter a valid 6-digit OTP code.');
                              return;
                            }
                            setModalState(() {
                              isVerifying = true;
                              modalError = null;
                            });

                            final auth = context.read<AuthProvider>();
                            final res = await auth.verifyOtp(email, code);

                            setModalState(() => isVerifying = false);

                            if (res['success'] == true) {
                              setModalState(() {
                                modalSuccess = '✔ Email Verified!';
                              });
                              setState(() => _emailVerified = true);
                              timer?.cancel();
                              await Future.delayed(const Duration(milliseconds: 1000));
                              if (dialogContext.mounted) {
                                Navigator.pop(dialogContext);
                              }
                            } else {
                              setModalState(() {
                                modalError = res['message'] ?? 'Invalid OTP entered.';
                              });
                            }
                          },
                    child: isVerifying
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5),
                          )
                        : const Text('VERIFY CODE'),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Handle Account Registration Submission
  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    if (!_emailVerified) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please verify your email address first!'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Passwords do not match'), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() => _isRegistering = true);

    final authProvider = context.read<AuthProvider>();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();

    final success = await authProvider.signUpWithEmail(email, password, name);

    setState(() => _isRegistering = false);

    if (mounted) {
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Account created successfully! Welcome to ReeVibes Atelier.'),
            backgroundColor: AppColors.surfaceElevated,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.errorMessage ?? 'Registration failed.'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  Future<void> _handleGoogleSignIn() async {
    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.signInWithGoogle();

    if (mounted && success) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Signed in successfully with Google!'),
          backgroundColor: AppColors.surfaceElevated,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'CREATE ACCOUNT',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Join ReeVibes Atelier',
                style: GoogleFonts.playfairDisplay(
                  color: AppColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Create an account to unlock tailored high-fashion curations and member privileges.',
                style: GoogleFonts.outfit(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 28),

              // Full Name Input
              Text(
                'FULL NAME',
                style: GoogleFonts.outfit(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _nameController,
                style: GoogleFonts.outfit(color: AppColors.textPrimary),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter your full name';
                  return null;
                },
                decoration: const InputDecoration(
                  hintText: 'Jane Doe',
                  prefixIcon: Icon(Icons.person_outline_rounded, color: AppColors.textMuted, size: 20),
                ),
              ),
              const SizedBox(height: 18),

              // Email Input with Inline Verify Action / Verified Badge inside right side bar
              Text(
                'EMAIL ADDRESS',
                style: GoogleFonts.outfit(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.outfit(color: AppColors.textPrimary),
                onChanged: (_) {
                  if (_emailVerified) {
                    setState(() => _emailVerified = false);
                  }
                },
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter your email';
                  if (!val.contains('@')) return 'Enter a valid email address';
                  return null;
                },
                decoration: InputDecoration(
                  hintText: 'name@example.com',
                  prefixIcon: const Icon(Icons.email_outlined, color: AppColors.textMuted, size: 20),
                  suffixIcon: Padding(
                    padding: const EdgeInsets.only(right: 6, top: 6, bottom: 6),
                    child: _emailVerified
                        ? Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.green.withOpacity(0.4)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.check_circle_rounded, color: Colors.green, size: 14),
                                const SizedBox(width: 4),
                                Text(
                                  'Verified',
                                  style: GoogleFonts.outfit(color: Colors.green, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          )
                        : TextButton(
                            onPressed: _isSendingOtp ? null : _handleSendOtp,
                            style: TextButton.styleFrom(
                              backgroundColor: AppColors.goldGlow,
                              foregroundColor: AppColors.gold,
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                                side: const BorderSide(color: AppColors.gold, width: 1),
                              ),
                            ),
                            child: _isSendingOtp
                                ? const SizedBox(
                                    width: 14,
                                    height: 14,
                                    child: CircularProgressIndicator(color: AppColors.gold, strokeWidth: 2),
                                  )
                                : Text(
                                    'VERIFY EMAIL',
                                    style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                                  ),
                          ),
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // Password Input
              Text(
                'CREATE PASSWORD',
                style: GoogleFonts.outfit(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: GoogleFonts.outfit(color: AppColors.textPrimary),
                validator: (val) {
                  if (val == null || val.length < 6) return 'Password must be at least 6 characters';
                  return null;
                },
                decoration: InputDecoration(
                  hintText: 'Uppercase, lowercase, number & symbol',
                  prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.textMuted, size: 20),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
              ),

              // Live Password Strength Bar
              if (_passwordController.text.isNotEmpty) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: _strengthScore,
                          backgroundColor: AppColors.surfaceBorder,
                          color: _strengthColor,
                          minHeight: 4,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      _strengthText,
                      style: GoogleFonts.outfit(color: _strengthColor, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 18),

              // Confirm Password Input
              Text(
                'CONFIRM PASSWORD',
                style: GoogleFonts.outfit(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: _obscureConfirmPassword,
                style: GoogleFonts.outfit(color: AppColors.textPrimary),
                validator: (val) {
                  if (val != _passwordController.text) return 'Passwords do not match';
                  return null;
                },
                decoration: InputDecoration(
                  hintText: 'Re-type password',
                  prefixIcon: const Icon(Icons.lock_clock_outlined, color: AppColors.textMuted, size: 20),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirmPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Create Account Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: (_isRegistering || !_emailVerified) ? null : _handleRegister,
                  child: _isRegistering
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5),
                        )
                      : const Text('CREATE ACCOUNT'),
                ),
              ),
              const SizedBox(height: 20),

              // Continue with Google
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  onPressed: _handleGoogleSignIn,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.surfaceBorder, width: 1.2),
                    backgroundColor: AppColors.surface,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.network(
                        'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                        width: 20,
                        height: 20,
                        errorBuilder: (context, error, stackTrace) => const Icon(Icons.g_mobiledata_rounded, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Continue with Google',
                        style: GoogleFonts.outfit(
                          color: AppColors.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account? ',
                      style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => const LoginScreen()),
                        );
                      },
                      child: Text(
                        'Sign In',
                        style: GoogleFonts.outfit(
                          color: AppColors.gold,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
