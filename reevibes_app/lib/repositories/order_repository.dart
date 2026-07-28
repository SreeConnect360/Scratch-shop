import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/address.dart';
import '../services/supabase_service.dart';
import '../services/cache_service.dart';
import '../services/api_service.dart';

/// Repository for creating, fetching, and tracking Orders via Spring Boot backend.
class OrderRepository {
  static final OrderRepository instance = OrderRepository._();
  OrderRepository._();

  static const String _ordersCacheKey = 'reevibes_user_orders';

  Future<List<Order>> fetchOrders() async {
    try {
      final user = SupabaseService.instance.currentUser;
      final userId = user?.id ?? '';
      final email = user?.email?.toLowerCase() ?? '';

      final rawOrders = await ApiService.instance.fetchOrders();
      if (rawOrders != null) {
        // Filter orders for the current user if logged in
        final userOrders = rawOrders.where((o) {
          if (email.isEmpty && userId.isEmpty) return true;
          final oUserId = (o['userId'] ?? o['user_id'] ?? '').toString().toLowerCase();
          final oAddr = (o['address'] ?? '').toString().toLowerCase();
          final oItems = (o['itemsJson'] ?? '').toString().toLowerCase();

          return oUserId == userId.toLowerCase() ||
              oUserId == 'usr-$userId'.toLowerCase() ||
              (email.isNotEmpty && (oUserId == email || oAddr.contains(email) || oItems.contains(email)));
        }).toList();

        final parsed = userOrders.map((i) => Order.fromJson(i)).toList();
        parsed.sort((a, b) => b.createdAt.compareTo(a.createdAt));

        await CacheService.instance.putJson(_ordersCacheKey, userOrders);
        return parsed;
      }
    } catch (e) {
      debugPrint('Error fetching orders from Spring Boot backend (reading cache): $e');
    }

    final cached = CacheService.instance.getJson(_ordersCacheKey);
    if (cached != null && cached is List) {
      return cached.map((i) => Order.fromJson(Map<String, dynamic>.from(i))).toList();
    }

    return [];
  }

  Future<Order> createOrder({
    required List<CartItem> items,
    required double totalAmount,
    required double discountAmount,
    required Address shippingAddress,
    required String paymentMethod,
    String? razorpayPaymentId,
    String? razorpayOrderId,
    String? razorpaySignature,
  }) async {
    final user = SupabaseService.instance.currentUser;
    final userId = user?.id != null ? 'USR-${user!.id}' : 'guest_user';
    final orderId = 'ORD-${(1000 + (DateTime.now().millisecondsSinceEpoch % 9000))}';
    final formattedAddr = '${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}';

    final orderPayload = {
      'id': orderId,
      'userId': userId,
      'itemsJson': jsonEncode(items.map((i) => i.toJson()).toList()),
      'total': totalAmount,
      'status': 'Processing',
      'address': formattedAddr,
      'paymentStatus': 'Paid',
      'paymentMethod': paymentMethod,
      'razorpayPaymentId': razorpayPaymentId,
      'razorpayOrderId': razorpayOrderId,
      'razorpaySignature': razorpaySignature,
      'currency': 'INR',
      'transactionDate': DateTime.now().toIso8601String(),
    };

    // Post order to Spring Boot backend
    final res = await ApiService.instance.createOrder(orderPayload);

    final newOrder = Order(
      id: orderId,
      orderNumber: orderId,
      userId: userId,
      items: items,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid',
      status: OrderStatus.processing,
      createdAt: DateTime.now(),
      estimatedDelivery: DateTime.now().add(const Duration(days: 4)),
      trackingNumber: 'RVTRK${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
    );

    // Save to local cache
    try {
      final currentList = await fetchOrders();
      currentList.insert(0, newOrder);
      await CacheService.instance.putJson(_ordersCacheKey, currentList.map((o) => o.toJson()).toList());
    } catch (_) {}

    return res != null ? Order.fromJson(res) : newOrder;
  }
}
