import 'dart:async';
import 'package:flutter/foundation.dart' hide Category;
import '../models/product.dart';
import '../models/category.dart';
import '../services/cache_service.dart';
import '../services/api_service.dart';

/// Repository for handling Product & Category data fetching, caching, and filtering.
class ProductRepository {
  static final ProductRepository instance = ProductRepository._();
  ProductRepository._();

  /// Default fallback curated products for offline browsing or initial empty DB state
  static final List<Product> _sampleProducts = [
    Product(
      id: 'p1',
      name: 'Structured Wool Corset Blazer',
      house: 'Atelier ReeVibes',
      price: 24990,
      originalPrice: 32000,
      category: 'Couture',
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Precision-tailored wool blazer with integrated corset bodice and gold satin lining.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Obsidian Black', 'Chalk White'],
      rating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      isTrending: true,
    ),
    Product(
      id: 'p2',
      name: 'Cashmere Draped Midi Dress',
      house: 'Maison Margiela',
      price: 18500,
      originalPrice: 22000,
      category: 'Dresses',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Ultra-soft Mongolian cashmere dress featuring asymmetric draping and back cowl detail.',
      sizes: ['S', 'M', 'L'],
      colors: ['Oatmeal', 'Espresso'],
      rating: 4.8,
      reviewCount: 24,
      isFeatured: true,
      isTrending: true,
    ),
    Product(
      id: 'p3',
      name: 'Silk Satin Wide-Leg Trousers',
      house: 'Jacquemus',
      price: 14200,
      originalPrice: 17500,
      category: 'Trousers',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'High-waisted heavy silk trousers with fluid motion and concealed side closure.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Champagne Gold', 'Jet Black'],
      rating: 4.7,
      reviewCount: 19,
      isFeatured: false,
      isTrending: true,
    ),
    Product(
      id: 'p4',
      name: 'Embellished Leather Trench Coat',
      house: 'Balmain Paris',
      price: 48990,
      originalPrice: 58000,
      category: 'Outerwear',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Supple lambskin leather trench coat detailed with custom goldlion buttons.',
      sizes: ['S', 'M', 'L'],
      colors: ['Noir Black'],
      rating: 5.0,
      reviewCount: 42,
      isFeatured: true,
      isTrending: false,
    ),
    Product(
      id: 'p5',
      name: 'Linen Sculpted Corset Top',
      house: 'ReeVibes Studio',
      price: 8900,
      originalPrice: 11000,
      category: 'Tops',
      images: [
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Structured Belgian linen top featuring internal boning and subtle square neckline.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Ivory', 'Natural Flax'],
      rating: 4.6,
      reviewCount: 15,
      isFeatured: false,
      isTrending: true,
    ),
    Product(
      id: 'p6',
      name: 'Velvet Evening Minaudière Bag',
      house: 'Saint Laurent',
      price: 29500,
      originalPrice: 34000,
      category: 'Accessories',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Handcrafted velvet clutch with polished gold hardware and detachable chain strap.',
      sizes: ['One Size'],
      colors: ['Midnight Navy', 'Emerald Green', 'Black Gold'],
      rating: 4.9,
      reviewCount: 31,
      isFeatured: true,
      isTrending: true,
    ),
  ];

  static final List<Category> _sampleCategories = [
    Category(id: 'c1', name: 'All Collections', slug: 'all', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', itemCount: 42),
    Category(id: 'c2', name: 'Couture', slug: 'couture', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', itemCount: 12),
    Category(id: 'c3', name: 'Dresses', slug: 'dresses', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', itemCount: 18),
    Category(id: 'c4', name: 'Outerwear', slug: 'outerwear', imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', itemCount: 9),
    Category(id: 'c5', name: 'Trousers', slug: 'trousers', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', itemCount: 15),
    Category(id: 'c6', name: 'Accessories', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', itemCount: 22),
  ];

  /// Fetch products from Spring Boot Backend with local caching fallback
  Future<List<Product>> fetchProducts() async {
    // 1. Try remote fetch first
    try {
      final rawProducts = await ApiService.instance.fetchProducts();
      final rawBuckets = await ApiService.instance.fetchBuckets();

      if (rawProducts != null && rawProducts.isNotEmpty) {
        Set<String> featuredIds = {};
        Set<String> trendingIds = {};

        if (rawBuckets != null) {
          for (var b in rawBuckets) {
            final id = b['id']?.toString() ?? '';
            final pidsStr = b['productIds']?.toString() ?? '';
            final pids = pidsStr.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toSet();

            if (id == 'bkt-featured' || id.contains('featured')) {
              featuredIds.addAll(pids);
            }
            if (id == 'bkt-trending' || id.contains('trending')) {
              trendingIds.addAll(pids);
            }
          }
        }

        final products = rawProducts.map((pMap) {
          final pid = pMap['id']?.toString() ?? '';
          if (featuredIds.contains(pid)) pMap['is_featured'] = true;
          if (trendingIds.contains(pid)) pMap['is_trending'] = true;
          return Product.fromJson(pMap);
        }).toList();

        // Update local cache
        await CacheService.instance.putJson('products_list', rawProducts);
        return products;
      }
    } catch (e) {
      debugPrint('Remote products fetch error: $e');
    }

    // 2. Try cache fallback
    final cached = CacheService.instance.getJson('products_list');
    if (cached is List && cached.isNotEmpty) {
      return cached.map((item) => Product.fromJson(Map<String, dynamic>.from(item))).toList();
    }

    // 3. Fallback sample products
    return _sampleProducts;
  }

  /// Fetch categories from homepage layout / backend or cache
  Future<List<Category>> fetchCategories() async {
    try {
      final layout = await ApiService.instance.fetchHomepageLayout();
      if (layout != null && layout.containsKey('categories')) {
        final rawCats = layout['categories'];
        if (rawCats is List && rawCats.isNotEmpty) {
          final cats = rawCats.map((c) => Category.fromJson(Map<String, dynamic>.from(c))).toList();
          await CacheService.instance.putJson('categories_list', rawCats);
          return cats;
        }
      }
    } catch (e) {
      debugPrint('Remote categories fetch error: $e');
    }

    final cached = CacheService.instance.getJson('categories_list');
    if (cached is List && cached.isNotEmpty) {
      return cached.map((item) => Category.fromJson(Map<String, dynamic>.from(item))).toList();
    }

    return _sampleCategories;
  }

  /// Search products by term
  Future<List<Product>> searchProducts(String query) async {
    final all = await fetchProducts();
    if (query.trim().isEmpty) return all;
    final term = query.toLowerCase().trim();
    return all
        .where((p) =>
            p.name.toLowerCase().contains(term) ||
            p.house.toLowerCase().contains(term) ||
            p.category.toLowerCase().contains(term) ||
            p.description.toLowerCase().contains(term))
        .toList();
  }
}
