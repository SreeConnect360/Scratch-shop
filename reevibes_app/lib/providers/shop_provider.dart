import 'dart:async';
import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../models/app_notification.dart';
import '../repositories/product_repository.dart';
import '../services/api_service.dart';

/// Provider for Product Catalog, Categories, Search, Filters, Dynamic Banners, Collection Buckets, and Real-Time Admin Sync.
class ShopProvider extends ChangeNotifier {
  List<Product> _products = [];
  List<Product> get products => _products;

  List<Category> _categories = [];
  List<Category> get categories => _categories;

  List<AppNotification> _notifications = [];
  List<AppNotification> get notifications => _notifications;

  List<Map<String, dynamic>> _buckets = [];
  List<Map<String, dynamic>> get buckets => _buckets;

  Map<String, dynamic>? _homepageLayout;
  Map<String, dynamic>? get homepageLayout => _homepageLayout;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String _selectedCategorySlug = 'all';
  String get selectedCategorySlug => _selectedCategorySlug;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  int? _currentSyncVersion;
  Timer? _pollingTimer;

  ShopProvider() {
    loadCatalog();
    _startVersionPolling();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  /// Start background polling for real-time admin updates
  void _startVersionPolling() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 15), (_) async {
      final remoteVer = await ApiService.instance.fetchSyncVersion();
      if (remoteVer != null && remoteVer != _currentSyncVersion) {
        _currentSyncVersion = remoteVer;
        await loadCatalog(silent: true);
      }
    });
  }

  Future<void> loadCatalog({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      notifyListeners();
    }

    try {
      final fetchedProducts = await ProductRepository.instance.fetchProducts();
      final fetchedCategories = await ProductRepository.instance.fetchCategories();
      final fetchedBuckets = await ApiService.instance.fetchBuckets();
      final layout = await ApiService.instance.fetchHomepageLayout();

      _products = fetchedProducts;
      _categories = fetchedCategories;
      if (fetchedBuckets != null) {
        _buckets = fetchedBuckets;
      }
      if (layout != null) {
        _homepageLayout = layout;
      }

      // Seed initial notifications if empty
      if (_notifications.isEmpty) {
        _notifications = [
          AppNotification(
            id: 'n1',
            title: 'Welcome to ReeVibes Couture',
            message: 'Explore exclusive high-fashion curations and limited atelier drops.',
            type: 'promo',
            createdAt: DateTime.now().subtract(const Duration(hours: 2)),
          ),
          AppNotification(
            id: 'n2',
            title: 'Complimentary Express Delivery',
            message: 'Enjoy free insured express shipping on all couture orders above ₹15,000.',
            type: 'promo',
            createdAt: DateTime.now().subtract(const Duration(days: 1)),
          ),
        ];
      }
    } catch (e) {
      debugPrint('Error loading catalog: $e');
    } finally {
      if (!silent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  // ─── DYNAMIC HOMEPAGE CONFIGURATION GETTERS ─────────────────

  /// Dynamic Section Ordering defined in Admin Portal
  List<String> get sectionOrder {
    if (_homepageLayout != null && _homepageLayout!['sectionOrder'] is List) {
      return List<String>.from(
        (_homepageLayout!['sectionOrder'] as List).map((e) => e.toString()),
      );
    }
    return [
      'announcement',
      'hero',
      'categories',
      'collections',
      'featured',
      'newArrivals',
      'trending',
      'flashSale',
      'campaign',
      'bestSellers',
      'recommended',
      'brandStory',
    ];
  }

  /// Announcement Bar configuration
  Map<String, dynamic> get announcementConfig {
    if (_homepageLayout != null && _homepageLayout!['announcement'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['announcement']);
    }
    return {
      'enabled': true,
      'text': 'Summer Sale Live — Flat 20% Off on First Order',
      'backgroundColor': '#7c2d12',
      'countdownActive': true,
      'countdownEndsAt': '2026-07-31T23:59:59',
    };
  }

  String get announcementText => announcementConfig['text']?.toString() ?? 'COMPLIMENTARY EXPRESS DISPATCH ON ALL ORDERS ABOVE ₹15,000';

  /// Hero Banners configuration
  Map<String, dynamic> get heroConfig {
    if (_homepageLayout != null && _homepageLayout!['hero'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['hero']);
    }
    return {'enabled': true};
  }

  List<Map<String, dynamic>> get heroBanners {
    if (_homepageLayout != null) {
      if (_homepageLayout!['hero'] is Map && _homepageLayout!['hero']['banners'] is List) {
        return List<Map<String, dynamic>>.from(
          (_homepageLayout!['hero']['banners'] as List).map((e) => Map<String, dynamic>.from(e)),
        );
      }
      if (_homepageLayout!['heroBanners'] is List) {
        return List<Map<String, dynamic>>.from(
          (_homepageLayout!['heroBanners'] as List).map((e) => Map<String, dynamic>.from(e)),
        );
      }
    }
    return [
      {
        'title': 'THE ROYAL ATELIER',
        'subtitle': 'Curated High Fashion',
        'desktopImage': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
        'mobileImage': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
        'buttonText': 'EXPLORE COLLECTION',
      },
      {
        'title': 'THE ART OF ELEGANCE',
        'subtitle': 'Premium Fabrics & Silhouettes',
        'desktopImage': 'https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=1200&q=80',
        'mobileImage': 'https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=600&q=80',
        'buttonText': 'DISCOVER PREMIUM',
      },
    ];
  }

  /// Categories section configuration
  Map<String, dynamic> get categoriesConfig {
    if (_homepageLayout != null && _homepageLayout!['categories'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['categories']);
    }
    return {'enabled': true};
  }

  /// Flash sale configuration
  Map<String, dynamic> get flashSaleConfig {
    if (_homepageLayout != null && _homepageLayout!['flashSale'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['flashSale']);
    }
    return {'enabled': true, 'discount': 15};
  }

  /// Trending section configuration
  Map<String, dynamic> get trendingConfig {
    if (_homepageLayout != null && _homepageLayout!['trending'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['trending']);
    }
    return {'enabled': true, 'autoMode': true};
  }

  /// New Arrivals section configuration
  Map<String, dynamic> get newArrivalsConfig {
    if (_homepageLayout != null && _homepageLayout!['newArrival'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['newArrival']);
    }
    if (_homepageLayout != null && _homepageLayout!['newArrivals'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['newArrivals']);
    }
    return {'enabled': true, 'productCount': 6};
  }

  /// Campaign section configuration
  Map<String, dynamic> get campaignConfig {
    if (_homepageLayout != null && _homepageLayout!['campaign'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['campaign']);
    }
    return {
      'enabled': true,
      'image': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&h=600&q=80',
      'heading': 'Summer Essentials 2026',
      'ctaText': 'Shop the Campaign',
    };
  }

  /// Best Sellers section configuration
  Map<String, dynamic> get bestSellersConfig {
    if (_homepageLayout != null && _homepageLayout!['bestSellers'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['bestSellers']);
    }
    return {'enabled': true, 'autoMode': true};
  }

  /// Influencer Picks section configuration
  Map<String, dynamic> get influencerPicksConfig {
    if (_homepageLayout != null && _homepageLayout!['influencerPicks'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['influencerPicks']);
    }
    return {'enabled': true};
  }

  /// Lookbook section configuration
  Map<String, dynamic> get lookbookConfig {
    if (_homepageLayout != null && _homepageLayout!['lookbook'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['lookbook']);
    }
    return {'enabled': true};
  }

  /// Recommended section configuration
  Map<String, dynamic> get recommendedConfig {
    if (_homepageLayout != null && _homepageLayout!['recommended'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['recommended']);
    }
    return {'enabled': true};
  }

  /// Brand story configuration
  Map<String, dynamic> get brandStoryConfig {
    if (_homepageLayout != null && _homepageLayout!['brandStory'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['brandStory']);
    }
    return {
      'enabled': true,
      'text': 'Founded in 2024, ReeVibes represents the intersection of digital pageantry and premium avant-garde apparel.',
    };
  }

  /// Chatbot configuration
  Map<String, dynamic> get chatbotConfig {
    if (_homepageLayout != null && _homepageLayout!['chatbot'] is Map) {
      return Map<String, dynamic>.from(_homepageLayout!['chatbot']);
    }
    return {'enabled': true};
  }

  /// Resolve product list for specified layout section ID
  List<Product> getProductsForSection(String sectionId) {
    if (_products.isEmpty) return [];

    final secKey = sectionId.toLowerCase();

    if (secKey == 'trending' || secKey == 'trendingproducts') {
      final config = trendingConfig;
      if (config['autoMode'] == false && config['manualProducts'] is List) {
        final ids = List<String>.from(config['manualProducts']);
        final manualList = _products.where((p) => ids.contains(p.id)).toList();
        if (manualList.isNotEmpty) return manualList;
      }
      final list = _products.where((p) => p.isTrending).toList();
      return list.isNotEmpty ? list : _products.take(6).toList();
    }

    if (secKey == 'bestsellers') {
      final config = bestSellersConfig;
      if (config['autoMode'] == false && config['manualProducts'] is List) {
        final ids = List<String>.from(config['manualProducts']);
        final manualList = _products.where((p) => ids.contains(p.id)).toList();
        if (manualList.isNotEmpty) return manualList;
      }
      return _products.where((p) => p.isFeatured || p.isTrending).toList();
    }

    if (secKey == 'featured' || secKey == 'featuredproducts') {
      final list = _products.where((p) => p.isFeatured).toList();
      return list.isNotEmpty ? list : _products.take(6).toList();
    }

    if (secKey == 'newarrivals' || secKey == 'newarrival') {
      return _products.take(6).toList();
    }

    if (secKey == 'flashsale') {
      final config = flashSaleConfig;
      if (config['products'] is List) {
        final ids = List<String>.from(config['products']);
        final manualList = _products.where((p) => ids.contains(p.id)).toList();
        if (manualList.isNotEmpty) return manualList;
      }
      return _products.take(4).toList();
    }

    if (secKey == 'influencerpicks') {
      final config = influencerPicksConfig;
      if (config['products'] is List) {
        final ids = List<String>.from(config['products']);
        final manualList = _products.where((p) => ids.contains(p.id)).toList();
        if (manualList.isNotEmpty) return manualList;
      }
      return _products.take(4).toList();
    }

    if (secKey == 'recommended') {
      return _products.reversed.take(6).toList();
    }

    return _products.take(6).toList();
  }

  void selectCategory(String slug) {
    _selectedCategorySlug = slug;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  List<Product> get filteredProducts {
    List<Product> list = _products;
    if (_selectedCategorySlug != 'all') {
      list = list.where((p) => p.category.toLowerCase() == _selectedCategorySlug.toLowerCase()).toList();
    }
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((p) =>
          p.name.toLowerCase().contains(q) ||
          p.house.toLowerCase().contains(q) ||
          p.category.toLowerCase().contains(q) ||
          p.description.toLowerCase().contains(q)).toList();
    }
    return list;
  }

  List<Product> get featuredProducts => _products.where((p) => p.isFeatured).toList();
  List<Product> get trendingProducts => _products.where((p) => p.isTrending).toList();

  int get unreadNotificationCount => _notifications.where((n) => !n.isRead).length;

  void markNotificationsRead() {
    _notifications = _notifications.map((n) => AppNotification(
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      deepLink: n.deepLink,
      isRead: true,
      createdAt: n.createdAt,
    )).toList();
    notifyListeners();
  }
}
