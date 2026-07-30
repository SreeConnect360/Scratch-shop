import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../models/coupon.dart';
import '../repositories/cart_repository.dart';
import '../services/haptic_service.dart';
import '../services/api_service.dart';

/// Provider for managing Cart items, quantity updates, promo coupons, and price calculations.
class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  List<CartItem> get items => _items;

  Coupon? _appliedCoupon;
  Coupon? get appliedCoupon => _appliedCoupon;

  CartProvider() {
    _loadCart();
  }

  Future<void> _loadCart() async {
    _items = await CartRepository.instance.loadCart();
    notifyListeners();
  }

  Future<void> loadCartForUser() async {
    await _loadCart();
  }

  void clearSession() {
    _items.clear();
    _appliedCoupon = null;
    notifyListeners();
  }

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get discountAmount {
    if (_appliedCoupon == null) return 0.0;
    return _appliedCoupon!.calculateDiscount(subtotal);
  }

  double get shippingFee {
    if (subtotal == 0 || subtotal >= 15000) return 0.0;
    return 490.0; // Complimentary above ₹15,000
  }

  double get grandTotal {
    final total = subtotal - discountAmount + shippingFee;
    return total < 0 ? 0 : total;
  }

  Future<void> addToCart(Product product, {String? size, String? color, int quantity = 1}) async {
    final selectedSize = size ?? (product.sizes.isNotEmpty ? product.sizes.first : 'M');
    final selectedColor = color ?? (product.colors.isNotEmpty ? product.colors.first : 'Black');

    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id && item.selectedSize == selectedSize && item.selectedColor == selectedColor,
    );

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(CartItem(
        id: 'cart_${DateTime.now().millisecondsSinceEpoch}',
        product: product,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      ));
    }

    await HapticService.instance.mediumImpact();
    await CartRepository.instance.saveCart(_items);
    notifyListeners();
  }

  Future<void> updateQuantity(String cartItemId, int newQuantity) async {
    final index = _items.indexWhere((i) => i.id == cartItemId);
    if (index >= 0) {
      if (newQuantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = newQuantity;
      }
      await HapticService.instance.lightTap();
      await CartRepository.instance.saveCart(_items);
      notifyListeners();
    }
  }

  Future<void> removeFromCart(String cartItemId) async {
    _items.removeWhere((i) => i.id == cartItemId);
    await HapticService.instance.lightTap();
    await CartRepository.instance.saveCart(_items);
    notifyListeners();
  }

  Future<bool> applyCoupon(String code) async {
    final cleanCode = code.trim().toUpperCase();
    try {
      final backendCoupons = await ApiService.instance.fetchCoupons();
      if (backendCoupons != null && backendCoupons.isNotEmpty) {
        final match = backendCoupons.firstWhere(
          (c) => c['code']?.toString().toUpperCase() == cleanCode,
          orElse: () => {},
        );
        if (match.isNotEmpty) {
          final pct = (match['discountPercent'] ?? match['discount_percent'] ?? 10.0) as num;
          _appliedCoupon = Coupon(
            id: match['code']?.toString() ?? cleanCode,
            code: cleanCode,
            title: match['title']?.toString() ?? 'Atelier Perk',
            description: match['description']?.toString() ?? 'Discount applied at checkout',
            discountPercent: pct.toDouble(),
            validUntil: DateTime.now().add(const Duration(days: 30)),
          );
          await HapticService.instance.successNotification();
          notifyListeners();
          return true;
        }
      }
    } catch (_) {}

    if (cleanCode == 'REEVIBES10' || cleanCode == 'WELCOME10' || cleanCode == 'COUTURE20') {
      _appliedCoupon = Coupon(
        id: 'c_welcome',
        code: cleanCode,
        title: 'Exclusive High Fashion Perk',
        description: '10% instant discount applied',
        discountPercent: 10.0,
        validUntil: DateTime.now().add(const Duration(days: 30)),
      );
      await HapticService.instance.successNotification();
      notifyListeners();
      return true;
    }
    await HapticService.instance.errorNotification();
    return false;
  }

  void removeCoupon() {
    _appliedCoupon = null;
    notifyListeners();
  }

  Future<void> clearCart() async {
    _items.clear();
    _appliedCoupon = null;
    await CartRepository.instance.clearCart();
    notifyListeners();
  }
}
