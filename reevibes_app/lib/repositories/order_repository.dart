import 'package:flutter/foundation.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/address.dart';
import '../services/supabase_service.dart';
import '../services/cache_service.dart';

/// Repository for creating, fetching, and tracking Orders.
class OrderRepository {
  static final OrderRepository instance = OrderRepository._();
  OrderRepository._();

  static const String _ordersCacheKey = 'reevibes_user_orders';

  Future<List<Order>> fetchOrders() async {
    try {
      if (SupabaseService.instance.isInitialised && SupabaseService.instance.currentUser != null) {
        final userId = SupabaseService.instance.currentUser!.id;
        final response = await SupabaseService.instance.client
            .from('orders')
            .select()
            .eq('user_id', userId)
            .order('created_at', ascending: false);

        final List list = response as List;
        final orders = list.map((i) => Order.fromJson(i as Map<String, dynamic>)).toList();
        await CacheService.instance.putJson(_ordersCacheKey, response);
        return orders;
      }
    } catch (e) {
      debugPrint('Error fetching orders from Supabase (reading cache): $e');
    }

    final cached = CacheService.instance.getJson(_ordersCacheKey);
    if (cached != null && cached is List) {
      return cached.map((i) => Order.fromJson(i as Map<String, dynamic>)).toList();
    }

    return [];
  }

  Future<Order> createOrder({
    required List<CartItem> items,
    required double totalAmount,
    required double discountAmount,
    required Address shippingAddress,
    required String paymentMethod,
  }) async {
    final userId = SupabaseService.instance.currentUser?.id ?? 'guest_user';
    final newOrder = Order(
      id: 'ord_${DateTime.now().millisecondsSinceEpoch}',
      orderNumber: 'RV-${(DateTime.now().millisecondsSinceEpoch / 1000).round()}',
      userId: userId,
      items: items,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      paymentStatus: 'PAID',
      status: OrderStatus.confirmed,
      createdAt: DateTime.now(),
      estimatedDelivery: DateTime.now().add(const Duration(days: 4)),
      trackingNumber: 'TRK${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
    );

    try {
      if (SupabaseService.instance.isInitialised && SupabaseService.instance.currentUser != null) {
        await SupabaseService.instance.client.from('orders').insert(newOrder.toJson());
      }
    } catch (e) {
      debugPrint('Warning inserting order to DB: $e');
    }

    // Cache locally
    final currentList = await fetchOrders();
    currentList.insert(0, newOrder);
    await CacheService.instance.putJson(_ordersCacheKey, currentList.map((o) => o.toJson()).toList());

    return newOrder;
  }
}
