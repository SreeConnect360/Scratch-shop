import 'package:flutter/material.dart';

/// ReeVibes Brand Color Palette & Design Tokens.
/// Recreates the luxury dark aesthetic from the ReeVibes mobile web application.
class AppColors {
  AppColors._();

  // Primary Gold Accents
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldLight = Color(0xFFE5C158);
  static const Color goldDeep = Color(0xFFC5A028);
  static const Color goldGlow = Color(0x40D4AF37);

  // Backgrounds & Surfaces (Obsidian Luxury Dark)
  static const Color background = Color(0xFF0A0A0A);
  static const Color surface = Color(0xFF121212);
  static const Color surfaceElevated = Color(0xFF1A1A1A);
  static const Color surfaceBorder = Color(0x1FFFFFFF);
  static const Color glassBorder = Color(0x33D4AF37);

  // Text / Typography
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xB3FFFFFF);
  static const Color textMuted = Color(0x66FFFFFF);

  // Status & Badges
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // Card & Container Overlays
  static const Color cardDark = Color(0xFF141414);
  static const Color divider = Color(0x1F27272A);

  // Gradients
  static const LinearGradient goldGradient = LinearGradient(
    colors: [goldLight, gold, goldDeep],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [Color(0xFF18181B), Color(0xFF0F0F10)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
