import 'dart:async';
import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../models/app_notification.dart';
import '../repositories/product_repository.dart';
import '../services/api_service.dart';

/// Provider for Product Catalog, Categories, Search, Filters, Dynamic Banners, and Real-Time Admin Sync.
class ShopProvider extends ChangeNotifier {
  List<Product> _products = [];
  List<Product> get products => _products;

  List<Category> _categories = [];
  List<Category> get categories => _categories;

  List<AppNotification> _notifications = [];
  List<AppNotification> get notifications => _notifications;

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
      final layout = await ApiService.instance.fetchHomepageLayout();

      _products = fetchedProducts;
      _categories = fetchedCategories;
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

  /// Get announcement text from layout
  String get announcementText {
    if (_homepageLayout != null && _homepageLayout!['announcement'] != null) {
      final ann = _homepageLayout!['announcement'];
      if (ann is Map && ann['text'] != null) {
        return ann['text'].toString();
      }
    }
    return 'COMPLIMENTARY EXPRESS DISPATCH ON ALL ORDERS ABOVE ₹15,000';
  }

  /// Get hero banners list from layout
  List<Map<String, dynamic>> get heroBanners {
    if (_homepageLayout != null && _homepageLayout!['heroBanners'] is List) {
      return List<Map<String, dynamic>>.from(
        (_homepageLayout!['heroBanners'] as List).map((e) => Map<String, dynamic>.from(e)),
      );
    }
    return [
      {
        'title': 'THE AUTUMN ATELIER',
        'subtitle': 'Curated Couture & High Fashion Pieces',
        'imageUrl': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        'ctaText': 'EXPLORE DROP',
      },
      {
        'title': 'MODERN MINIMALISM',
        'subtitle': 'Clean Lines & Timeless Silhouettes',
        'imageUrl': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
        'ctaText': 'VIEW COLLECTION',
      },
    ];
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
