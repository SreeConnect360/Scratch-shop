import 'package:flutter/material.dart';
import '../models/product.dart';
import '../repositories/wishlist_repository.dart';
import '../services/haptic_service.dart';

/// Provider for managing User Wishlist items & heart toggles.
class WishlistProvider extends ChangeNotifier {
  List<Product> _items = [];
  List<Product> get items => _items;

  WishlistProvider() {
    _loadWishlist();
  }

  Future<void> _loadWishlist() async {
    _items = await WishlistRepository.instance.loadWishlist();
    notifyListeners();
  }

  Future<void> loadWishlistForUser() async {
    await _loadWishlist();
  }

  void clearSession() {
    _items.clear();
    notifyListeners();
  }

  int get itemCount => _items.length;

  bool isWishlisted(String productId) {
    return _items.any((p) => p.id == productId);
  }

  Future<void> toggleWishlist(Product product) async {
    if (isWishlisted(product.id)) {
      _items.removeWhere((p) => p.id == product.id);
      await HapticService.instance.lightTap();
    } else {
      _items.add(product);
      await HapticService.instance.mediumImpact();
    }
    await WishlistRepository.instance.saveWishlist(_items);
    notifyListeners();
  }

  Future<void> removeFromWishlist(String productId) async {
    _items.removeWhere((p) => p.id == productId);
    await HapticService.instance.lightTap();
    await WishlistRepository.instance.saveWishlist(_items);
    notifyListeners();
  }
}
