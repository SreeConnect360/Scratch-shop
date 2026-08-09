/// App-wide configuration constants for the ReeVibes Flutter application.
///
/// All URLs, API keys, and feature flags are centralised here.
class AppConfig {
  AppConfig._();

  // ─── Website ───────────────────────────────────────────────
  static const String websiteUrl = 'https://reevibes.com';
  static const String backendUrl = 'https://scratch-render-sj9n.onrender.com';

  // ─── Supabase & Razorpay Credentials ─────────────────────
  static const String supabaseUrl = 'https://rofhcjedmviwzysipmav.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmhjamVkbXZpd3p5c2lwbWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNDIxODYsImV4cCI6MjA5ODgxODE4Nn0.t-qUdbcR7y_M_2FzTuyN2fZyZswKuyvD4p931he3WyA';
  static const String razorpayKeyId = 'rzp_live_TD6rmV4Xstddju';

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
    'rofhcjedmviwzysipmav.supabase.co',
    'supabase.co',
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
