import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

/// Centralized API Service for communicating with the ReeVibes Spring Boot Backend.
class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  final http.Client _client = http.Client();

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  /// Fetch backend sync version number
  Future<int?> fetchSyncVersion() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/sync/version'), headers: _headers)
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is Map && data.containsKey('version')) {
          return (data['version'] as num).toInt();
        }
      }
    } catch (e) {
      debugPrint('Error fetching sync version: $e');
    }
    return null;
  }

  /// Fetch all products from vendor catalog
  Future<List<Map<String, dynamic>>?> fetchProducts() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/vendors/products'), headers: _headers)
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching products from API: $e');
    }
    return null;
  }

  /// Fetch product buckets / collections
  Future<List<Map<String, dynamic>>?> fetchBuckets() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/buckets'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching buckets: $e');
    }
    return null;
  }

  /// Fetch homepage layout JSON
  Future<Map<String, dynamic>?> fetchHomepageLayout() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/homepage-layout'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty) {
          final pub = data.firstWhere(
            (l) => l['id'] == 'published',
            orElse: () => data.first,
          );
          if (pub != null && pub['layoutJson'] != null) {
            final jsonStr = pub['layoutJson'].toString();
            if (jsonStr.isNotEmpty) {
              return Map<String, dynamic>.from(jsonDecode(jsonStr));
            }
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching homepage layout: $e');
    }
    return null;
  }

  /// Fetch user profile / customer data from backend
  Future<Map<String, dynamic>?> fetchCustomer(String userIdOrEmail) async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/customers'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          final target = userIdOrEmail.toLowerCase().trim();
          for (var c in data) {
            if (c is Map) {
              final id = c['id']?.toString().toLowerCase();
              final email = c['email']?.toString().toLowerCase();
              if (id == target || email == target || 'usr-$id' == target || id == 'usr-$target') {
                return Map<String, dynamic>.from(c);
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching customer record: $e');
    }
    return null;
  }

  /// Upsert customer record (Create or Update profile, addresses, cart, wishlist, lastLogin)
  Future<bool> syncCustomerRecord(Map<String, dynamic> customerData) async {
    try {
      final id = customerData['id']?.toString();
      if (id != null && id.isNotEmpty) {
        // Try PUT update first
        final updateResponse = await _client
            .put(
              Uri.parse('${AppConfig.backendUrl}/api/customers/$id'),
              headers: _headers,
              body: jsonEncode(customerData),
            )
            .timeout(const Duration(seconds: 8));

        if (updateResponse.statusCode == 200) {
          return true;
        }
      }

      // Fallback to POST create
      final createResponse = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/customers'),
            headers: _headers,
            body: jsonEncode(customerData),
          )
          .timeout(const Duration(seconds: 8));

      return createResponse.statusCode == 200;
    } catch (e) {
      debugPrint('Error syncing customer record: $e');
      return false;
    }
  }

  /// Fetch orders from backend
  Future<List<Map<String, dynamic>>?> fetchOrders() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/orders'), headers: _headers)
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching orders: $e');
    }
    return null;
  }

  /// Create new order on backend
  Future<Map<String, dynamic>?> createOrder(Map<String, dynamic> orderPayload) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/orders'),
            headers: _headers,
            body: jsonEncode(orderPayload),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return Map<String, dynamic>.from(jsonDecode(response.body));
      }
    } catch (e) {
      debugPrint('Error creating order on backend: $e');
    }
    return null;
  }

  /// Create Razorpay order ID on backend
  Future<Map<String, dynamic>?> createRazorpayOrder(double amountInINR, {String? receipt}) async {
    try {
      final amountInPaise = (amountInINR * 100).round();
      final body = {
        'amount': amountInPaise,
        'currency': 'INR',
        'receipt': receipt ?? 'rec_${DateTime.now().millisecondsSinceEpoch}',
      };

      final response = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/create-order'),
            headers: _headers,
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return Map<String, dynamic>.from(jsonDecode(response.body));
      }
    } catch (e) {
      debugPrint('Error creating Razorpay order: $e');
    }
    return null;
  }

  /// Verify Razorpay payment signature on backend
  Future<bool> verifyRazorpayPayment({
    required String razorpayPaymentId,
    required String razorpayOrderId,
    required String razorpaySignature,
  }) async {
    try {
      final body = {
        'razorpay_payment_id': razorpayPaymentId,
        'razorpay_order_id': razorpayOrderId,
        'razorpay_signature': razorpaySignature,
      };

      final response = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/verify-payment'),
            headers: _headers,
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final resMap = jsonDecode(response.body);
        return resMap['status'] == 'success';
      }
    } catch (e) {
      debugPrint('Error verifying Razorpay payment: $e');
    }
    return false;
  }

  /// Fetch active coupons from backend
  Future<List<Map<String, dynamic>>?> fetchCoupons() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/coupons'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching coupons: $e');
    }
    return null;
  }

  /// Fetch product reviews
  Future<List<Map<String, dynamic>>?> fetchReviews() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/reviews'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching reviews: $e');
    }
    return null;
  }

  /// Submit new product review
  Future<bool> submitReview(Map<String, dynamic> reviewPayload) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/reviews'),
            headers: _headers,
            body: jsonEncode(reviewPayload),
          )
          .timeout(const Duration(seconds: 8));

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      debugPrint('Error submitting review: $e');
      return false;
    }
  }

  /// Fetch return requests
  Future<List<Map<String, dynamic>>?> fetchReturns() async {
    try {
      final response = await _client
          .get(Uri.parse('${AppConfig.backendUrl}/api/returns'), headers: _headers)
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          return List<Map<String, dynamic>>.from(data.map((e) => Map<String, dynamic>.from(e)));
        }
      }
    } catch (e) {
      debugPrint('Error fetching returns: $e');
    }
    return null;
  }

  /// Submit return request
  Future<bool> createReturn(Map<String, dynamic> returnPayload) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${AppConfig.backendUrl}/api/returns'),
            headers: _headers,
            body: jsonEncode(returnPayload),
          )
          .timeout(const Duration(seconds: 8));

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      debugPrint('Error submitting return request: $e');
      return false;
    }
  }
}
