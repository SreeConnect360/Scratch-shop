import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/product.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import 'guest_auth_dialog.dart';

/// Bottom Sheet modal for selecting size and color options before adding to cart.
class QuickAddModal extends StatefulWidget {
  final Product product;

  const QuickAddModal({super.key, required this.product});

  @override
  State<QuickAddModal> createState() => _QuickAddModalState();
}

class _QuickAddModalState extends State<QuickAddModal> {
  late String _selectedSize;
  late String _selectedColor;
  final int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _selectedSize = widget.product.sizes.isNotEmpty ? widget.product.sizes.first : 'M';
    _selectedColor = widget.product.colors.isNotEmpty ? widget.product.colors.first : 'Black';

    // If first size is out of stock, pick first available size
    for (var s in widget.product.sizes) {
      final cnt = widget.product.sizeStock[s.toUpperCase()] ?? widget.product.stock;
      if (cnt > 0) {
        _selectedSize = s;
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    final sizeStockCount = widget.product.sizeStock[_selectedSize.toUpperCase()] ?? widget.product.stock;
    final isSelectedSizeAvailable = sizeStockCount > 0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(top: BorderSide(color: AppColors.surfaceBorder, width: 1)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Indicator Pill
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.surfaceBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Product Summary Row
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  widget.product.primaryImage,
                  width: 64,
                  height: 64,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.product.house.toUpperCase(),
                      style: GoogleFonts.outfit(
                        color: AppColors.gold,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                    Text(
                      widget.product.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      currencyFormatter.format(widget.product.price),
                      style: GoogleFonts.outfit(
                        color: AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Size Selection Header with Availability Status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'SELECT SIZE',
                style: GoogleFonts.outfit(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              Text(
                isSelectedSizeAvailable ? 'In Stock ($sizeStockCount left)' : 'Sold Out',
                style: GoogleFonts.outfit(
                  color: isSelectedSizeAvailable ? AppColors.gold : Colors.redAccent,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: widget.product.sizes.map((size) {
              final isSelected = size == _selectedSize;
              final stockCount = widget.product.sizeStock[size.toUpperCase()] ?? widget.product.stock;
              final isAvailable = stockCount > 0;

              return ChoiceChip(
                label: Text(
                  isAvailable ? '$size ($stockCount)' : '$size (Out)',
                  style: TextStyle(
                    color: !isAvailable
                        ? AppColors.textMuted
                        : isSelected
                            ? Colors.black
                            : AppColors.textPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                selected: isSelected,
                selectedColor: AppColors.gold,
                backgroundColor: isAvailable ? AppColors.surfaceElevated : AppColors.surfaceElevated.withOpacity(0.4),
                onSelected: isAvailable
                    ? (val) {
                        if (val) setState(() => _selectedSize = size);
                      }
                    : null,
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // Add to Cart Action Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: isSelectedSizeAvailable
                  ? () {
                      final auth = context.read<AuthProvider>();
                      if (!auth.isAuthenticated) {
                        Navigator.pop(context);
                        GuestAuthDialog.show(context, actionTarget: 'your cart');
                        return;
                      }
                      context.read<CartProvider>().addToCart(
                        widget.product,
                        size: _selectedSize,
                        color: _selectedColor,
                        quantity: _quantity,
                      );
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${widget.product.name} (Size: $_selectedSize) added to bag'),
                          backgroundColor: AppColors.surfaceElevated,
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  : null,
              child: Text(isSelectedSizeAvailable ? 'ADD TO BAG' : 'OUT OF STOCK'),
            ),
          ),
        ],
      ),
    );
  }
}
