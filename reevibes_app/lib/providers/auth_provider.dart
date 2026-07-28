import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_profile.dart';
import '../services/supabase_service.dart';
import '../services/cache_service.dart';
import '../services/haptic_service.dart';
import '../services/api_service.dart';

enum AuthStatus { unauthenticated, authenticating, authenticated, error }

/// Provider managing Strict Production User Authentication, Session State, and Real Database Sync.
class AuthProvider extends ChangeNotifier {
  AuthStatus _status = AuthStatus.unauthenticated;
  AuthStatus get status => _status;

  UserProfile? _userProfile;
  UserProfile? get userProfile => _userProfile;

  bool get isAuthenticated => _status == AuthStatus.authenticated && _userProfile != null;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _initSession();
  }

  Future<void> _initSession() async {
    await SupabaseService.instance.initialise();

    final user = SupabaseService.instance.currentUser;
    if (user != null) {
      // Load customer record from Spring Boot backend
      final cust = await ApiService.instance.fetchCustomer(user.id);
      if (cust != null) {
        _userProfile = UserProfile.fromJson(cust);
      } else {
        _userProfile = UserProfile(
          id: user.id,
          email: user.email ?? '',
          fullName: user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? user.email?.split('@').first ?? 'ReeVibes Member',
          avatarUrl: user.userMetadata?['avatar_url'] ?? '',
        );
      }
      _status = AuthStatus.authenticated;
    } else {
      // Check cached profile for persistent session
      final cachedJson = CacheService.instance.getJson('user_profile');
      if (cachedJson != null && cachedJson is Map<String, dynamic>) {
        _userProfile = UserProfile.fromJson(cachedJson);
        _status = AuthStatus.authenticated;
      } else {
        _status = AuthStatus.unauthenticated;
      }
    }
    notifyListeners();
  }

  /// Trigger Email OTP dispatch from Spring Boot backend
  Future<Map<String, dynamic>> sendOtp(String email, String type) async {
    return await ApiService.instance.sendOtp(email, type);
  }

  /// Verify Email OTP against Spring Boot backend
  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    return await ApiService.instance.verifyOtp(email, otp);
  }

  /// Trigger Forgot Password OTP
  Future<Map<String, dynamic>> forgotPassword(String email) async {
    return await ApiService.instance.forgotPassword(email);
  }

  /// Reset Password with OTP
  Future<Map<String, dynamic>> resetPassword(String email, String password, String confirmPassword) async {
    return await ApiService.instance.resetPassword(email, password, confirmPassword);
  }

  /// Perform Google Sign-In with Real Consent Screen and Supabase OAuth
  Future<bool> signInWithGoogle() async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await SupabaseService.instance.signInWithGoogleNative();
      if (response != null && response.user != null) {
        final user = response.user!;
        final cust = await ApiService.instance.fetchCustomer(user.id);
        _userProfile = cust != null
            ? UserProfile.fromJson(cust)
            : UserProfile(
                id: user.id,
                email: user.email ?? '',
                fullName: user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? user.email?.split('@').first ?? 'ReeVibes Member',
                avatarUrl: user.userMetadata?['avatar_url'] ?? '',
              );
        _status = AuthStatus.authenticated;
        await CacheService.instance.putJson('user_profile', _userProfile!.toJson());
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }
    } catch (e) {
      debugPrint('Google Sign-In error: $e');
      _errorMessage = e.toString().replaceAll('Exception: ', '').replaceAll('AuthException: ', '');
    }

    // STRICT FAILURE IF GOOGLE OAUTH FAILS OR IS CANCELLED - NO DUMMY SESSION
    _status = AuthStatus.error;
    _errorMessage ??= 'Google Sign-In was cancelled or failed to authenticate.';
    await HapticService.instance.errorNotification();
    notifyListeners();
    return false;
  }

  /// Sign in with Email and Password (STRICT Verification against Supabase & Spring Boot DB)
  Future<bool> signInWithEmail(String email, String password) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    // 1. Primary: Verify against Supabase Authentication Database
    try {
      final response = await SupabaseService.instance.signInWithEmail(email, password);
      if (response.user != null) {
        final user = response.user!;
        _userProfile = UserProfile(
          id: user.id,
          email: user.email ?? email,
          fullName: user.userMetadata?['full_name'] ?? user.email?.split('@').first ?? 'ReeVibes Member',
        );
        _status = AuthStatus.authenticated;
        await CacheService.instance.putJson('user_profile', _userProfile!.toJson());
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }
    } on AuthException catch (e) {
      debugPrint('Supabase Auth error: ${e.message}');
      _errorMessage = e.message;
    } catch (e) {
      debugPrint('Supabase Auth exception: $e');
    }

    // 2. Secondary: Verify against Spring Boot Backend Customer DB
    try {
      final backendRes = await ApiService.instance.signInBackend(email, password);
      if (backendRes['success'] == true && backendRes['user'] != null) {
        final bUser = backendRes['user'];
        _userProfile = UserProfile(
          id: bUser['id']?.toString() ?? 'usr-${DateTime.now().millisecondsSinceEpoch}',
          email: bUser['email']?.toString() ?? email,
          fullName: bUser['name']?.toString() ?? email.split('@').first,
        );
        _status = AuthStatus.authenticated;
        await CacheService.instance.putJson('user_profile', _userProfile!.toJson());
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      } else if (backendRes['message'] != null && _errorMessage == null) {
        _errorMessage = backendRes['message'].toString();
      }
    } catch (e) {
      debugPrint('Spring Boot signin error: $e');
    }

    // STRICT AUTHENTICATION FAILURE - FAKE PASSWORDS WILL NEVER LOG IN
    _status = AuthStatus.error;
    _errorMessage ??= 'Invalid email or password. Please check your login credentials.';
    await HapticService.instance.errorNotification();
    notifyListeners();
    return false;
  }

  /// Register with Email, Password, and Full Name in Supabase & Spring Boot
  Future<bool> signUpWithEmail(String email, String password, String fullName) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    // 1. Register in Supabase Auth
    try {
      final response = await SupabaseService.instance.signUpWithEmail(email, password, fullName);
      if (response.user != null) {
        final user = response.user!;
        _userProfile = UserProfile(
          id: user.id,
          email: email,
          fullName: fullName,
        );
        _status = AuthStatus.authenticated;
        await CacheService.instance.putJson('user_profile', _userProfile!.toJson());

        // Sync to Spring Boot backend customer database
        try {
          await ApiService.instance.signUpBackend(fullName, email, password);
        } catch (_) {}

        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }
    } on AuthException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      debugPrint('Supabase signup error: $e');
    }

    // 2. Register in Spring Boot backend
    try {
      final backendRes = await ApiService.instance.signUpBackend(fullName, email, password);
      if (backendRes['success'] == true) {
        final bUser = backendRes['user'];
        final uid = bUser?['id']?.toString() ?? 'usr-${DateTime.now().millisecondsSinceEpoch}';
        _userProfile = UserProfile(
          id: uid,
          email: email,
          fullName: fullName,
        );
        _status = AuthStatus.authenticated;
        await CacheService.instance.putJson('user_profile', _userProfile!.toJson());
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      } else if (backendRes['message'] != null && _errorMessage == null) {
        _errorMessage = backendRes['message'].toString();
      }
    } catch (e) {
      debugPrint('Spring Boot signup error: $e');
    }

    // STRICT REGISTRATION FAILURE - NO FAKE REGISTRATIONS
    _status = AuthStatus.error;
    _errorMessage ??= 'Registration failed. Email may already be registered or invalid.';
    await HapticService.instance.errorNotification();
    notifyListeners();
    return false;
  }

  /// Update User Profile details and sync to backend
  Future<bool> updateProfile({
    String? fullName,
    String? phone,
    String? gender,
    String? dob,
    String? avatarUrl,
  }) async {
    if (_userProfile == null) return false;

    final updated = _userProfile!.copyWith(
      fullName: fullName,
      phone: phone,
      gender: gender,
      dob: dob,
      avatarUrl: avatarUrl,
    );

    _userProfile = updated;
    notifyListeners();

    // Cache updated profile locally
    await CacheService.instance.putJson('user_profile', updated.toJson());

    // Sync to Spring Boot backend
    final nameParts = (fullName ?? _userProfile!.fullName).trim().split(RegExp(r'\s+'));
    final fName = nameParts.isNotEmpty ? nameParts.first : 'Customer';
    final lName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';

    final success = await ApiService.instance.syncCustomerRecord({
      'id': 'USR-${_userProfile!.id}',
      'firstName': fName,
      'lastName': lName,
      'email': _userProfile!.email,
      'phone': phone ?? _userProfile!.phone,
      'gender': gender ?? _userProfile!.gender,
      'dob': dob ?? _userProfile!.dob,
      'avatar': avatarUrl ?? _userProfile!.avatarUrl,
    });

    return success;
  }

  /// Sign out cleanly
  Future<void> signOut() async {
    await SupabaseService.instance.signOut();
    await CacheService.instance.deleteKey('user_profile');
    _userProfile = null;
    _status = AuthStatus.unauthenticated;
    await HapticService.instance.lightTap();
    notifyListeners();
  }
}
