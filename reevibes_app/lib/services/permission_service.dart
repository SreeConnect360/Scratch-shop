import 'package:permission_handler/permission_handler.dart';

/// Manages Android runtime permissions with user-friendly rationale.
class PermissionService {
  PermissionService._();
  static final PermissionService instance = PermissionService._();

  /// Request camera permission. Returns true if granted.
  Future<bool> requestCamera() async {
    try {
      final status = await Permission.camera.request();
      return status.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Request storage/photos permission. Returns true if granted.
  Future<bool> requestStorage() async {
    try {
      final status = await Permission.photos.request();
      if (status.isGranted) return true;
      final storageStatus = await Permission.storage.request();
      return storageStatus.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Request location permission. Returns true if granted.
  Future<bool> requestLocation() async {
    try {
      final status = await Permission.location.request();
      return status.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Request notification permission (Android 13+). Returns true if granted.
  Future<bool> requestNotification() async {
    try {
      final status = await Permission.notification.request();
      return status.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Check if camera is granted without requesting.
  Future<bool> isCameraGranted() async {
    try {
      return await Permission.camera.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Check if notification is granted.
  Future<bool> isNotificationGranted() async {
    try {
      return await Permission.notification.isGranted;
    } catch (_) {
      return false;
    }
  }

  /// Request essential permissions safely.
  Future<void> requestEssentialPermissions() async {
    // Non-blocking safe check
    try {
      final status = await Permission.notification.status;
      if (!status.isGranted && !status.isPermanentlyDenied) {
        await Permission.notification.request();
      }
    } catch (_) {}
  }
}
