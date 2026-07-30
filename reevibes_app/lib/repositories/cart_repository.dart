import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../services/cache_service.dart';
import '../services/supabase_service.dart';
import '../services/api_service.dart';

/// Repository for handling Cart Operations, Local Disk Persistence, and Backend Sync.
class CartRepository {
  static final CartRepository instance = CartRepository._();
  CartRepository._();

  static const String _cartCacheKey = 'reevibes_user_cart';

  Future<List<CartItem>> loadCart() async {
    try {
      final user = SupabaseService.instance.currentUser;
      if (user == null) {
        // Guest user: clear local cache and return empty cart
        await CacheService.instance.deleteKey(_cartCacheKey);
        return [];
      }

      // 1. Fetch user's saved cart from backend
      final cust = await ApiService.instance.fetchCustomer(user.id);
      if (cust != null && cust['cart'] != null && cust['cart'].toString().isNotEmpty) {
        try {
          final decoded = jsonDecode(cust['cart'].toString());
          if (decoded is List) {
            final items = decoded.map((i) => CartItem.fromJson(Map<String, dynamic>.from(i))).toList();
            await CacheService.instance.putJson(_cartCacheKey, decoded);
            return items;
          }
        } catch (_) {}
      }

      // 2. Fallback to cached cart for current logged-in user session
      final cached = CacheService.instance.getJson(_cartCacheKey);
      if (cached != null && cached is List) {
        return cached.map((i) => CartItem.fromJson(Map<String, dynamic>.from(i))).toList();
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

      final user = SupabaseService.instance.currentUser;
      if (user != null) {
        final targetId = 'USR-${user.id}';
        await ApiService.instance.syncCustomerRecord({
          'id': targetId,
          'email': user.email ?? '',
          'cart': jsonEncode(jsonList),
        });
      }
    } catch (e) {
      debugPrint('Error saving cart: $e');
    }
  }

  Future<void> clearCart() async {
    await CacheService.instance.deleteKey(_cartCacheKey);
    final user = SupabaseService.instance.currentUser;
    if (user != null) {
      final targetId = 'USR-${user.id}';
      await ApiService.instance.syncCustomerRecord({
        'id': targetId,
        'email': user.email ?? '',
        'cart': '[]',
      });
    }
  }
}
