import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/shop_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/quick_add_modal.dart';
import 'product_detail_screen.dart';

/// Instant Search Overlay Screen with live autocomplete and trending tags.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  final List<String> _trendingTerms = ['Corset', 'Cashmere', 'Trousers', 'Linen', 'Maison', 'Atelier', 'Trench', 'Velvet'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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
    final results = shopProvider.filteredProducts;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: 16),
          child: TextField(
            controller: _searchController,
            autofocus: true,
            style: GoogleFonts.outfit(color: AppColors.textPrimary),
            onChanged: (val) => shopProvider.setSearchQuery(val),
            decoration: InputDecoration(
              hintText: 'Search corset, cashmere, atelier...',
              hintStyle: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 13),
              filled: true,
              fillColor: AppColors.surfaceElevated,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              prefixIcon: const Icon(Icons.search_rounded, color: AppColors.gold, size: 20),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.close_rounded, color: AppColors.textMuted, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        shopProvider.setSearchQuery('');
                      },
                    )
                  : null,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Trending Terms Chips
          if (_searchController.text.isEmpty) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text(
                'TRENDING SEARCHES',
                style: GoogleFonts.outfit(
                  color: AppColors.gold,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _trendingTerms.map((term) {
                  return ActionChip(
                    label: Text(term),
                    backgroundColor: AppColors.surface,
                    labelStyle: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 12),
                    onPressed: () {
                      _searchController.text = term;
                      shopProvider.setSearchQuery(term);
                    },
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Search Results Grid
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.search_off_rounded, color: AppColors.textMuted, size: 48),
                        const SizedBox(height: 12),
                        Text(
                          'No couture results for "${_searchController.text}"',
                          style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 14),
                        ),
                      ],
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
                    itemCount: results.length,
                    itemBuilder: (context, index) {
                      final product = results[index];
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
