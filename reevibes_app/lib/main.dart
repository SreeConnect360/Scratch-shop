import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app.dart';
import 'services/connectivity_service.dart';
import 'services/cache_service.dart';
import 'services/haptic_service.dart';
import 'services/notification_service.dart';
import 'services/permission_service.dart';

/// Application entry point.
///
/// Initialises all services safely before launching the UI.
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait
  try {
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
  } catch (_) {}

  // Set system UI overlay style for status bar
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

  // Initialise services safely so any service error never crashes the app on launch
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

  runApp(const ReeVibesApp());
}
