import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Top-level background message handler for Firebase Cloud Messaging.
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Background message received
}

/// Push notification service using Firebase Cloud Messaging & Local Notifications.
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();
  bool _initialised = false;

  /// Initialise Firebase & Local Notification plugin with Android channels.
  Future<void> initialise() async {
    if (_initialised) return;

    // 1. Initialise Firebase Core
    try {
      await Firebase.initializeApp();
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      await _initFirebaseMessaging();
    } catch (e) {
      // Graceful fallback if Firebase config is missing or uninitialised
    }

    // 2. Initialise Local Notifications
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

  Future<void> _initFirebaseMessaging() async {
    final messaging = FirebaseMessaging.instance;

    // Request notification permission for Android 13+
    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final notification = message.notification;
      if (notification != null) {
        showOrderNotification(
          title: notification.title ?? 'ReeVibes Alert',
          body: notification.body ?? '',
          deepLink: message.data['deep_link'],
        );
      }
    });

    // Handle message tap when app opens from background
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      final deepLink = message.data['deep_link'];
      if (deepLink != null && deepLink.toString().isNotEmpty) {
        _pendingDeepLink = deepLink.toString();
      }
    });
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
