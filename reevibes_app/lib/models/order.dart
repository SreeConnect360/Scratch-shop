import 'dart:convert';
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
      final val = str?.toLowerCase() ?? '';
      if (val.contains('accept') || val.contains('confirm')) return OrderStatus.confirmed;
      if (val.contains('process') || val.contains('pending')) return OrderStatus.processing;
      if (val.contains('ship') || val.contains('ready') || val.contains('pickup')) return OrderStatus.shipped;
      if (val.contains('out_for_delivery') || val.contains('delivery')) return OrderStatus.outForDelivery;
      if (val.contains('deliver')) return OrderStatus.delivered;
      if (val.contains('cancel')) return OrderStatus.cancelled;
      if (val.contains('return')) return OrderStatus.returned;
      return OrderStatus.placed;
    }

    // Parse items from itemsJson or items list
    List<CartItem> parsedItems = [];
    if (json['items'] is List) {
      parsedItems = (json['items'] as List)
          .map((i) => CartItem.fromJson(Map<String, dynamic>.from(i)))
          .toList();
    } else if (json['itemsJson'] != null && json['itemsJson'].toString().isNotEmpty) {
      try {
        final decoded = jsonDecode(json['itemsJson'].toString());
        if (decoded is List) {
          parsedItems = decoded
              .map((i) => CartItem.fromJson(Map<String, dynamic>.from(i)))
              .toList();
        }
      } catch (e) {
        // Fallback
      }
    }

    // Parse address
    Address parsedAddress;
    if (json['shipping_address'] is Map) {
      parsedAddress = Address.fromJson(Map<String, dynamic>.from(json['shipping_address']));
    } else if (json['shippingAddress'] is Map) {
      parsedAddress = Address.fromJson(Map<String, dynamic>.from(json['shippingAddress']));
    } else {
      final rawAddrStr = json['address']?.toString() ?? 'Default Delivery Address';
      parsedAddress = Address(
        id: 'addr_order',
        fullName: 'Customer',
        phone: '',
        streetAddress: rawAddrStr,
        city: '',
        state: '',
        zipCode: '',
      );
    }

    double parseNum(dynamic val) {
      if (val is num) return val.toDouble();
      if (val is String) return double.tryParse(val) ?? 0.0;
      return 0.0;
    }

    DateTime parseDate(dynamic val) {
      if (val != null && val.toString().isNotEmpty) {
        try {
          return DateTime.parse(val.toString());
        } catch (_) {}
      }
      return DateTime.now();
    }

    final idVal = json['id']?.toString() ?? '';
    final orderNumVal = json['order_number']?.toString() ?? json['orderNumber']?.toString() ?? idVal;

    return Order(
      id: idVal,
      orderNumber: orderNumVal.isNotEmpty ? orderNumVal : 'RV-${DateTime.now().millisecondsSinceEpoch}',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      items: parsedItems,
      totalAmount: parseNum(json['total'] ?? json['total_amount'] ?? json['totalAmount']),
      discountAmount: parseNum(json['discount_amount'] ?? json['discountAmount']),
      shippingFee: parseNum(json['shipping_fee'] ?? json['shippingFee']),
      shippingAddress: parsedAddress,
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? 'Razorpay Gateway',
      paymentStatus: json['paymentStatus']?.toString() ?? json['payment_status']?.toString() ?? 'Paid',
      status: parseStatus(json['status']?.toString()),
      createdAt: parseDate(json['orderDate'] ?? json['order_date'] ?? json['created_at']),
      estimatedDelivery: json['estimatedDeliveryDate'] != null ? parseDate(json['estimatedDeliveryDate']) : null,
      trackingNumber: json['trackingNumber']?.toString() ?? json['tracking_number']?.toString(),
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
