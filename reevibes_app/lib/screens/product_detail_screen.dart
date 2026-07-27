import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../providers/wishlist_provider.dart';
import 'cart_screen.dart';

/// Full Native Product Details Screen.
class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _selectedImageIndex = 0;
  late String _selectedSize;
  late String _selectedColor;

  @override
  void initState() {
    super.initState();
    _selectedSize = widget.product.sizes.isNotEmpty ? widget.product.sizes.first : 'M';
    _selectedColor = widget.product.colors.isNotEmpty ? widget.product.colors.first : 'Black';
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    final isWishlisted = context.watch<WishlistProvider>().isWishlisted(widget.product.id);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Collapsible Image Header
          SliverAppBar(
            expandedHeight: 420,
            pinned: true,
            backgroundColor: AppColors.background,
            actions: [
              IconButton(
                icon: Icon(
                  isWishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: isWishlisted ? AppColors.gold : Colors.white,
                ),
                onPressed: () {
                  context.read<WishlistProvider>().toggleWishlist(widget.product);
                },
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  PageView.builder(
                    itemCount: widget.product.images.isNotEmpty ? widget.product.images.length : 1,
                    onPageChanged: (idx) => setState(() => _selectedImageIndex = idx),
                    itemBuilder: (context, index) {
                      final imgUrl = widget.product.images.isNotEmpty ? widget.product.images[index] : widget.product.primaryImage;
                      return Image.network(
                        imgUrl,
                        fit: BoxFit.cover,
                        width: double.infinity,
                      );
                    },
                  ),
                  if (widget.product.images.length > 1)
                    Positioned(
                      bottom: 16,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          widget.product.images.length,
                          (idx) => Container(
                            width: _selectedImageIndex == idx ? 20 : 6,
                            height: 6,
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            decoration: BoxDecoration(
                              color: _selectedImageIndex == idx ? AppColors.gold : Colors.white54,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Product Details Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // House Brand Name
                  Text(
                    widget.product.house.toUpperCase(),
                    style: GoogleFonts.outfit(
                      color: AppColors.gold,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Title
                  Text(
                    widget.product.name,
                    style: GoogleFonts.playfairDisplay(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Rating Bar
                  Row(
                    children: [
                      RatingBarIndicator(
                        rating: widget.product.rating,
                        itemBuilder: (context, index) => const Icon(Icons.star_rounded, color: AppColors.gold),
                        itemCount: 5,
                        itemSize: 16,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.product.rating} (${widget.product.reviewCount} Reviews)',
                        style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Price Row
                  Row(
                    children: [
                      Text(
                        currencyFormatter.format(widget.product.price),
                        style: GoogleFonts.outfit(
                          color: AppColors.textPrimary,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (widget.product.hasDiscount) ...[
                        const SizedBox(width: 10),
                        Text(
                          currencyFormatter.format(widget.product.originalPrice),
                          style: GoogleFonts.outfit(
                            color: AppColors.textMuted,
                            fontSize: 16,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.goldGlow,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppColors.gold),
                          ),
                          child: Text(
                            '${widget.product.discountPercentage}% OFF',
                            style: GoogleFonts.outfit(
                              color: AppColors.gold,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Divider(color: AppColors.surfaceBorder),
                  const SizedBox(height: 16),

                  // Size Selection
                  Text(
                    'SELECT SIZE',
                    style: GoogleFonts.outfit(
                      color: AppColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: widget.product.sizes.map((size) {
                      final isSelected = size == _selectedSize;
                      return ChoiceChip(
                        label: Text(size),
                        selected: isSelected,
                        selectedColor: AppColors.gold,
                        backgroundColor: AppColors.surface,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.black : AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                        onSelected: (val) {
                          if (val) setState(() => _selectedSize = size);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Color Selection
                  Text(
                    'SELECT COLOR',
                    style: GoogleFonts.outfit(
                      color: AppColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: widget.product.colors.map((col) {
                      final isSelected = col == _selectedColor;
                      return ChoiceChip(
                        label: Text(col),
                        selected: isSelected,
                        selectedColor: AppColors.gold,
                        backgroundColor: AppColors.surface,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.black : AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                        onSelected: (val) {
                          if (val) setState(() => _selectedColor = col);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                  const Divider(color: AppColors.surfaceBorder),
                  const SizedBox(height: 16),

                  // Description
                  Text(
                    'ATELIER DETAILS',
                    style: GoogleFonts.outfit(
                      color: AppColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.product.description,
                    style: GoogleFonts.outfit(
                      color: AppColors.textSecondary,
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Bar with Add to Cart & Buy Now Buttons
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.surfaceBorder, width: 1)),
        ),
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 50,
                child: OutlinedButton(
                  onPressed: () {
                    context.read<CartProvider>().addToCart(
                          widget.product,
                          size: _selectedSize,
                          color: _selectedColor,
                        );
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('${widget.product.name} added to cart'),
                        backgroundColor: AppColors.surfaceElevated,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  child: const Text('ADD TO BAG'),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: () async {
                    await context.read<CartProvider>().addToCart(
                          widget.product,
                          size: _selectedSize,
                          color: _selectedColor,
                        );
                    if (context.mounted) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const CartScreen()),
                      );
                    }
                  },
                  child: const Text('BUY NOW'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
