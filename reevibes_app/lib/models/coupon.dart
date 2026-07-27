/// Coupon Model.
class Coupon {
  final String id;
  final String code;
  final String title;
  final String description;
  final double discountPercent;
  final double? maxDiscountAmount;
  final double minOrderAmount;
  final DateTime validUntil;

  Coupon({
    required this.id,
    required this.code,
    required this.title,
    required this.description,
    required this.discountPercent,
    this.maxDiscountAmount,
    this.minOrderAmount = 0.0,
    required this.validUntil,
  });

  bool get isValid => DateTime.now().isBefore(validUntil);

  double calculateDiscount(double orderTotal) {
    if (orderTotal < minOrderAmount) return 0.0;
    double discount = (orderTotal * discountPercent) / 100.0;
    if (maxDiscountAmount != null && discount > maxDiscountAmount!) {
      return maxDiscountAmount!;
    }
    return discount;
  }

  factory Coupon.fromJson(Map<String, dynamic> json) {
    return Coupon(
      id: json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? 'WELCOME10',
      title: json['title']?.toString() ?? 'Special Offer',
      description: json['description']?.toString() ?? 'Get exclusive discount on your order.',
      discountPercent: (json['discount_percent'] ?? json['discountPercent'] ?? 10.0) as double,
      maxDiscountAmount: json['max_discount_amount'] != null ? (json['max_discount_amount'] as num).toDouble() : null,
      minOrderAmount: (json['min_order_amount'] ?? json['minOrderAmount'] ?? 0.0) as double,
      validUntil: json['valid_until'] != null ? DateTime.parse(json['valid_until'].toString()) : DateTime.now().add(const Duration(days: 30)),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'title': title,
      'description': description,
      'discount_percent': discountPercent,
      'max_discount_amount': maxDiscountAmount,
      'min_order_amount': minOrderAmount,
      'valid_until': validUntil.toIso8601String(),
    };
  }
}
