# ReeVibes Mobile App (Android)

Professional Flutter Android application wrapping [reevibes.com](https://reevibes.com) in a native WebView shell with offline support, push notifications, haptic feedback, and Play Store readiness.

---

## Features

- 🚀 **Native WebView Shell**: Renders `https://reevibes.com` with hardware acceleration, session persistence, and smooth scrolling.
- 📴 **Offline-First Support**: Dual-layer connectivity detection + local caching via Hive & filesystem for static assets.
- 🔔 **Push & Local Notifications**: Android notification channels for Order Updates, Promotions, and Wishlist Alerts.
- 📳 **Haptic Feedback**: Custom haptic patterns for button presses, cart actions, wishlist toggles, and payment confirmations via JS bridge.
- 📁 **File Uploads & Downloads**: Native file pickers for camera/gallery uploads and download management for invoices/assets.
- 🎨 **Luxury Aesthetic**: Dark mode (#0A0A0A) with gold (#D4AF37) branding, custom animated splash screen, and floating bottom navigation bar.
- 🛡️ **Play Store Ready**: Android 8.0+ (API 26+) support targeting API 36, ProGuard optimization, deep linking (`reevibes.com`), and full permissions management.

---

## Project Structure

```
reevibes_app/
├── android/                    # Android native configuration
│   ├── app/
│   │   ├── build.gradle.kts   # App Gradle config (minSdk 26, targetSdk 36, package: com.reevibes.app)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Permissions, deep links, file providers
│   │       └── res/            # App icons, splash themes, file paths
├── assets/
│   └── images/                # Brand app icons and background assets
├── lib/
│   ├── main.dart              # Application entry point with service initialization
│   ├── app.dart               # MaterialApp configuration with custom theme
│   ├── config/
│   │   └── app_config.dart    # URLs, Supabase credentials, feature flags
│   ├── screens/
│   │   ├── splash_screen.dart # Animated brand splash screen
│   │   ├── home_screen.dart   # Main container with WebView + bottom nav + offline fallback
│   │   └── offline_screen.dart# No-internet screen with retry logic
│   ├── widgets/
│   │   ├── webview_widget.dart# Native WebView with JS bridge and file handling
│   │   └── bottom_nav.dart    # Custom dark/gold bottom navigation bar
│   └── services/
│       ├── connectivity_service.dart # Real-time internet connectivity monitoring
│       ├── cache_service.dart        # Hive & file-based caching manager
│       ├── haptic_service.dart       # Device vibration & haptic manager
│       ├── notification_service.dart # Local & push notification engine
│       ├── download_service.dart     # Web download interception & storage
│       ├── permission_service.dart   # Runtime Android permissions handler
│       └── webview_bridge.dart       # Two-way JavaScript ↔ Flutter bridge
└── pubspec.yaml               # Dependencies & asset declarations
```

---

## How to Build

### 1. Debug APK
Build a debug APK for testing on physical Android devices or emulators:
```bash
flutter build apk --debug
```
Output location: `build/app/outputs/flutter-apk/app-debug.apk`

### 2. Release APK
Build an optimized release APK:
```bash
flutter build apk --release
```
Output location: `build/app/outputs/flutter-apk/app-release.apk`

### 3. Release Android App Bundle (AAB) for Google Play Store
Build an AAB for uploading to Google Play Console:
```bash
flutter build appbundle --release
```
Output location: `build/app/outputs/bundle/release/app-release.aab`

---

## Supabase & Backend Integration

1. Open `lib/config/app_config.dart`.
2. Replace `supabaseUrl` and `supabaseAnonKey` with your actual Supabase project credentials (found in Supabase Dashboard → Settings → API).
3. Push notifications and real-time order updates will automatically sync with your Supabase database.

---

## Production Keystore Setup (Play Store)

For uploading to Google Play Store, generate a release key:
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
```
Then reference `release-key.jks` in `android/key.properties` and update `android/app/build.gradle.kts`.
