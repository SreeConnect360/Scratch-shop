import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/wishlist_provider.dart';
import '../widgets/guest_auth_dialog.dart';
import 'cart_screen.dart';

/// Comprehensive Native Product Details Screen matching ReeVibes Website.
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
  bool _isInfoExpanded = false;

  @override
  void initState() {
    super.initState();
    _selectedSize = widget.product.sizes.isNotEmpty ? widget.product.sizes.first : 'M';
    _selectedColor = widget.product.colors.isNotEmpty ? widget.product.colors.first : 'Black';
  }

  void _openHighResImageViewer(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      builder: (context) => Scaffold(
        backgroundColor: Colors.black.withOpacity(0.92),
        body: Stack(
          children: [
            Center(
              child: InteractiveViewer(
              panEnabled: true,
              minScale: 0.8,
              maxScale: 4.0,
              child: Image.network(
                imageUrl,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image_rounded, color: Colors.white, size: 64),
              ),
            ),
          ),
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              icon: const Icon(Icons.close_rounded, color: Colors.white, size: 30),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    ),
  );
}

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    final isWishlisted = context.watch<WishlistProvider>().isWishlisted(widget.product.id);
    final sizeStockCount = widget.product.sizeStock[_selectedSize.toUpperCase()] ?? widget.product.stock;
    final isSelectedSizeAvailable = sizeStockCount > 0;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Collapsible Image Header & Pinch-to-Zoom Gallery
          SliverAppBar(
            expandedHeight: 440,
            pinned: true,
            backgroundColor: AppColors.background,
            actions: [
              IconButton(
                icon: Icon(
                  isWishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: isWishlisted ? AppColors.gold : Colors.white,
                ),
                onPressed: () {
                  final auth = context.read<AuthProvider>();
                  if (!auth.isAuthenticated) {
                    GuestAuthDialog.show(context, actionTarget: 'your wishlist');
                    return;
                  }
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
                      return GestureDetector(
                        onTap: () => _openHighResImageViewer(context, imgUrl),
                        child: Hero(
                          tag: 'product_img_${widget.product.id}_$index',
                          child: Image.network(
                            imgUrl,
                            fit: BoxFit.cover,
                            width: double.infinity,
                            errorBuilder: (context, error, stackTrace) => Container(
                              color: AppColors.surface,
                              child: const Icon(Icons.checkroom_rounded, color: AppColors.gold, size: 64),
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  // Image Page Dots Indicator
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
                            width: _selectedImageIndex == idx ? 22 : 6,
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
                  // House / Brand Name & Category Tag
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.product.house.toUpperCase(),
                        style: GoogleFonts.outfit(
                          color: AppColors.gold,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        child: Text(
                          '${widget.product.category} • ${widget.product.subcategory}',
                          style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Product Title
                  Text(
                    widget.product.name,
                    style: GoogleFonts.playfairDisplay(
                      color: AppColors.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Rating & Review Breakdown
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
                        '${widget.product.rating} (${widget.product.reviewCount} Customer Reviews)',
                        style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Pricing & Discount Section
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        currencyFormatter.format(widget.product.price),
                        style: GoogleFonts.outfit(
                          color: AppColors.textPrimary,
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (widget.product.hasDiscount) ...[
                        const SizedBox(width: 12),
                        Text(
                          currencyFormatter.format(widget.product.originalPrice),
                          style: GoogleFonts.outfit(
                            color: AppColors.textMuted,
                            fontSize: 16,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const SizedBox(width: 12),
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
                  if (widget.product.hasDiscount) ...[
                    const SizedBox(height: 4),
                    Text(
                      'You Save ${currencyFormatter.format(widget.product.savingsAmount)}',
                      style: GoogleFonts.outfit(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                  const SizedBox(height: 24),
                  const Divider(color: AppColors.surfaceBorder),
                  const SizedBox(height: 16),

                  // Dynamic Size Selection with Stock Availability
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'SELECT SIZE',
                        style: GoogleFonts.outfit(
                          color: AppColors.textMuted,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                      Text(
                        isSelectedSizeAvailable ? 'In Stock ($sizeStockCount left)' : 'Out of Stock',
                        style: GoogleFonts.outfit(
                          color: isSelectedSizeAvailable ? AppColors.gold : AppColors.error,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: widget.product.sizes.map((size) {
                      final isSelected = size == _selectedSize;
                      final stockCount = widget.product.sizeStock[size.toUpperCase()] ?? widget.product.stock;
                      final isAvailable = stockCount > 0;

                      return ChoiceChip(
                        label: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              size,
                              style: TextStyle(
                                color: !isAvailable
                                    ? AppColors.textMuted
                                    : isSelected
                                        ? Colors.black
                                        : AppColors.textPrimary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              isAvailable ? '$stockCount left' : 'Sold out',
                              style: TextStyle(
                                fontSize: 9,
                                color: !isAvailable
                                    ? AppColors.textMuted
                                    : isSelected
                                        ? Colors.black87
                                        : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                        selected: isSelected,
                        selectedColor: AppColors.gold,
                        backgroundColor: isAvailable ? AppColors.surface : AppColors.surfaceElevated.withOpacity(0.5),
                        onSelected: isAvailable
                            ? (val) {
                                if (val) setState(() => _selectedSize = size);
                              }
                            : null,
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

                  // Overview Description
                  Text(
                    'ATELIER OVERVIEW',
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
                  const SizedBox(height: 24),

                  // Dedicated Product Information Accordion (Expand / Collapse)
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    child: Theme(
                      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                      child: ExpansionTile(
                        initiallyExpanded: false,
                        onExpansionChanged: (expanded) => setState(() => _isInfoExpanded = expanded),
                        title: Text(
                          'Product Information',
                          style: GoogleFonts.outfit(
                            color: AppColors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        trailing: Icon(
                          _isInfoExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                          color: AppColors.gold,
                        ),
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Divider(color: AppColors.surfaceBorder),
                                const SizedBox(height: 8),

                                // Product Details Section
                                Text(
                                  'Product Details',
                                  style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 13, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 8),
                                _buildDetailRow('Material Composition', widget.product.fabric),
                                _buildDetailRow('Fabric Type', widget.product.productType),
                                _buildDetailRow('Care Instructions', widget.product.careInstructions),
                                _buildDetailRow('Country of Origin', widget.product.countryOfOrigin),
                                _buildDetailRow('Manufacturer', widget.product.manufacturer),
                                const SizedBox(height: 16),

                                // About This Item Section
                                Text(
                                  'About This Item',
                                  style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 13, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 8),
                                _buildDetailRow('Fit', widget.product.fit),
                                _buildDetailRow('Sleeve Type', widget.product.sleeveType),
                                _buildDetailRow('Neck Type', widget.product.neckType),
                                _buildDetailRow('Pattern', widget.product.pattern),
                                _buildDetailRow('Occasion', widget.product.occasion),
                                _buildDetailRow('Gender', widget.product.gender),
                                _buildDetailRow('Collection', widget.product.collection),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Action Bar: Add to Bag & Buy Now Buttons
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
                  onPressed: isSelectedSizeAvailable
                      ? () {
                          final auth = context.read<AuthProvider>();
                          if (!auth.isAuthenticated) {
                            GuestAuthDialog.show(context, actionTarget: 'your cart');
                            return;
                          }
                          context.read<CartProvider>().addToCart(
                                widget.product,
                                size: _selectedSize,
                                color: _selectedColor,
                              );
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('${widget.product.name} (Size: $_selectedSize) added to bag'),
                              backgroundColor: AppColors.surfaceElevated,
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        }
                      : null,
                  child: const Text('ADD TO BAG'),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: isSelectedSizeAvailable
                      ? () async {
                          final auth = context.read<AuthProvider>();
                          if (!auth.isAuthenticated) {
                            GuestAuthDialog.show(context, actionTarget: 'your cart');
                            return;
                          }
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
                        }
                      : null,
                  child: const Text('BUY NOW'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}
