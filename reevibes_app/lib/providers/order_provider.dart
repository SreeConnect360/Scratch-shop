import 'package:flutter/material.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/address.dart';
import '../repositories/order_repository.dart';
import '../services/haptic_service.dart';

/// Provider for managing orders, checkout placement, and order history tracking.
class OrderProvider extends ChangeNotifier {
  List<Order> _orders = [];
  List<Order> get orders => _orders;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  OrderProvider() {
    loadOrders();
  }

  Future<void> loadOrders() async {
    _isLoading = true;
    notifyListeners();

    _orders = await OrderRepository.instance.fetchOrders();

    _isLoading = false;
    notifyListeners();
  }

  Future<Order?> placeOrder({
    required List<CartItem> items,
    required double totalAmount,
    required double discountAmount,
    required Address shippingAddress,
    required String paymentMethod,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final order = await OrderRepository.instance.createOrder(
        items: items,
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      );

      _orders.insert(0, order);
      await HapticService.instance.successNotification();
      _isLoading = false;
      notifyListeners();
      return order;
    } catch (e) {
      debugPrint('Error placing order: $e');
      await HapticService.instance.errorNotification();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
}
