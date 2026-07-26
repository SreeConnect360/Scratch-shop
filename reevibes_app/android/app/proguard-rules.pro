# Flutter Wrapper & Embedding
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.embedding.** { *; }
-keep class io.flutter.provider.** { *; }
-keep class io.flutter.plugins.** { *; }

# WebView Flutter & WebKit
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

# Local Authentication / Biometrics
-keep class androidx.biometric.** { *; }
-dontwarn androidx.biometric.**

# Hive & Storage
-keep class com.topjohnwu.hive.** { *; }
-keepclassmembers class * extends io.realm.RealmObject { *** get*(); void set*(***); }

# Kotlin Coroutines & Standard Library
-keepclassmembers class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# Supabase / HTTP / OkHttp / Retrofit / Gson
-keep class com.google.gson.** { *; }
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
