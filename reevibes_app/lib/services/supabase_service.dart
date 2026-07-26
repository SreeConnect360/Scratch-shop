import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';
import 'cache_service.dart';

/// Centralised Supabase service for authentication, Google OAuth, and session persistence.
class SupabaseService {
  SupabaseService._();
  static final SupabaseService instance = SupabaseService._();

  bool _initialised = false;
  bool get isInitialised => _initialised;

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  /// Safe initialization of Supabase client.
  Future<void> initialise() async {
    if (_initialised) return;

    try {
      if (AppConfig.supabaseUrl.isNotEmpty && AppConfig.supabaseAnonKey.isNotEmpty) {
        await Supabase.initialize(
          url: AppConfig.supabaseUrl,
          anonKey: AppConfig.supabaseAnonKey,
          debug: kDebugMode,
        );
        _initialised = true;

        // Auto-cache active user profile on launch
        await _cacheActiveUserProfile();
      }
    } catch (e) {
      debugPrint('Supabase init warning (continuing with offline fallback): $e');
      _initialised = false;
    }
  }

  /// Perform native Google Sign-In and authenticate with Supabase.
  Future<AuthResponse?> signInWithGoogleNative() async {
    if (!_initialised) await initialise();
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // User cancelled

      final googleAuth = await googleUser.authentication;
      final accessToken = googleAuth.accessToken;
      final idToken = googleAuth.idToken;

      if (idToken == null) {
        throw Exception('Google Sign-In failed: No ID Token retrieved.');
      }

      final response = await Supabase.instance.client.auth.signInWithIdToken(
        provider: OAuthProvider.google,
        idToken: idToken,
        accessToken: accessToken,
      );

      // Cache user profile for offline persistence
      await _cacheActiveUserProfile();
      return response;
    } catch (e) {
      debugPrint('Google Sign-In error: $e');
      return null;
    }
  }

  /// Cache active user profile data locally for offline viewing.
  Future<void> _cacheActiveUserProfile() async {
    try {
      final user = currentUser;
      if (user != null) {
        final profileData = {
          'id': user.id,
          'email': user.email ?? '',
          'name': user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? user.email ?? 'ReeVibes Member',
          'avatar_url': user.userMetadata?['avatar_url'] ?? '',
          'last_signed_in': DateTime.now().toIso8601String(),
        };
        await CacheService.instance.putJson('user_profile', profileData);
      }
    } catch (e) {
      debugPrint('Error caching user profile: $e');
    }
  }

  /// Sync local session and refresh tokens when connectivity is restored.
  Future<void> syncSessionAndData() async {
    if (!_initialised) return;
    try {
      final session = currentSession;
      if (session != null && session.isExpired) {
        await Supabase.instance.client.auth.refreshSession();
      }
      await _cacheActiveUserProfile();
    } catch (e) {
      debugPrint('Sync session error: $e');
    }
  }

  /// Get current auth session safely.
  Session? get currentSession {
    if (!_initialised) return null;
    try {
      return Supabase.instance.client.auth.currentSession;
    } catch (e) {
      debugPrint('Supabase current session error: $e');
      return null;
    }
  }

  /// Get current user safely.
  User? get currentUser {
    if (!_initialised) return null;
    try {
      return Supabase.instance.client.auth.currentUser;
    } catch (e) {
      debugPrint('Supabase current user error: $e');
      return null;
    }
  }

  /// Sign out safely.
  Future<void> signOut() async {
    if (!_initialised) return;
    try {
      await _googleSignIn.signOut();
      await Supabase.instance.client.auth.signOut();
      await CacheService.instance.clearContent();
    } catch (e) {
      debugPrint('Supabase sign out error: $e');
    }
  }
}
