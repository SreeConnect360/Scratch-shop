import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../services/cache_service.dart';

/// Repository for handling Cart Operations & Local Disk Persistence.
class CartRepository {
  static final CartRepository instance = CartRepository._();
  CartRepository._();

  static const String _cartCacheKey = 'reevibes_user_cart';

  Future<List<CartItem>> loadCart() async {
    try {
      final cached = CacheService.instance.getJson(_cartCacheKey);
      if (cached != null && cached is List) {
        return cached.map((i) => CartItem.fromJson(i as Map<String, dynamic>)).toList();
      }
    } catch (e) {
      debugPrint('Error loading cart: $e');
    }
    return [];
  }

  Future<void> saveCart(List<CartItem> items) async {
    try {
      final jsonList = items.map((i) => i.toJson()).toList();
      await CacheService.instance.putJson(_cartCacheKey, jsonList);
    } catch (e) {
      debugPrint('Error saving cart: $e');
    }
  }

  Future<void> clearCart() async {
    await CacheService.instance.deleteKey(_cartCacheKey);
  }
}
