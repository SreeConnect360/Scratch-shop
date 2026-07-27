import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../services/supabase_service.dart';
import '../services/cache_service.dart';
import '../services/haptic_service.dart';

enum AuthStatus { unauthenticated, authenticating, authenticated, error }

/// Provider managing User Authentication, Session State, and Google OAuth.
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
      _userProfile = UserProfile(
        id: user.id,
        email: user.email ?? '',
        fullName: user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? user.email?.split('@').first ?? 'ReeVibes Member',
        avatarUrl: user.userMetadata?['avatar_url'] ?? '',
      );
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

  /// Perform native Google Sign-In
  Future<bool> signInWithGoogle() async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await SupabaseService.instance.signInWithGoogleNative();
      if (response != null && response.user != null) {
        final user = response.user!;
        _userProfile = UserProfile(
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
        return false; // User cancelled
      }
    } catch (e) {
      _status = AuthStatus.error;
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      await HapticService.instance.errorNotification();
      notifyListeners();
      return false;
    }
  }

  /// Sign in with Email and Password
  Future<bool> signInWithEmail(String email, String password) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
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

  /// Register with Email and Password
  Future<bool> signUpWithEmail(String email, String password, String fullName) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await SupabaseService.instance.signUpWithEmail(email, password, fullName);
      if (response.user != null) {
        _userProfile = UserProfile(
          id: response.user!.id,
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

  /// Sign out
  Future<void> signOut() async {
    await SupabaseService.instance.signOut();
    _userProfile = null;
    _status = AuthStatus.unauthenticated;
    await HapticService.instance.lightTap();
    notifyListeners();
  }
}
