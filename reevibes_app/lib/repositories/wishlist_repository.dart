import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/cache_service.dart';

/// Repository for handling Wishlist operations & local persistence.
class WishlistRepository {
  static final WishlistRepository instance = WishlistRepository._();
  WishlistRepository._();

  static const String _wishlistKey = 'reevibes_user_wishlist';

  Future<List<Product>> loadWishlist() async {
    try {
      final cached = CacheService.instance.getJson(_wishlistKey);
      if (cached != null && cached is List) {
        return cached.map((i) => Product.fromJson(i as Map<String, dynamic>)).toList();
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
    } catch (e) {
      debugPrint('Error saving wishlist: $e');
    }
  }
}
