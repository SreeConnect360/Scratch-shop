import 'package:permission_handler/permission_handler.dart';

/// Manages Android runtime permissions with user-friendly rationale.
class PermissionService {
  PermissionService._();
  static final PermissionService instance = PermissionService._();

  /// Request camera permission. Returns true if granted.
  Future<bool> requestCamera() async {
    final status = await Permission.camera.request();
    return status.isGranted;
  }

  /// Request storage/photos permission. Returns true if granted.
  Future<bool> requestStorage() async {
    final status = await Permission.photos.request();
    if (status.isGranted) return true;
    // Fallback for older Android
    final storageStatus = await Permission.storage.request();
    return storageStatus.isGranted;
  }

  /// Request location permission. Returns true if granted.
  Future<bool> requestLocation() async {
    final status = await Permission.location.request();
    return status.isGranted;
  }

  /// Request notification permission (Android 13+). Returns true if granted.
  Future<bool> requestNotification() async {
    final status = await Permission.notification.request();
    return status.isGranted;
  }

  /// Check if camera is granted without requesting.
  Future<bool> isCameraGranted() async {
    return await Permission.camera.isGranted;
  }

  /// Check if notification is granted.
  Future<bool> isNotificationGranted() async {
    return await Permission.notification.isGranted;
  }

  /// Request all essential permissions at startup.
  Future<void> requestEssentialPermissions() async {
    await requestNotification();
  }
}
