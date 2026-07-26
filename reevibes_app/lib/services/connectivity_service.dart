import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';

/// Singleton service that monitors network connectivity.
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

  /// Call once at app startup safely without blocking main thread.
  Future<void> initialise() async {
    // Non-blocking background check
    unawaited(_checkInitialConnection());

    try {
      _sub = _connectivity.onConnectivityChanged.listen((results) async {
        final hasNone = results.contains(ConnectivityResult.none);
        if (hasNone) {
          _isConnected = false;
          _controller.add(false);
        } else {
          try {
            final hasInternet = await _internetChecker.hasInternetAccess;
            _isConnected = hasInternet;
            _controller.add(hasInternet);
          } catch (_) {
            _isConnected = true;
            _controller.add(true);
          }
        }
      });
    } catch (_) {}
  }

  Future<void> _checkInitialConnection() async {
    try {
      _isConnected = await _internetChecker.hasInternetAccess;
      _controller.add(_isConnected);
    } catch (_) {
      _isConnected = true;
      _controller.add(true);
    }
  }

  /// Force-check current connectivity.
  Future<bool> checkNow() async {
    try {
      _isConnected = await _internetChecker.hasInternetAccess;
      _controller.add(_isConnected);
    } catch (_) {
      _isConnected = true;
      _controller.add(true);
    }
    return _isConnected;
  }

  void dispose() {
    _sub?.cancel();
    _controller.close();
  }
}
