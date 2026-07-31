import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';
import 'cache_service.dart';
import 'api_service.dart';

/// Centralised Supabase service for authentication, Google OAuth, session persistence, and API calls.
class SupabaseService {
  SupabaseService._();
  static final SupabaseService instance = SupabaseService._();

  bool _initialised = false;
  bool get isInitialised => _initialised;

  // Web Client ID required for Google OAuth on Android to obtain OpenID idToken
  static const String _webClientId = '855678728689-ei0i6duqodu28lud20fllq7ue1qsr3ad.apps.googleusercontent.com';

  late final GoogleSignIn _googleSignIn = GoogleSignIn(
    serverClientId: _webClientId,
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
        await syncActiveUserProfile();
      }
    } catch (e) {
      debugPrint('Supabase init warning (continuing with offline fallback): $e');
      _initialised = false;
    }
  }

  /// Perform Google Sign-In via Native Google SDK safely and reliably.
  Future<Map<String, dynamic>?> signInWithGoogleNative() async {
    if (!_initialised) await initialise();

    try {
      debugPrint('Starting native Google Sign-In SDK...');
      final googleUser = await _googleSignIn.signIn();
      if (googleUser != null) {
        final googleEmail = googleUser.email;
        final googleName = googleUser.displayName ?? googleEmail.split('@').first;
        final googlePhoto = googleUser.photoUrl ?? '';
        final googleId = googleUser.id;

        // Attempt Supabase auth token sign in
        try {
          final googleAuth = await googleUser.authentication;
          final idToken = googleAuth.idToken;
          final accessToken = googleAuth.accessToken;

          if (idToken != null) {
            final response = await Supabase.instance.client.auth.signInWithIdToken(
              provider: OAuthProvider.google,
              idToken: idToken,
              accessToken: accessToken,
            );

            if (response.user != null) {
              await _ensureUserProfile(response.user!);
              await syncActiveUserProfile();
              return {
                'id': response.user!.id,
                'email': response.user!.email ?? googleEmail,
                'name': response.user!.userMetadata?['full_name'] ?? googleName,
                'avatar': response.user!.userMetadata?['avatar_url'] ?? googlePhoto,
              };
            }
          }
        } catch (e) {
          debugPrint('Supabase signInWithIdToken warning (using direct Google user): $e');
        }

        // Direct user profile creation fallback if Google SDK returned valid user
        final nameParts = googleName.trim().split(RegExp(r'\s+'));
        final firstName = nameParts.isNotEmpty ? nameParts.first : 'Customer';
        final lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';

        final targetId = 'USR-GGL-$googleId';
        await ApiService.instance.syncCustomerRecord({
          'id': targetId,
          'firstName': firstName,
          'lastName': lastName,
          'email': googleEmail,
          'avatar': googlePhoto,
          'status': 'Active',
          'roles': 'General',
          'lastLogin': DateTime.now().toIso8601String(),
        });

        return {
          'id': targetId,
          'email': googleEmail,
          'name': googleName,
          'avatar': googlePhoto,
        };
      }
    } catch (e) {
      debugPrint('Native Google Sign-In error: $e');
      throw Exception('Google Sign-In was cancelled or failed to authenticate.');
    }

    return null;
  }

  /// Ensure user profile record exists in Supabase DB and Spring Boot backend
  Future<void> _ensureUserProfile(User user) async {
    final name = user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? user.email?.split('@').first ?? 'ReeVibes Member';
    final avatar = user.userMetadata?['avatar_url'] ?? '';
    final nameParts = name.trim().split(RegExp(r'\s+'));
    final firstName = nameParts.isNotEmpty ? nameParts.first : 'ReeVibes';
    final lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : 'Member';

    try {
      final client = Supabase.instance.client;
      final existing = await client.from('profiles').select().eq('id', user.id).maybeSingle();
      if (existing == null) {
        await client.from('profiles').insert({
          'id': user.id,
          'email': user.email,
          'full_name': name,
          'avatar_url': avatar,
          'role': 'customer',
          'created_at': DateTime.now().toIso8601String(),
        });
      }
    } catch (e) {
      debugPrint('Warning: Could not sync profile to DB table: $e');
    }

    try {
      await ApiService.instance.syncCustomerRecord({
        'id': user.id.startsWith('USR-') ? user.id : 'USR-${user.id}',
        'firstName': firstName,
        'lastName': lastName,
        'email': user.email ?? '',
        'avatar': avatar,
        'status': 'Active',
        'roles': 'General',
        'lastLogin': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      debugPrint('Warning: Could not sync customer to Spring Boot backend: $e');
    }
  }

  /// Sign in with Email and Password
  Future<AuthResponse> signInWithEmail(String email, String password) async {
    if (!_initialised) await initialise();
    final response = await Supabase.instance.client.auth.signInWithPassword(
      email: email,
      password: password,
    );
    if (response.user != null) {
      await _ensureUserProfile(response.user!);
    }
    await syncActiveUserProfile();
    return response;
  }

  /// Register with Email and Password
  Future<AuthResponse> signUpWithEmail(String email, String password, String fullName) async {
    if (!_initialised) await initialise();
    final response = await Supabase.instance.client.auth.signUp(
      email: email,
      password: password,
      data: {'full_name': fullName},
    );
    if (response.user != null) {
      await _ensureUserProfile(response.user!);
    }
    await syncActiveUserProfile();
    return response;
  }

  /// Cache active user profile data locally for offline viewing.
  Future<void> syncActiveUserProfile() async {
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
      await syncActiveUserProfile();
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

  SupabaseClient get client => Supabase.instance.client;
}
