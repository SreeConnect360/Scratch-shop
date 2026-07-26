import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';

/// Singleton service that monitors network connectivity.
///
/// Uses [connectivity_plus] for fast state changes and
/// [internet_connection_checker_plus] to verify *actual* internet access.
class ConnectivityService {
  ConnectivityService._();
  static final ConnectivityService instance = ConnectivityService._();

  final Connectivity _connectivity = Connectivity();
  final InternetConnection _internetChecker = InternetConnection();

  final _controller = StreamController<bool>.broadcast();

  /// Stream that emits `true` when internet is available, `false` otherwise.
  Stream<bool> get onConnectivityChanged => _controller.stream;

  bool _isConnected = true;
  bool get isConnected => _isConnected;

  StreamSubscription<List<ConnectivityResult>>? _sub;

  /// Call once at app startup.
  Future<void> initialise() async {
    _isConnected = await _internetChecker.hasInternetAccess;
    _controller.add(_isConnected);

    _sub = _connectivity.onConnectivityChanged.listen((results) async {
      final hasNone = results.contains(ConnectivityResult.none);
      if (hasNone) {
        _isConnected = false;
        _controller.add(false);
      } else {
        // Network adapter is up – verify actual internet
        final hasInternet = await _internetChecker.hasInternetAccess;
        _isConnected = hasInternet;
        _controller.add(hasInternet);
      }
    });
  }

  /// Force-check current connectivity (useful for retry buttons).
  Future<bool> checkNow() async {
    _isConnected = await _internetChecker.hasInternetAccess;
    _controller.add(_isConnected);
    return _isConnected;
  }

  void dispose() {
    _sub?.cancel();
    _controller.close();
  }
}
