import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/shop_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/quick_add_modal.dart';
import '../widgets/shimmer_loading.dart';
import '../widgets/announcement_bar.dart';
import '../widgets/chatbot_fab.dart';
import '../repositories/product_repository.dart';
import 'product_detail_screen.dart';
import 'categories_screen.dart';
import 'search_screen.dart';

/// Native Homepage Screen dynamically synchronized with the ReeVibes Admin Portal → Homepage Layout Dashboard.
class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});

  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final PageController _heroPageController = PageController();
  int _activeHeroIndex = 0;

  void _openQuickAdd(BuildContext context, Product product) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => QuickAddModal(product: product),
    );
  }

  void _navigateToProduct(BuildContext context, Product product) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProductDetailScreen(product: product),
      ),
    );
  }

  void _handleBannerRedirect(String? url) async {
    if (url == null || url.isEmpty) return;
    if (url.contains('product')) {
      final parts = url.split('/');
      final pid = parts.isNotEmpty ? parts.last : '';
      if (pid.isNotEmpty) {
        final products = await ProductRepository.instance.fetchProducts();
        final matched = products.firstWhere(
          (p) => p.id == pid || p.id == 'p$pid',
          orElse: () => products.first,
        );
        if (mounted) _navigateToProduct(context, matched);
        return;
      }
    }
    if (url.contains('categories')) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const CategoriesScreen()),
      );
    } else if (url.contains('search')) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const SearchScreen()),
      );
    }
  }

  @override
  void dispose() {
    _heroPageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shopProvider = context.watch<ShopProvider>();
    final isLoading = shopProvider.isLoading;
    final sectionOrder = shopProvider.sectionOrder;
    final chatbotEnabled = shopProvider.chatbotConfig['enabled'] != false;

    return Stack(
      children: [
        RefreshIndicator(
          color: AppColors.gold,
          backgroundColor: AppColors.surfaceElevated,
          onRefresh: () => shopProvider.loadCatalog(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (isLoading)
                  const ShimmerProductGrid()
                else
                  ...sectionOrder.map((sectionKey) => _buildSection(context, shopProvider, sectionKey)),
                const SizedBox(height: 80),
              ],
            ),
          ),
        ),

        // Chatbot Floating Action Button synchronized with Admin Portal
        ChatbotFab(enabled: chatbotEnabled),
      ],
    );
  }

  Widget _buildSection(BuildContext context, ShopProvider provider, String key) {
    final secKey = key.toLowerCase();

    switch (secKey) {
      case 'announcement':
        return AnnouncementBar(
          config: provider.announcementConfig,
          onTap: () => _handleBannerRedirect(provider.announcementConfig['linkUrl']?.toString()),
        );

      case 'hero':
      case 'herobanners':
        return _buildHeroBannersSection(provider);

      case 'categories':
        return _buildCategoriesSection(provider);

      case 'collections':
      case 'buckets':
        return _buildCollectionBucketsSection(provider);

      case 'featured':
      case 'featuredproducts':
        return _buildProductSection(
          context,
          provider,
          title: 'Featured Haute Couture',
          subtitle: 'CURATED SELECTION',
          sectionId: 'featured',
        );

      case 'newarrivals':
      case 'newarrival':
        return _buildProductSection(
          context,
          provider,
          title: 'New Arrivals',
          subtitle: 'FRESH ATELIER DROPS',
          sectionId: 'newArrivals',
        );

      case 'trending':
      case 'trendingproducts':
        return _buildProductSection(
          context,
          provider,
          title: 'Trending Curations',
          subtitle: 'MOST DESIRED PIECES',
          sectionId: 'trending',
        );

      case 'bestsellers':
        return _buildProductSection(
          context,
          provider,
          title: 'Atelier Best Sellers',
          subtitle: 'TOP RATED SELECTION',
          sectionId: 'bestSellers',
        );

      case 'flashsale':
        return _buildFlashSaleSection(context, provider);

      case 'campaign':
        return _buildCampaignSection(provider);

      case 'influencerpicks':
        return _buildProductSection(
          context,
          provider,
          title: 'Stylist & Influencer Picks',
          subtitle: 'SPOTLIGHT CURATION',
          sectionId: 'influencerPicks',
        );

      case 'recommended':
        return _buildProductSection(
          context,
          provider,
          title: 'Recommended For You',
          subtitle: 'TAILORED SELECTION',
          sectionId: 'recommended',
        );

      case 'brandstory':
        return _buildBrandStorySection(provider);

      default:
        return const SizedBox.shrink();
    }
  }

  // 1. HERO BANNERS CAROUSEL
  Widget _buildHeroBannersSection(ShopProvider provider) {
    final heroConfig = provider.heroConfig;
    final enabled = heroConfig['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    final banners = provider.heroBanners;
    if (banners.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        SizedBox(
          height: 220,
          child: PageView.builder(
            controller: _heroPageController,
            onPageChanged: (idx) => setState(() => _activeHeroIndex = idx),
            itemCount: banners.length,
            itemBuilder: (context, index) {
              final banner = banners[index];
              final imgUrl = banner['mobileImage']?.toString().isNotEmpty == true
                  ? banner['mobileImage'].toString()
                  : (banner['desktopImage']?.toString().isNotEmpty == true
                      ? banner['desktopImage'].toString()
                      : (banner['imageUrl']?.toString() ??
                          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'));

              final title = banner['title']?.toString() ?? 'THE ROYAL ATELIER';
              final subtitle = banner['subtitle']?.toString() ?? 'Curated High Fashion';
              final buttonText = banner['buttonText']?.toString() ?? banner['ctaText']?.toString() ?? 'EXPLORE';
              final redirectUrl = banner['redirectUrl']?.toString() ?? banner['link']?.toString();

              return InkWell(
                onTap: () => _handleBannerRedirect(redirectUrl),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  margin: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: NetworkImage(imgUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withOpacity(0.85),
                        Colors.black.withOpacity(0.2),
                      ],
                      begin: Alignment.bottomLeft,
                      end: Alignment.topRight,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.gold,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          buttonText.toUpperCase(),
                          style: GoogleFonts.outfit(
                            color: Colors.black,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        title,
                        style: GoogleFonts.playfairDisplay(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: GoogleFonts.outfit(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
          ),
        ),
        if (banners.length > 1)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              banners.length,
              (index) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: _activeHeroIndex == index ? 20 : 6,
                height: 6,
                decoration: BoxDecoration(
                  color: _activeHeroIndex == index ? AppColors.gold : AppColors.surfaceBorder,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          ),
        const SizedBox(height: 16),
      ],
    );
  }

  // 2. CATEGORY CHIPS SCROLL
  Widget _buildCategoriesSection(ShopProvider provider) {
    final enabled = provider.categoriesConfig['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: SizedBox(
        height: 40,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: provider.categories.length,
          separatorBuilder: (context, index) => const SizedBox(width: 8),
          itemBuilder: (context, index) {
            final cat = provider.categories[index];
            final isSelected = provider.selectedCategorySlug == cat.slug;
            return ChoiceChip(
              label: Text(cat.name),
              selected: isSelected,
              selectedColor: AppColors.gold,
              backgroundColor: AppColors.surface,
              labelStyle: GoogleFonts.outfit(
                color: isSelected ? Colors.black : AppColors.textPrimary,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
              onSelected: (val) {
                if (val) provider.selectCategory(cat.slug);
              },
            );
          },
        ),
      ),
    );
  }

  // 3. COLLECTION BUCKETS SECTION (ADMIN DASHBOARD BUCKETS)
  Widget _buildCollectionBucketsSection(ShopProvider provider) {
    final buckets = provider.buckets.where((b) => b['hidden'] != true).toList();
    if (buckets.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: buckets.map((bucket) {
        final name = bucket['name']?.toString() ?? 'Curated Bucket';
        final starId = bucket['starProductId']?.toString();
        final rawPids = bucket['productIds'];
        List<String> productIds = [];
        if (rawPids is List) {
          productIds = rawPids.map((e) => e.toString()).toList();
        } else if (rawPids is String) {
          productIds = rawPids.split(',').map((s) => s.trim()).where((s) => s.isNotEmpty).toList();
        }

        final bucketProducts = provider.products.where((p) => productIds.contains(p.id)).toList();

        return Container(
          margin: const EdgeInsets.only(bottom: 24),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.surface.withOpacity(0.5),
            border: const Border(
              top: BorderSide(color: AppColors.surfaceBorder, width: 0.5),
              bottom: BorderSide(color: AppColors.surfaceBorder, width: 0.5),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Icon(Icons.stars, color: AppColors.gold, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      name,
                      style: GoogleFonts.playfairDisplay(
                        color: AppColors.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 250,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  scrollDirection: Axis.horizontal,
                  itemCount: bucketProducts.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final product = bucketProducts[index];
                    final isStar = product.id == starId;

                    return Stack(
                      children: [
                        SizedBox(
                          width: 160,
                          child: ProductCard(
                            product: product,
                            onTap: () => _navigateToProduct(context, product),
                            onQuickAdd: () => _openQuickAdd(context, product),
                          ),
                        ),
                        if (isStar)
                          Positioned(
                            top: 8,
                            left: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.gold,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'STAR PIECE',
                                style: GoogleFonts.outfit(
                                  color: Colors.black,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // 4. GENERIC DYNAMIC PRODUCT SECTION
  Widget _buildProductSection(
    BuildContext context,
    ShopProvider provider, {
    required String title,
    required String subtitle,
    required String sectionId,
  }) {
    final products = provider.getProductsForSection(sectionId);
    if (products.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      subtitle,
                      style: GoogleFonts.outfit(
                        color: AppColors.gold,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                    Text(
                      title,
                      style: GoogleFonts.playfairDisplay(
                        color: AppColors.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CategoriesScreen()),
                    );
                  },
                  child: Text(
                    'View All',
                    style: GoogleFonts.outfit(color: AppColors.gold, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.65,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return ProductCard(
                product: product,
                onTap: () => _navigateToProduct(context, product),
                onQuickAdd: () => _openQuickAdd(context, product),
              );
            },
          ),
        ],
      ),
    );
  }

  // 5. FLASH SALE SECTION
  Widget _buildFlashSaleSection(BuildContext context, ShopProvider provider) {
    final config = provider.flashSaleConfig;
    final enabled = config['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    final discount = config['discount'] ?? 15;
    final products = provider.getProductsForSection('flashSale');

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1B18),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gold.withOpacity(0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.flash_on, color: AppColors.gold, size: 20),
              const SizedBox(width: 8),
              Text(
                'FLASH SALE — $discount% OFF',
                style: GoogleFonts.outfit(
                  color: AppColors.gold,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 220,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: products.length,
              separatorBuilder: (context, index) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final product = products[index];
                return SizedBox(
                  width: 140,
                  child: ProductCard(
                    product: product,
                    onTap: () => _navigateToProduct(context, product),
                    onQuickAdd: () => _openQuickAdd(context, product),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // 6. CAMPAIGN SECTION
  Widget _buildCampaignSection(ShopProvider provider) {
    final config = provider.campaignConfig;
    final enabled = config['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    final imgUrl = config['image']?.toString() ??
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&h=600&q=80';
    final heading = config['heading']?.toString() ?? 'Summer Essentials 2026';
    final ctaText = config['ctaText']?.toString() ?? 'Shop the Campaign';

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        image: DecorationImage(image: NetworkImage(imgUrl), fit: BoxFit.cover),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [Colors.black.withOpacity(0.8), Colors.transparent],
            begin: Alignment.bottomLeft,
            end: Alignment.topRight,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              heading,
              style: GoogleFonts.playfairDisplay(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => _handleBannerRedirect(config['redirectUrl']?.toString()),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.gold,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(
                ctaText,
                style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 7. BRAND STORY SECTION
  Widget _buildBrandStorySection(ShopProvider provider) {
    final config = provider.brandStoryConfig;
    final enabled = config['enabled'] ?? true;
    if (!enabled) return const SizedBox.shrink();

    final text = config['text']?.toString() ??
        'ReeVibes represents the intersection of digital pageantry and premium avant-garde apparel.';

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'THE REEVIBES HERITAGE',
            style: GoogleFonts.outfit(
              color: AppColors.gold,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Crafted For Curation',
            style: GoogleFonts.playfairDisplay(
              color: AppColors.textPrimary,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            text,
            style: GoogleFonts.outfit(
              color: AppColors.textSecondary,
              fontSize: 12,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
