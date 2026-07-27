import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../models/app_notification.dart';
import '../repositories/product_repository.dart';

/// Provider for Product Catalog, Categories, Search, Filters, and System Notifications.
class ShopProvider extends ChangeNotifier {
  List<Product> _products = [];
  List<Product> get products => _products;

  List<Category> _categories = [];
  List<Category> get categories => _categories;

  List<AppNotification> _notifications = [];
  List<AppNotification> get notifications => _notifications;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String _selectedCategorySlug = 'all';
  String get selectedCategorySlug => _selectedCategorySlug;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  ShopProvider() {
    loadCatalog();
  }

  Future<void> loadCatalog() async {
    _isLoading = true;
    notifyListeners();

    try {
      final fetchedProducts = await ProductRepository.instance.fetchProducts();
      final fetchedCategories = await ProductRepository.instance.fetchCategories();

      _products = fetchedProducts;
      _categories = fetchedCategories;

      // Seed initial notification
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
      _isLoading = false;
      notifyListeners();
    }
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
      list = list.where((p) => p.name.toLowerCase().contains(q) || p.house.toLowerCase().contains(q) || p.category.toLowerCase().contains(q)).toList();
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
