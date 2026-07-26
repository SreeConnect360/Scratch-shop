/// App-wide configuration constants for the ReeVibes Flutter application.
///
/// All URLs, API keys, and feature flags are centralised here.
/// Replace placeholder Supabase credentials with your real project values.
class AppConfig {
  AppConfig._();

  // ─── Website ───────────────────────────────────────────────
  static const String websiteUrl = 'https://reevibes.com';
  static const String backendUrl = 'https://scratch-render-sj9n.onrender.com';

  // ─── Supabase (replace with your real credentials) ─────────
  static const String supabaseUrl = 'https://YOUR_PROJECT_REF.supabase.co';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

  // ─── App Meta ──────────────────────────────────────────────
  static const String appName = 'ReeVibes';
  static const String appDescription = 'Premium Fashion Curation';
  static const String packageName = 'com.reevibes.app';

  // ─── Cache Durations ───────────────────────────────────────
  static const Duration contentCacheDuration = Duration(hours: 24);
  static const Duration staticAssetCacheDuration = Duration(days: 7);
  static const Duration connectivityCheckInterval = Duration(seconds: 5);

  // ─── WebView Trusted Domains ───────────────────────────────
  /// URLs that should open inside the WebView.
  static const List<String> trustedDomains = [
    'reevibes.com',
    'www.reevibes.com',
    'scratch-render-sj9n.onrender.com',
    'accounts.google.com',
    'apis.google.com',
  ];

  /// URL patterns that should open in the external browser
  /// (payment gateways, deep links that leave the app).
  static const List<String> externalDomainPatterns = [
    'razorpay.com',
    'paytm.com',
    'phonepe.com',
    'upi://',
    'intent://',
    'play.google.com',
    'apps.apple.com',
    'whatsapp.com',
    'wa.me',
    'tel:',
    'mailto:',
    'sms:',
  ];

  // ─── Feature Flags ─────────────────────────────────────────
  static const bool enableBiometricAuth = false; // opt-in
  static const bool enableHapticFeedback = true;
  static const bool enableOfflineCache = true;
  static const bool enablePushNotifications = true;
}
