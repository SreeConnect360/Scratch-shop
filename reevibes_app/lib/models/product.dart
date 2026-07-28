import 'dart:convert';

/// Comprehensive Product Data Model for ReeVibes Catalog.
class Product {
  final String id;
  final String name;
  final String house; // Brand / House name (e.g. Maison Margiela, Atelier ReeVibes)
  final double price;
  final double? originalPrice;
  final String category;
  final String subcategory;
  final String gender;
  final String fabric; // Fabric / Material
  final String productType;
  final List<String> images;
  final String description;
  final List<String> sizes;
  final List<String> colors;
  final Map<String, int> sizeStock; // Available stock quantity for each size
  final double rating;
  final int reviewCount;
  final bool isFeatured;
  final bool isTrending;
  final int stock;
  final String status;
  final String careInstructions;
  final String countryOfOrigin;
  final String manufacturer;
  final String fit;
  final String sleeveType;
  final String neckType;
  final String pattern;
  final String occasion;
  final String collection;
  final Map<String, dynamic>? metadata;

  Product({
    required this.id,
    required this.name,
    required this.house,
    required this.price,
    this.originalPrice,
    required this.category,
    this.subcategory = 'Apparel',
    this.gender = 'Unisex',
    this.fabric = '100% Organic Silk & Cotton',
    this.productType = 'Couture',
    required this.images,
    required this.description,
    required this.sizes,
    required this.colors,
    this.sizeStock = const {},
    this.rating = 4.8,
    this.reviewCount = 12,
    this.isFeatured = false,
    this.isTrending = false,
    this.stock = 10,
    this.status = 'PUBLISHED',
    this.careInstructions = 'Dry clean only. Store in a protective garment bag.',
    this.countryOfOrigin = 'India',
    this.manufacturer = 'Atelier ReeVibes Crafts Ltd.',
    this.fit = 'Regular Fit',
    this.sleeveType = 'Full Sleeve',
    this.neckType = 'V-Neck',
    this.pattern = 'Hand-embroidered Atelier Motif',
    this.occasion = 'Celebration & Evening Wear',
    this.collection = 'ReeVibes Heritage Collection',
    this.metadata,
  });

  bool get hasDiscount => originalPrice != null && originalPrice! > price;

  int get discountPercentage {
    if (!hasDiscount || originalPrice == 0) return 0;
    return (((originalPrice! - price) / originalPrice!) * 100).round();
  }

  double get savingsAmount {
    if (!hasDiscount) return 0.0;
    return originalPrice! - price;
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
        return value.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
      } else if (value is String && value.isNotEmpty) {
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            final List decoded = jsonDecode(value);
            return decoded.map((e) => e.toString()).toList();
          } catch (_) {}
        }
        return [value];
      }
      return [];
    }

    double parseDouble(dynamic value, double fallback) {
      if (value is num) return value.toDouble();
      if (value is String) {
        final cleaned = value.replaceAll('₹', '').replaceAll(',', '').trim();
        return double.tryParse(cleaned) ?? fallback;
      }
      return fallback;
    }

    Map<String, int> parseSizeStock(dynamic value, List<String> parsedSizes, int defaultStock) {
      final Map<String, int> result = {};
      if (value is Map) {
        value.forEach((k, v) {
          final sKey = k.toString().toUpperCase();
          final count = v is num ? v.toInt() : (int.tryParse(v.toString()) ?? defaultStock);
          result[sKey] = count;
        });
      } else {
        for (var s in parsedSizes) {
          result[s] = defaultStock;
        }
      }
      return result;
    }

    List<String> rawImages = parseStringList(json['images'] ?? json['image'] ?? json['img']);
    List<String> cleanedImages = rawImages.map((img) {
      if (img.startsWith('http://localhost:8081')) {
        return img.replaceFirst('http://localhost:8081', 'https://scratch-render-sj9n.onrender.com');
      }
      return img;
    }).where((img) => img.isNotEmpty).toList();

    if (cleanedImages.isEmpty) {
      cleanedImages = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'];
    }

    final parsedSizes = parseStringList(json['sizes']).isEmpty ? ['S', 'M', 'L', 'XL'] : parseStringList(json['sizes']);
    final parsedStock = (json['stock'] ?? 10) as int;

    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? json['title']?.toString() ?? 'Luxury Fashion Piece',
      house: json['house']?.toString() ?? json['brand']?.toString() ?? json['designer']?.toString() ?? 'ReeVibes Atelier',
      price: parseDouble(json['price'], 0.0),
      originalPrice: json['original_price'] != null || json['originalPrice'] != null
          ? parseDouble(json['original_price'] ?? json['originalPrice'], 0.0)
          : null,
      category: json['category']?.toString() ?? json['categoryName']?.toString() ?? 'Couture',
      subcategory: json['subcategory']?.toString() ?? json['subCategory']?.toString() ?? 'Apparel',
      gender: json['gender']?.toString() ?? 'Unisex',
      fabric: json['fabric']?.toString() ?? json['material']?.toString() ?? '100% Premium Pure Cotton & Silk',
      productType: json['productType']?.toString() ?? json['type']?.toString() ?? 'Atelier Couture',
      images: cleanedImages,
      description: json['description']?.toString() ?? 'Exquisite luxury craftsmanship with tailored silhouette.',
      sizes: parsedSizes,
      colors: parseStringList(json['colors']).isEmpty ? ['Black', 'Gold', 'Nude'] : parseStringList(json['colors']),
      sizeStock: parseSizeStock(json['sizeStock'] ?? json['size_stock'], parsedSizes, parsedStock),
      rating: parseDouble(json['rating'], 4.8),
      reviewCount: (json['review_count'] ?? json['reviewCount'] ?? 14) as int,
      isFeatured: json['is_featured'] ?? json['isFeatured'] ?? json['featured'] ?? false,
      isTrending: json['is_trending'] ?? json['isTrending'] ?? json['trending'] ?? false,
      stock: parsedStock,
      status: json['status']?.toString() ?? 'PUBLISHED',
      careInstructions: json['careInstructions']?.toString() ?? json['care']?.toString() ?? 'Dry clean only. Store in protective garment bag.',
      countryOfOrigin: json['countryOfOrigin']?.toString() ?? json['origin']?.toString() ?? 'India',
      manufacturer: json['manufacturer']?.toString() ?? 'Atelier ReeVibes Crafts Ltd.',
      fit: json['fit']?.toString() ?? 'Regular Fit',
      sleeveType: json['sleeveType']?.toString() ?? json['sleeve']?.toString() ?? 'Full Sleeve',
      neckType: json['neckType']?.toString() ?? json['neck']?.toString() ?? 'V-Neck',
      pattern: json['pattern']?.toString() ?? 'Solid Luxury Weave',
      occasion: json['occasion']?.toString() ?? 'Celebration & Evening Wear',
      collection: json['collection']?.toString() ?? 'ReeVibes Heritage Collection',
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
      'subcategory': subcategory,
      'gender': gender,
      'fabric': fabric,
      'productType': productType,
      'images': images,
      'description': description,
      'sizes': sizes,
      'colors': colors,
      'sizeStock': sizeStock,
      'rating': rating,
      'review_count': reviewCount,
      'is_featured': isFeatured,
      'is_trending': isTrending,
      'stock': stock,
      'status': status,
      'careInstructions': careInstructions,
      'countryOfOrigin': countryOfOrigin,
      'manufacturer': manufacturer,
      'fit': fit,
      'sleeveType': sleeveType,
      'neckType': neckType,
      'pattern': pattern,
      'occasion': occasion,
      'collection': collection,
      'metadata': metadata,
    };
  }
}
