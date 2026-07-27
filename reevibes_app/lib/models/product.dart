/// Product Data Model for ReeVibes Catalog.
class Product {
  final String id;
  final String name;
  final String house; // Brand / House name (e.g. Maison Margiela, Atelier ReeVibes)
  final double price;
  final double? originalPrice;
  final String category;
  final List<String> images;
  final String description;
  final List<String> sizes;
  final List<String> colors;
  final double rating;
  final int reviewCount;
  final bool isFeatured;
  final bool isTrending;
  final int stock;
  final String status;
  final Map<String, dynamic>? metadata;

  Product({
    required this.id,
    required this.name,
    required this.house,
    required this.price,
    this.originalPrice,
    required this.category,
    required this.images,
    required this.description,
    required this.sizes,
    required this.colors,
    this.rating = 4.8,
    this.reviewCount = 12,
    this.isFeatured = false,
    this.isTrending = false,
    this.stock = 10,
    this.status = 'PUBLISHED',
    this.metadata,
  });

  bool get hasDiscount => originalPrice != null && originalPrice! > price;

  int get discountPercentage {
    if (!hasDiscount || originalPrice == 0) return 0;
    return (((originalPrice! - price) / originalPrice!) * 100).round();
  }

  String get primaryImage {
    if (images.isNotEmpty && images.first.isNotEmpty) {
      return images.first;
    }
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    List<String> parseStringList(dynamic value) {
      if (value is List) {
        return value.map((e) => e.toString()).toList();
      } else if (value is String && value.isNotEmpty) {
        return [value];
      }
      return [];
    }

    double parseDouble(dynamic value, double fallback) {
      if (value is num) return value.toDouble();
      if (value is String) return double.tryParse(value) ?? fallback;
      return fallback;
    }

    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? json['title']?.toString() ?? 'Luxury Fashion Piece',
      house: json['house']?.toString() ?? json['brand']?.toString() ?? json['designer']?.toString() ?? 'ReeVibes Atelier',
      price: parseDouble(json['price'], 0.0),
      originalPrice: json['original_price'] != null || json['originalPrice'] != null
          ? parseDouble(json['original_price'] ?? json['originalPrice'], 0.0)
          : null,
      category: json['category']?.toString() ?? 'Couture',
      images: parseStringList(json['images'] ?? json['image']),
      description: json['description']?.toString() ?? 'Exquisite luxury craftsmanship.',
      sizes: parseStringList(json['sizes']).isEmpty ? ['S', 'M', 'L', 'XL'] : parseStringList(json['sizes']),
      colors: parseStringList(json['colors']).isEmpty ? ['Black', 'Gold', 'Nude'] : parseStringList(json['colors']),
      rating: parseDouble(json['rating'], 4.8),
      reviewCount: (json['review_count'] ?? json['reviewCount'] ?? 14) as int,
      isFeatured: json['is_featured'] ?? json['isFeatured'] ?? false,
      isTrending: json['is_trending'] ?? json['isTrending'] ?? false,
      stock: (json['stock'] ?? 10) as int,
      status: json['status']?.toString() ?? 'PUBLISHED',
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'house': house,
      'price': price,
      'original_price': originalPrice,
      'category': category,
      'images': images,
      'description': description,
      'sizes': sizes,
      'colors': colors,
      'rating': rating,
      'review_count': reviewCount,
      'is_featured': isFeatured,
      'is_trending': isTrending,
      'stock': stock,
      'status': status,
      'metadata': metadata,
    };
  }
}
