import 'package:flutter/material.dart';
import '../services/connectivity_service.dart';
import '../services/haptic_service.dart';

/// Full-screen offline indicator with retry capability.
///
/// Shown when an internet-dependent action is attempted without connectivity.
/// The top/bottom chrome remains visible from the parent scaffold.
class OfflineScreen extends StatelessWidget {
  final VoidCallback onRetry;

  const OfflineScreen({super.key, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0A0A0A),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Offline illustration
              Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFFD4AF37).withOpacity(0.15),
                      const Color(0xFF1A1A1A),
                    ],
                  ),
                  border: Border.all(
                    color: const Color(0xFFD4AF37).withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: const Icon(
                  Icons.wifi_off_rounded,
                  size: 64,
                  color: Color(0xFFD4AF37),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'No Internet Connection',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Please connect to the internet to continue.\nCached content may still be available.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 36),
              // Retry button
              SizedBox(
                width: 200,
                height: 48,
                child: ElevatedButton(
                  onPressed: () async {
                    await HapticService.instance.lightTap();
                    final connected = await ConnectivityService.instance.checkNow();
                    if (connected) {
                      onRetry();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD4AF37),
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 0,
                    textStyle: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                    ),
                  ),
                  child: const Text('RETRY'),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Will auto-reconnect when internet is available',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.35),
                  fontSize: 11,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
