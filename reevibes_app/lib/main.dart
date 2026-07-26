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
/// Initialises all services before launching the UI.
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style for status bar
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
      systemNavigationBarColor: Color(0xFF0D0D0D),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialise services (order matters)
  await CacheService.instance.initialise();
  await ConnectivityService.instance.initialise();
  await HapticService.instance.initialise();
  await NotificationService.instance.initialise();
  await PermissionService.instance.requestEssentialPermissions();

  runApp(const ReeVibesApp());
}
