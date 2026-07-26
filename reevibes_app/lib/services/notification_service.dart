import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Push notification service using local notifications.
///
/// Designed to work with Supabase Realtime for order updates
/// and promotional notifications.
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();
  bool _initialised = false;

  /// Initialise the notification plugin with Android channels.
  Future<void> initialise() async {
    if (_initialised) return;

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidSettings);

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Create notification channels
    await _createChannels();
    _initialised = true;
  }

  Future<void> _createChannels() async {
    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    if (androidPlugin == null) return;

    const channels = [
      AndroidNotificationChannel(
        'orders',
        'Order Updates',
        description: 'Order confirmation, shipping, and delivery notifications',
        importance: Importance.high,
      ),
      AndroidNotificationChannel(
        'promotions',
        'Offers & Promotions',
        description: 'Flash sales, coupons, and promotional offers',
        importance: Importance.defaultImportance,
      ),
      AndroidNotificationChannel(
        'wishlist',
        'Wishlist Alerts',
        description: 'Price drops and back-in-stock alerts',
        importance: Importance.defaultImportance,
      ),
    ];

    for (final channel in channels) {
      await androidPlugin.createNotificationChannel(channel);
    }
  }

  void _onNotificationTapped(NotificationResponse response) {
    // Deep link handling – payload contains the URL path
    // This will be handled by the WebView navigation
    final payload = response.payload;
    if (payload != null && payload.isNotEmpty) {
      _pendingDeepLink = payload;
    }
  }

  String? _pendingDeepLink;

  /// Consume pending deep link (if any) and clear it.
  String? consumePendingDeepLink() {
    final link = _pendingDeepLink;
    _pendingDeepLink = null;
    return link;
  }

  // ─── Show Notifications ────────────────────────────────────

  /// Show an order update notification.
  Future<void> showOrderNotification({
    required String title,
    required String body,
    String? deepLink,
  }) async {
    await _show(
      channelId: 'orders',
      title: title,
      body: body,
      payload: deepLink,
    );
  }

  /// Show a promotional notification.
  Future<void> showPromoNotification({
    required String title,
    required String body,
    String? deepLink,
  }) async {
    await _show(
      channelId: 'promotions',
      title: title,
      body: body,
      payload: deepLink,
    );
  }

  /// Show a wishlist alert notification.
  Future<void> showWishlistNotification({
    required String title,
    required String body,
    String? deepLink,
  }) async {
    await _show(
      channelId: 'wishlist',
      title: title,
      body: body,
      payload: deepLink,
    );
  }

  Future<void> _show({
    required String channelId,
    required String title,
    required String body,
    String? payload,
  }) async {
    final id = DateTime.now().millisecondsSinceEpoch.remainder(100000);
    await _plugin.show(
      id,
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          channelId == 'orders'
              ? 'Order Updates'
              : channelId == 'promotions'
                  ? 'Offers & Promotions'
                  : 'Wishlist Alerts',
          icon: '@mipmap/ic_launcher',
          priority: channelId == 'orders' ? Priority.high : Priority.defaultPriority,
          importance: channelId == 'orders' ? Importance.high : Importance.defaultImportance,
        ),
      ),
      payload: payload,
    );
  }
}
