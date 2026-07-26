import 'package:flutter/services.dart';
import 'package:vibration/vibration.dart';
import '../config/app_config.dart';

/// Centralised haptic / vibration feedback service.
///
/// Provides semantic methods mapped to user actions.
/// Falls back gracefully on devices without vibration hardware.
class HapticService {
  HapticService._();
  static final HapticService instance = HapticService._();

  bool _hasVibrator = false;

  Future<void> initialise() async {
    final hasVib = await Vibration.hasVibrator();
    _hasVibrator = hasVib == true;
  }

  bool get _enabled => AppConfig.enableHapticFeedback && _hasVibrator;

  /// Light tap – button press, navigation.
  Future<void> lightTap() async {
    if (!_enabled) return;
    await HapticFeedback.lightImpact();
  }

  /// Medium impact – add to cart, wishlist toggle.
  Future<void> mediumImpact() async {
    if (!_enabled) return;
    await HapticFeedback.mediumImpact();
  }

  /// Heavy impact – order placed, payment success.
  Future<void> heavyImpact() async {
    if (!_enabled) return;
    await HapticFeedback.heavyImpact();
  }

  /// Success pattern – double pulse.
  Future<void> success() async {
    if (!_enabled) return;
    await Vibration.vibrate(pattern: [0, 40, 80, 40], intensities: [0, 180, 0, 255]);
  }

  /// Error pattern – single long pulse.
  Future<void> error() async {
    if (!_enabled) return;
    await Vibration.vibrate(duration: 150, amplitude: 200);
  }

  /// Selection changed.
  Future<void> selectionClick() async {
    if (!_enabled) return;
    await HapticFeedback.selectionClick();
  }

  /// Execute haptic by name (called from JS bridge).
  Future<void> triggerByName(String name) async {
    switch (name) {
      case 'light':
        await lightTap();
      case 'medium':
        await mediumImpact();
      case 'heavy':
        await heavyImpact();
      case 'success':
        await success();
      case 'error':
        await error();
      case 'selection':
        await selectionClick();
      default:
        await lightTap();
    }
  }
}
