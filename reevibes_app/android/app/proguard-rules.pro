# Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.embedding.** { *; }
-keep class io.flutter.provider.** { *; }

# WebView Flutter
-keep class io.flutter.plugins.webviewflutter.** { *; }
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**

# Firebase & Google Play Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Generated Plugin Registrant
-keep class io.flutter.plugins.GeneratedPluginRegistrant { *; }
