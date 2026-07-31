import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AnnouncementBar extends StatefulWidget {
  final Map<String, dynamic> config;
  final VoidCallback? onTap;

  const AnnouncementBar({
    super.key,
    required this.config,
    this.onTap,
  });

  @override
  State<AnnouncementBar> createState() => _AnnouncementBarState();
}

class _AnnouncementBarState extends State<AnnouncementBar> {
  Timer? _timer;
  Duration _remaining = Duration.zero;

  @override
  void initState() {
    super.initState();
    _startCountdownIfNeeded();
  }

  @override
  void didUpdateWidget(covariant AnnouncementBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.config['countdownEndsAt'] != widget.config['countdownEndsAt']) {
      _startCountdownIfNeeded();
    }
  }

  void _startCountdownIfNeeded() {
    _timer?.cancel();
    final isCountdownActive = widget.config['countdownActive'] == true;
    final endsAtStr = widget.config['countdownEndsAt']?.toString();

    if (isCountdownActive && endsAtStr != null && endsAtStr.isNotEmpty) {
      try {
        final endsAt = DateTime.parse(endsAtStr);
        _updateRemaining(endsAt);
        _timer = Timer.periodic(const Duration(seconds: 1), (_) {
          _updateRemaining(endsAt);
        });
      } catch (_) {}
    }
  }

  void _updateRemaining(DateTime endsAt) {
    final diff = endsAt.difference(DateTime.now());
    if (mounted) {
      setState(() {
        _remaining = diff.isNegative ? Duration.zero : diff;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Color _parseColor(String? colorHex) {
    if (colorHex == null || colorHex.isEmpty) return const Color(0xFF7C2D12);
    try {
      final hex = colorHex.replaceAll('#', '');
      if (hex.length == 6) {
        return Color(int.parse('FF$hex', radix: 16));
      } else if (hex.length == 8) {
        return Color(int.parse(hex, radix: 16));
      }
    } catch (_) {}
    return const Color(0xFF7C2D12);
  }

  String _formatDuration(Duration duration) {
    final hours = duration.inHours.toString().padLeft(2, '0');
    final minutes = (duration.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (duration.inSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final enabled = widget.config['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    final text = widget.config['text']?.toString() ??
        'Summer Sale Live — Flat 20% Off on First Order';
    final bgColor = _parseColor(widget.config['backgroundColor']?.toString());
    final isCountdownActive = widget.config['countdownActive'] == true && _remaining > Duration.zero;

    return InkWell(
      onTap: widget.onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: bgColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.campaign_outlined, color: Colors.white, size: 16),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                text,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (isCountdownActive) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  _formatDuration(_remaining),
                  style: GoogleFonts.outfit(
                    color: const Color(0xFFFFD700),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
