import 'product.dart';

/// Cart Item Model.
class CartItem {
  final String id;
  final Product product;
  int quantity;
  final String selectedSize;
  final String selectedColor;

  CartItem({
    required this.id,
    required this.product,
    this.quantity = 1,
    required this.selectedSize,
    required this.selectedColor,
  });

  double get totalPrice => product.price * quantity;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id']?.toString() ?? '',
      product: Product.fromJson(json['product'] is Map<String, dynamic> ? json['product'] : json),
      quantity: json['quantity'] as int? ?? 1,
      selectedSize: json['selected_size']?.toString() ?? json['selectedSize']?.toString() ?? 'M',
      selectedColor: json['selected_color']?.toString() ?? json['selectedColor']?.toString() ?? 'Black',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product': product.toJson(),
      'quantity': quantity,
      'selected_size': selectedSize,
      'selected_color': selectedColor,
    };
  }
}
