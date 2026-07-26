import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app.dart';
import 'services/connectivity_service.dart';
import 'services/cache_service.dart';
import 'services/haptic_service.dart';
import 'services/hardware_service.dart';
import 'services/notification_service.dart';
import 'services/permission_service.dart';
import 'services/supabase_service.dart';

/// Application entry point with multi-tiered crash protection.
void main() {
  runZonedGuarded<Future<void>>(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // 1. Setup global Flutter error handlers so unhandled exceptions never crash the app
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      debugPrint('FlutterError caught safely: ${details.exceptionAsString()}');
    };

    PlatformDispatcher.instance.onError = (Object error, StackTrace stack) {
      debugPrint('PlatformDispatcher caught unhandled error: $error');
      return true; // Prevents app termination
    };

    // 2. Custom ErrorWidget builder for graceful fallback rendering
    ErrorWidget.builder = (FlutterErrorDetails details) {
      return Material(
        color: const Color(0xFF0A0A0A),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.warning_amber_rounded,
                  color: Color(0xFFD4AF37),
                  size: 48,
                ),
                const SizedBox(height: 16),
                const Text(
                  'ReeVibes',
                  style: TextStyle(
                    color: Color(0xFFD4AF37),
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'A temporary display error occurred. Please restart the view.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    };

    // 3. System UI & Orientation configuration
    try {
      await SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
        DeviceOrientation.portraitDown,
      ]);
    } catch (_) {}

    try {
      SystemChrome.setSystemUIOverlayStyle(
        const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
          systemNavigationBarColor: Color(0xFF0D0D0D),
          systemNavigationBarIconBrightness: Brightness.light,
        ),
      );
    } catch (_) {}

    // 4. Safe service initializations (isolated try-catch for each service)
    try {
      await SupabaseService.instance.initialise();
    } catch (e) {
      debugPrint('SupabaseService init error: $e');
    }

    try {
      await HardwareService.instance.initialise();
    } catch (e) {
      debugPrint('HardwareService init error: $e');
    }

    try {
      await CacheService.instance.initialise();
    } catch (e) {
      debugPrint('CacheService init error: $e');
    }

    try {
      await ConnectivityService.instance.initialise();
    } catch (e) {
      debugPrint('ConnectivityService init error: $e');
    }

    try {
      await HapticService.instance.initialise();
    } catch (e) {
      debugPrint('HapticService init error: $e');
    }

    try {
      await NotificationService.instance.initialise();
    } catch (e) {
      debugPrint('NotificationService init error: $e');
    }

    try {
      await PermissionService.instance.requestEssentialPermissions();
    } catch (e) {
      debugPrint('PermissionService init error: $e');
    }

    // 5. Launch Flutter UI
    runApp(const ReeVibesApp());
  }, (Object error, StackTrace stack) {
    debugPrint('Zoned error caught: $error\n$stack');
  });
}
