import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/cache_service.dart';
import '../services/supabase_service.dart';
import '../services/api_service.dart';
import 'product_repository.dart';

/// Repository for handling Wishlist operations, local persistence, and backend sync.
class WishlistRepository {
  static final WishlistRepository instance = WishlistRepository._();
  WishlistRepository._();

  static const String _wishlistKey = 'reevibes_user_wishlist';

  Future<List<Product>> loadWishlist() async {
    try {
      final user = SupabaseService.instance.currentUser;
      if (user == null) {
        // Guest user: clear local cache and return empty wishlist
        await CacheService.instance.deleteKey(_wishlistKey);
        return [];
      }

      // 1. Fetch user's saved wishlist from backend
      final cust = await ApiService.instance.fetchCustomer(user.id);
      if (cust != null && cust['wishlist'] != null && cust['wishlist'].toString().isNotEmpty) {
        try {
          final decoded = jsonDecode(cust['wishlist'].toString());
          if (decoded is List) {
            final List<String> productIds = decoded.map((e) => e.toString()).toList();
            final allProducts = await ProductRepository.instance.fetchProducts();
            final matched = allProducts.where((p) => productIds.contains(p.id)).toList();
            await CacheService.instance.putJson(_wishlistKey, matched.map((m) => m.toJson()).toList());
            return matched;
          }
        } catch (_) {}
      }

      // 2. Fallback to cached wishlist for current logged-in user session
      final cached = CacheService.instance.getJson(_wishlistKey);
      if (cached != null && cached is List) {
        return cached.map((i) => Product.fromJson(Map<String, dynamic>.from(i))).toList();
      }
    } catch (e) {
      debugPrint('Error loading wishlist: $e');
    }
    return [];
  }

  Future<void> saveWishlist(List<Product> items) async {
    try {
      final jsonList = items.map((i) => i.toJson()).toList();
      await CacheService.instance.putJson(_wishlistKey, jsonList);

      final user = SupabaseService.instance.currentUser;
      if (user != null) {
        final targetId = 'USR-${user.id}';
        final wishIds = items.map((i) => i.id).toList();
        await ApiService.instance.syncCustomerRecord({
          'id': targetId,
          'email': user.email ?? '',
          'wishlist': jsonEncode(wishIds),
        });
      }
    } catch (e) {
      debugPrint('Error saving wishlist: $e');
    }
  }

  Future<void> clearWishlist() async {
    await CacheService.instance.deleteKey(_wishlistKey);
    final user = SupabaseService.instance.currentUser;
    if (user != null) {
      final targetId = 'USR-${user.id}';
      await ApiService.instance.syncCustomerRecord({
        'id': targetId,
        'email': user.email ?? '',
        'wishlist': '[]',
      });
    }
  }
}
