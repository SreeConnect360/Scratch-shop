import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import '../config/app_config.dart';

/// Offline-first cache service using Hive for structured data
/// and file system for static assets (HTML, CSS, JS, images).
class CacheService {
  CacheService._();
  static final CacheService instance = CacheService._();

  Box<String>? _contentBox;
  Box<String>? _metaBox;
  Directory? _cacheDir;

  bool _initialised = false;

  /// Initialise Hive and file cache directory safely with auto-recovery for corrupt boxes.
  Future<void> initialise() async {
    if (_initialised) return;
    try {
      await Hive.initFlutter();

      // Open content_cache box with corruption recovery
      try {
        _contentBox = await Hive.openBox<String>('content_cache');
      } catch (e) {
        debugPrint('Hive content_cache open error, recovering box: $e');
        try {
          await Hive.deleteBoxFromDisk('content_cache');
          _contentBox = await Hive.openBox<String>('content_cache');
        } catch (_) {}
      }

      // Open cache_meta box with corruption recovery
      try {
        _metaBox = await Hive.openBox<String>('cache_meta');
      } catch (e) {
        debugPrint('Hive cache_meta open error, recovering box: $e');
        try {
          await Hive.deleteBoxFromDisk('cache_meta');
          _metaBox = await Hive.openBox<String>('cache_meta');
        } catch (_) {}
      }

      final appDir = await getApplicationDocumentsDirectory();
      _cacheDir = Directory('${appDir.path}/reevibes_cache');
      if (!await _cacheDir!.exists()) {
        await _cacheDir!.create(recursive: true);
      }
    } catch (e) {
      debugPrint('CacheService init warning: $e');
    }
    _initialised = true;
  }

  // ─── Structured Data (JSON) ────────────────────────────────

  /// Store a JSON-serialisable value under [key] with a timestamp.
  Future<void> putJson(String key, dynamic value) async {
    if (_contentBox == null) return;
    try {
      final entry = jsonEncode({
        'data': value,
        'cachedAt': DateTime.now().millisecondsSinceEpoch,
      });
      await _contentBox?.put(key, entry);
    } catch (_) {}
  }

  /// Retrieve cached JSON for [key]. Returns `null` if expired or missing.
  dynamic getJson(String key, {Duration? maxAge, bool ignoreExpiration = false}) {
    if (_contentBox == null) return null;
    try {
      final raw = _contentBox?.get(key);
      if (raw == null) return null;
      final entry = jsonDecode(raw);
      if (!ignoreExpiration) {
        final cachedAt = DateTime.fromMillisecondsSinceEpoch(entry['cachedAt']);
        final age = maxAge ?? AppConfig.contentCacheDuration;
        if (DateTime.now().difference(cachedAt) > age) return null;
      }
      return entry['data'];
    } catch (_) {
      return null;
    }
  }

  // ─── App-Specific Cache Getters ────────────────────────────

  /// Get cached user profile.
  Map<String, dynamic>? getUserProfile() {
    final data = getJson('user_profile', ignoreExpiration: true);
    if (data is Map<String, dynamic>) return data;
    return null;
  }

  /// Get cached products catalog.
  List<dynamic> getProducts() {
    final data = getJson('products_catalog', ignoreExpiration: true);
    if (data is List) return data;
    return [
      {
        'id': 'p1',
        'title': 'Silk Velvet Evening Gown',
        'category': 'Luxury Dresses',
        'price': '\$450.00',
        'image': 'assets/images/app_icon.png',
      },
      {
        'id': 'p2',
        'title': 'Tailored Cashmere Blazer',
        'category': 'Outerwear',
        'price': '\$620.00',
        'image': 'assets/images/app_icon.png',
      },
      {
        'id': 'p3',
        'title': 'Artisanal Leather Tote',
        'category': 'Handbags',
        'price': '\$310.00',
        'image': 'assets/images/app_icon.png',
      },
    ];
  }

  /// Get cached categories.
  List<dynamic> getCategories() {
    final data = getJson('categories_list', ignoreExpiration: true);
    if (data is List) return data;
    return [
      {'name': 'New Arrivals', 'count': 42},
      {'name': 'Haute Couture', 'count': 28},
      {'name': 'Accessories & Gems', 'count': 65},
      {'name': 'Footwear', 'count': 34},
    ];
  }

  /// Get cached cart items.
  List<dynamic> getCart() {
    final data = getJson('user_cart', ignoreExpiration: true);
    if (data is List) return data;
    return [];
  }

  /// Get cached wishlist items.
  List<dynamic> getWishlist() {
    final data = getJson('user_wishlist', ignoreExpiration: true);
    if (data is List) return data;
    return [];
  }

  /// Get cached user orders.
  List<dynamic> getOrders() {
    final data = getJson('user_orders', ignoreExpiration: true);
    if (data is List) return data;
    return [];
  }

  // ─── Static Assets (files) ─────────────────────────────────

  /// Download and cache a remote file. Returns the local file path.
  Future<String?> cacheFile(String url) async {
    if (_cacheDir == null) return null;
    try {
      final fileName = _urlToFileName(url);
      final file = File('${_cacheDir!.path}/$fileName');

      // Check if cached and still valid
      if (await file.exists()) {
        final meta = _metaBox?.get(url);
        if (meta != null) {
          final cachedAt = DateTime.fromMillisecondsSinceEpoch(int.parse(meta));
          if (DateTime.now().difference(cachedAt) < AppConfig.staticAssetCacheDuration) {
            return file.path;
          }
        }
      }

      // Download fresh copy
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        await file.writeAsBytes(response.bodyBytes);
        await _metaBox?.put(url, DateTime.now().millisecondsSinceEpoch.toString());
        return file.path;
      }
    } catch (e) {
      if (_cacheDir != null) {
        final fileName = _urlToFileName(url);
        final file = File('${_cacheDir!.path}/$fileName');
        if (await file.exists()) return file.path;
      }
    }
    return null;
  }

  /// Get cached file path without downloading.
  Future<String?> getCachedFilePath(String url) async {
    if (_cacheDir == null) return null;
    try {
      final fileName = _urlToFileName(url);
      final file = File('${_cacheDir!.path}/$fileName');
      if (await file.exists()) return file.path;
    } catch (_) {}
    return null;
  }

  // ─── User Preferences ──────────────────────────────────────

  Future<void> putPreference(String key, String value) async {
    try {
      await _contentBox?.put('pref_$key', value);
    } catch (_) {}
  }

  String? getPreference(String key) {
    try {
      return _contentBox?.get('pref_$key');
    } catch (_) {
      return null;
    }
  }

  // ─── Cache Management ──────────────────────────────────────

  /// Clear all cached content (keeps preferences).
  Future<void> clearContent() async {
    if (_contentBox != null) {
      final keys = _contentBox!.keys.where((k) => !k.toString().startsWith('pref_'));
      for (final key in keys) {
        await _contentBox!.delete(key);
      }
    }
    await _metaBox?.clear();
    if (_cacheDir != null && await _cacheDir!.exists()) {
      try {
        await _cacheDir!.delete(recursive: true);
        await _cacheDir!.create(recursive: true);
      } catch (_) {}
    }
  }

  /// Total cache size in bytes.
  Future<int> getCacheSize() async {
    int size = 0;
    if (_cacheDir != null && await _cacheDir!.exists()) {
      try {
        await for (final entity in _cacheDir!.list(recursive: true)) {
          if (entity is File) {
            size += await entity.length();
          }
        }
      } catch (_) {}
    }
    return size;
  }

  String _urlToFileName(String url) {
    return url.hashCode.toRadixString(16);
  }
}
