import 'package:flutter/material.dart';
import '../services/cache_service.dart';
import '../services/connectivity_service.dart';
import '../services/haptic_service.dart';

/// Interactive offline screen allowing users to browse cached products,
/// categories, cart, wishlist, and profile data when internet is unavailable.
class OfflineScreen extends StatefulWidget {
  final VoidCallback onRetry;

  const OfflineScreen({super.key, required this.onRetry});

  @override
  State<OfflineScreen> createState() => _OfflineScreenState();
}

class _OfflineScreenState extends State<OfflineScreen> {
  int _selectedTab = 0; // 0: Catalog, 1: Profile, 2: Cart

  @override
  Widget build(BuildContext context) {
    final userProfile = CacheService.instance.getUserProfile();
    final products = CacheService.instance.getProducts();
    final categories = CacheService.instance.getCategories();
    final cart = CacheService.instance.getCart();
    final wishlist = CacheService.instance.getWishlist();

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      body: SafeArea(
        child: Column(
          children: [
            // Offline Header Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Color(0xFF141414),
                border: Border(bottom: BorderSide(color: Color(0xFF262626))),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD4AF37).withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.wifi_off_rounded, color: Color(0xFFD4AF37), size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Offline Mode Active',
                          style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          userProfile != null
                              ? 'Logged in as ${userProfile['name']}'
                              : 'Browsing local cached fashion catalog',
                          style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      await HapticService.instance.lightTap();
                      final connected = await ConnectivityService.instance.checkNow();
                      if (connected) {
                        widget.onRetry();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFD4AF37),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      minimumSize: Size.zero,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    child: const Text('RETRY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            // Tab bar selector
            Container(
              color: const Color(0xFF0F0F0F),
              child: Row(
                children: [
                  Expanded(child: _buildTabButton(0, 'Catalog (${products.length})', Icons.grid_view_rounded)),
                  Expanded(child: _buildTabButton(1, 'Profile', Icons.person_rounded)),
                  Expanded(child: _buildTabButton(2, 'Cart (${cart.length})', Icons.shopping_bag_rounded)),
                ],
              ),
            ),

            // Main offline tab content
            Expanded(
              child: _selectedTab == 0
                  ? _buildCatalogTab(products, categories)
                  : _selectedTab == 1
                      ? _buildProfileTab(userProfile)
                      : _buildCartTab(cart, wishlist),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabButton(int index, String label, IconData icon) {
    final isSelected = _selectedTab == index;
    return GestureDetector(
      onTap: () {
        HapticService.instance.lightTap();
        setState(() => _selectedTab = index);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isSelected ? const Color(0xFFD4AF37) : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: isSelected ? const Color(0xFFD4AF37) : Colors.grey),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? const Color(0xFFD4AF37) : Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCatalogTab(List<dynamic> products, List<dynamic> categories) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('CACHED CATEGORIES', style: TextStyle(color: Color(0xFFD4AF37), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        const SizedBox(height: 8),
        SizedBox(
          height: 36,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            itemBuilder: (ctx, i) {
              final cat = categories[i];
              return Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFF262626)),
                ),
                child: Text(
                  '${cat['name']} (${cat['count']})',
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 20),
        const Text('CACHED PRODUCTS', style: TextStyle(color: Color(0xFFD4AF37), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.75,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: products.length,
          itemBuilder: (ctx, i) {
            final p = products[i];
            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF141414),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF262626)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1E1E),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Center(
                        child: Icon(Icons.checkroom_rounded, color: Color(0xFFD4AF37), size: 40),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(p['title'] ?? 'Product', style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold), maxLines: 1),
                  const SizedBox(height: 2),
                  Text(p['category'] ?? '', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 10)),
                  const SizedBox(height: 6),
                  Text(p['price'] ?? '', style: const TextStyle(color: Color(0xFFD4AF37), fontSize: 13, fontWeight: FontWeight.bold)),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildProfileTab(Map<String, dynamic>? profile) {
    if (profile == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.account_circle_outlined, size: 64, color: Colors.grey),
              const SizedBox(height: 12),
              const Text('No Cached Session Found', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Text('Sign in when online to persist your session offline.', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12), textAlign: TextAlign.center),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: const Color(0xFFD4AF37),
                child: Text(
                  (profile['name'] as String? ?? 'R')[0].toUpperCase(),
                  style: const TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(profile['name'] ?? 'User', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(profile['email'] ?? '', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF141414),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF262626)),
            ),
            child: Row(
              children: [
                const Icon(Icons.check_circle_outline_rounded, color: Colors.green, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Session active & saved locally.\nRe-syncs automatically when online.',
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartTab(List<dynamic> cart, List<dynamic> wishlist) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('CACHED CART', style: TextStyle(color: Color(0xFFD4AF37), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        const SizedBox(height: 8),
        if (cart.isEmpty)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF141414), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text('Your cart is empty in offline cache.', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12))),
          ),
        const SizedBox(height: 20),
        const Text('CACHED WISHLIST', style: TextStyle(color: Color(0xFFD4AF37), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        const SizedBox(height: 8),
        if (wishlist.isEmpty)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF141414), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text('No saved items in offline wishlist.', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12))),
          ),
      ],
    );
  }
}
