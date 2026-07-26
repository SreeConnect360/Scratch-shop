import 'package:flutter/foundation.dart';
import 'package:local_auth/local_auth.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:vibration/vibration.dart';

/// Centralised hardware capability service.
///
/// Ensures the application NEVER crashes on devices lacking hardware features
/// (e.g. no biometrics, no camera, no vibrator, no NFC/Bluetooth).
class HardwareService {
  HardwareService._();
  static final HardwareService instance = HardwareService._();

  final LocalAuthentication _localAuth = LocalAuthentication();

  bool _hasBiometrics = false;
  bool _hasVibrator = false;
  bool _hasCamera = false;
  bool _initialised = false;

  bool get hasBiometrics => _hasBiometrics;
  bool get hasVibrator => _hasVibrator;
  bool get hasCamera => _hasCamera;

  /// Safe initialization of hardware capability checks.
  Future<void> initialise() async {
    if (_initialised) return;

    // 1. Biometrics check
    try {
      final canAuthenticateWithBiometrics = await _localAuth.canCheckBiometrics;
      final isDeviceSupported = await _localAuth.isDeviceSupported();
      _hasBiometrics = canAuthenticateWithBiometrics || isDeviceSupported;
    } catch (e) {
      debugPrint('Biometrics hardware check error: $e');
      _hasBiometrics = false;
    }

    // 2. Vibrator check
    try {
      final hasVib = await Vibration.hasVibrator();
      _hasVibrator = hasVib == true;
    } catch (e) {
      debugPrint('Vibrator hardware check error: $e');
      _hasVibrator = false;
    }

    // 3. Camera check
    try {
      final status = await Permission.camera.status;
      _hasCamera = !status.isPermanentlyDenied;
    } catch (e) {
      debugPrint('Camera hardware check error: $e');
      _hasCamera = false;
    }

    _initialised = true;
  }

  /// Authenticate with biometric fallback. Returns false safely if unsupported.
  Future<bool> authenticateBiometric({required String reason}) async {
    if (!_hasBiometrics) return false;
    try {
      return await _localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } catch (e) {
      debugPrint('Biometric auth error: $e');
      return false;
    }
  }
}
