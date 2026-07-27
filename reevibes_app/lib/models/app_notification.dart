/// App Notification Model.
class AppNotification {
  final String id;
  final String title;
  final String message;
  final String type; // 'order', 'promo', 'system', 'wishlist'
  final String? deepLink;
  final bool isRead;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    this.deepLink,
    this.isRead = false,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? 'Notification',
      message: json['message']?.toString() ?? json['body']?.toString() ?? '',
      type: json['type']?.toString() ?? 'system',
      deepLink: json['deep_link']?.toString() ?? json['deepLink']?.toString(),
      isRead: json['is_read'] ?? json['isRead'] ?? false,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'deep_link': deepLink,
      'is_read': isRead,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
