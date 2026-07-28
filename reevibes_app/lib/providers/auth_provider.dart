import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../services/supabase_service.dart';
import '../services/cache_service.dart';
import '../services/haptic_service.dart';
import '../services/api_service.dart';

enum AuthStatus { unauthenticated, authenticating, authenticated, error }

/// Provider managing User Authentication, Email OTP Verification, Profile Sync, and Password Reset.
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
      // Check cached profile for offline usage
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

  /// Perform native Google Sign-In
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
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      } else {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      await HapticService.instance.errorNotification();
      notifyListeners();
      return false;
    }
  }

  /// Sign in with Email and Password (synced with Spring Boot backend & Supabase)
  Future<bool> signInWithEmail(String email, String password) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      // 1. Try Spring Boot backend sign in
      final backendRes = await ApiService.instance.signInBackend(email, password);
      if (backendRes['success'] == true) {
        final bUser = backendRes['user'];
        _userProfile = UserProfile(
          id: bUser['id']?.toString() ?? 'usr-${DateTime.now().millisecondsSinceEpoch}',
          email: bUser['email']?.toString() ?? email,
          fullName: bUser['name']?.toString() ?? email.split('@').first,
        );
        _status = AuthStatus.authenticated;

        // Sync Supabase in background
        try {
          await SupabaseService.instance.signInWithEmail(email, password);
        } catch (_) {}

        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }

      // 2. Fallback to Supabase sign in
      final response = await SupabaseService.instance.signInWithEmail(email, password);
      if (response.user != null) {
        final user = response.user!;
        _userProfile = UserProfile(
          id: user.id,
          email: user.email ?? '',
          fullName: user.userMetadata?['full_name'] ?? user.email?.split('@').first ?? 'ReeVibes Member',
        );
        _status = AuthStatus.authenticated;
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceAll('AuthException: ', '');
      await HapticService.instance.errorNotification();
    }
    notifyListeners();
    return false;
  }

  /// Register with Email, Password, and Full Name
  Future<bool> signUpWithEmail(String email, String password, String fullName) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      // 1. Register in Spring Boot backend
      final backendRes = await ApiService.instance.signUpBackend(fullName, email, password);
      if (backendRes['success'] != true) {
        _errorMessage = backendRes['message']?.toString() ?? 'Backend registration failed';
      }

      // 2. Register in Supabase
      final response = await SupabaseService.instance.signUpWithEmail(email, password, fullName);
      if (response.user != null || backendRes['success'] == true) {
        final uid = response.user?.id ?? backendRes['user']?['id']?.toString() ?? 'usr-${DateTime.now().millisecondsSinceEpoch}';
        _userProfile = UserProfile(
          id: uid,
          email: email,
          fullName: fullName,
        );
        _status = AuthStatus.authenticated;
        await HapticService.instance.successNotification();
        notifyListeners();
        return true;
      }
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceAll('AuthException: ', '');
      await HapticService.instance.errorNotification();
    }
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

  /// Sign out
  Future<void> signOut() async {
    await SupabaseService.instance.signOut();
    _userProfile = null;
    _status = AuthStatus.unauthenticated;
    await HapticService.instance.lightTap();
    notifyListeners();
  }
}
