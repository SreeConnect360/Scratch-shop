import 'cart_item.dart';
import 'address.dart';

/// Order Status Enum
enum OrderStatus {
  placed,
  confirmed,
  processing,
  shipped,
  outForDelivery,
  delivered,
  cancelled,
  returned,
}

/// Order Model for ReeVibes.
class Order {
  final String id;
  final String orderNumber;
  final String userId;
  final List<CartItem> items;
  final double totalAmount;
  final double discountAmount;
  final double shippingFee;
  final Address shippingAddress;
  final String paymentMethod;
  final String paymentStatus;
  final OrderStatus status;
  final DateTime createdAt;
  final DateTime? estimatedDelivery;
  final String? trackingNumber;

  Order({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.items,
    required this.totalAmount,
    this.discountAmount = 0.0,
    this.shippingFee = 0.0,
    required this.shippingAddress,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.status,
    required this.createdAt,
    this.estimatedDelivery,
    this.trackingNumber,
  });

  String get statusDisplay {
    switch (status) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.confirmed:
        return 'Confirmed';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.outForDelivery:
        return 'Out For Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
      case OrderStatus.returned:
        return 'Returned';
    }
  }

  factory Order.fromJson(Map<String, dynamic> json) {
    OrderStatus parseStatus(String? str) {
      switch (str?.toLowerCase()) {
        case 'confirmed':
          return OrderStatus.confirmed;
        case 'processing':
          return OrderStatus.processing;
        case 'shipped':
          return OrderStatus.shipped;
        case 'outfordelivery':
        case 'out_for_delivery':
          return OrderStatus.outForDelivery;
        case 'delivered':
          return OrderStatus.delivered;
        case 'cancelled':
          return OrderStatus.cancelled;
        case 'returned':
          return OrderStatus.returned;
        default:
          return OrderStatus.placed;
      }
    }

    return Order(
      id: json['id']?.toString() ?? '',
      orderNumber: json['order_number']?.toString() ?? json['orderNumber']?.toString() ?? 'RV-${DateTime.now().millisecondsSinceEpoch}',
      userId: json['user_id']?.toString() ?? '',
      items: json['items'] is List
          ? (json['items'] as List).map((i) => CartItem.fromJson(i as Map<String, dynamic>)).toList()
          : [],
      totalAmount: (json['total_amount'] ?? json['totalAmount'] ?? 0.0) as double,
      discountAmount: (json['discount_amount'] ?? json['discountAmount'] ?? 0.0) as double,
      shippingFee: (json['shipping_fee'] ?? json['shippingFee'] ?? 0.0) as double,
      shippingAddress: Address.fromJson(json['shipping_address'] ?? json['shippingAddress'] ?? {}),
      paymentMethod: json['payment_method']?.toString() ?? 'UPI',
      paymentStatus: json['payment_status']?.toString() ?? 'SUCCESS',
      status: parseStatus(json['status']?.toString()),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
      estimatedDelivery: json['estimated_delivery'] != null ? DateTime.parse(json['estimated_delivery'].toString()) : null,
      trackingNumber: json['tracking_number']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_number': orderNumber,
      'user_id': userId,
      'items': items.map((i) => i.toJson()).toList(),
      'total_amount': totalAmount,
      'discount_amount': discountAmount,
      'shipping_fee': shippingFee,
      'shipping_address': shippingAddress.toJson(),
      'payment_method': paymentMethod,
      'payment_status': paymentStatus,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
      'estimated_delivery': estimatedDelivery?.toIso8601String(),
      'tracking_number': trackingNumber,
    };
  }
}
