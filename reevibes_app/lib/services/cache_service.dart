import 'dart:convert';
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

  late Box<String> _contentBox;
  late Box<String> _metaBox;
  late Directory _cacheDir;

  bool _initialised = false;

  /// Initialise Hive and file cache directory.
  Future<void> initialise() async {
    if (_initialised) return;
    await Hive.initFlutter();
    _contentBox = await Hive.openBox<String>('content_cache');
    _metaBox = await Hive.openBox<String>('cache_meta');
    final appDir = await getApplicationDocumentsDirectory();
    _cacheDir = Directory('${appDir.path}/reevibes_cache');
    if (!await _cacheDir.exists()) {
      await _cacheDir.create(recursive: true);
    }
    _initialised = true;
  }

  // ─── Structured Data (JSON) ────────────────────────────────

  /// Store a JSON-serialisable value under [key] with a timestamp.
  Future<void> putJson(String key, dynamic value) async {
    final entry = jsonEncode({
      'data': value,
      'cachedAt': DateTime.now().millisecondsSinceEpoch,
    });
    await _contentBox.put(key, entry);
  }

  /// Retrieve cached JSON for [key]. Returns `null` if expired or missing.
  dynamic getJson(String key, {Duration? maxAge}) {
    final raw = _contentBox.get(key);
    if (raw == null) return null;
    try {
      final entry = jsonDecode(raw);
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(entry['cachedAt']);
      final age = maxAge ?? AppConfig.contentCacheDuration;
      if (DateTime.now().difference(cachedAt) > age) return null;
      return entry['data'];
    } catch (_) {
      return null;
    }
  }

  // ─── Static Assets (files) ─────────────────────────────────

  /// Download and cache a remote file. Returns the local file path.
  Future<String?> cacheFile(String url) async {
    try {
      final fileName = _urlToFileName(url);
      final file = File('${_cacheDir.path}/$fileName');

      // Check if cached and still valid
      if (await file.exists()) {
        final meta = _metaBox.get(url);
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
        await _metaBox.put(url, DateTime.now().millisecondsSinceEpoch.toString());
        return file.path;
      }
    } catch (e) {
      // Return existing cached file if download fails
      final fileName = _urlToFileName(url);
      final file = File('${_cacheDir.path}/$fileName');
      if (await file.exists()) return file.path;
    }
    return null;
  }

  /// Get cached file path without downloading.
  Future<String?> getCachedFilePath(String url) async {
    final fileName = _urlToFileName(url);
    final file = File('${_cacheDir.path}/$fileName');
    if (await file.exists()) return file.path;
    return null;
  }

  // ─── User Preferences ──────────────────────────────────────

  Future<void> putPreference(String key, String value) async {
    await _contentBox.put('pref_$key', value);
  }

  String? getPreference(String key) {
    return _contentBox.get('pref_$key');
  }

  // ─── Cache Management ──────────────────────────────────────

  /// Clear all cached content (keeps preferences).
  Future<void> clearContent() async {
    final keys = _contentBox.keys.where((k) => !k.toString().startsWith('pref_'));
    for (final key in keys) {
      await _contentBox.delete(key);
    }
    await _metaBox.clear();
    if (await _cacheDir.exists()) {
      await _cacheDir.delete(recursive: true);
      await _cacheDir.create(recursive: true);
    }
  }

  /// Total cache size in bytes.
  Future<int> getCacheSize() async {
    int size = 0;
    if (await _cacheDir.exists()) {
      await for (final entity in _cacheDir.list(recursive: true)) {
        if (entity is File) {
          size += await entity.length();
        }
      }
    }
    return size;
  }

  String _urlToFileName(String url) {
    return url.hashCode.toRadixString(16);
  }
}
