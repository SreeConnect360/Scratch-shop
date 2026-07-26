import 'package:flutter/services.dart';
import 'package:vibration/vibration.dart';
import '../config/app_config.dart';

/// Centralised haptic / vibration feedback service.
class HapticService {
  HapticService._();
  static final HapticService instance = HapticService._();

  bool _hasVibrator = false;

  Future<void> initialise() async {
    try {
      final hasVib = await Vibration.hasVibrator();
      _hasVibrator = hasVib == true;
    } catch (_) {
      _hasVibrator = false;
    }
  }

  bool get _enabled => AppConfig.enableHapticFeedback && _hasVibrator;

  /// Light tap – button press, navigation.
  Future<void> lightTap() async {
    try {
      await HapticFeedback.lightImpact();
    } catch (_) {}
  }

  /// Medium impact – add to cart, wishlist toggle.
  Future<void> mediumImpact() async {
    try {
      await HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  /// Heavy impact – order placed, payment success.
  Future<void> heavyImpact() async {
    try {
      await HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  /// Success pattern – double pulse.
  Future<void> success() async {
    if (!_enabled) return;
    try {
      await Vibration.vibrate(pattern: [0, 40, 80, 40], intensities: [0, 180, 0, 255]);
    } catch (_) {}
  }

  /// Error pattern – single long pulse.
  Future<void> error() async {
    if (!_enabled) return;
    try {
      await Vibration.vibrate(duration: 150, amplitude: 200);
    } catch (_) {}
  }

  /// Selection changed.
  Future<void> selectionClick() async {
    try {
      await HapticFeedback.selectionClick();
    } catch (_) {}
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
