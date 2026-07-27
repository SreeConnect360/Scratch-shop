import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/shop_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/quick_add_modal.dart';
import 'product_detail_screen.dart';

/// Categories & Catalog Filter Screen.
class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  void _openQuickAdd(BuildContext context, Product product) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => QuickAddModal(product: product),
    );
  }

  @override
  Widget build(BuildContext context) {
    final shopProvider = context.watch<ShopProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'COLLECTIONS',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: Column(
        children: [
          // Horizontal Category Tabs
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: shopProvider.categories.length,
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final cat = shopProvider.categories[index];
                final isSelected = shopProvider.selectedCategorySlug == cat.slug;
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
                    if (val) shopProvider.selectCategory(cat.slug);
                  },
                );
              },
            ),
          ),
          const Divider(color: AppColors.surfaceBorder, height: 1),

          // Product Grid
          Expanded(
            child: shopProvider.filteredProducts.isEmpty
                ? Center(
                    child: Text(
                      'No couture pieces in this collection yet.',
                      style: GoogleFonts.outfit(color: AppColors.textMuted),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.65,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: shopProvider.filteredProducts.length,
                    itemBuilder: (context, index) {
                      final product = shopProvider.filteredProducts[index];
                      return ProductCard(
                        product: product,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProductDetailScreen(product: product),
                            ),
                          );
                        },
                        onQuickAdd: () => _openQuickAdd(context, product),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
