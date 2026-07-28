import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/order_provider.dart';
import '../services/api_service.dart';

/// Native Orders & Order Tracking Screen with Live Refresh & Return Request.
class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  void _showReturnDialog(BuildContext context, String orderId) {
    final reasonController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text('Request Return', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Enter reason for return / exchange:', style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13)),
            const SizedBox(height: 12),
            TextField(
              controller: reasonController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: 'e.g., Size issue, damaged packaging...',
                hintStyle: TextStyle(color: AppColors.textMuted),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (reasonController.text.trim().isEmpty) return;
              Navigator.pop(context);
              final success = await ApiService.instance.createReturn({
                'orderId': orderId,
                'reason': reasonController.text.trim(),
                'status': 'Requested',
                'requestDate': DateTime.now().toIso8601String(),
              });
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(success ? 'Return request submitted successfully!' : 'Failed to submit return request.'),
                    backgroundColor: success ? AppColors.gold : Colors.redAccent,
                  ),
                );
              }
            },
            child: const Text('Submit Request'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final orders = orderProvider.orders;
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'MY ORDERS',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.gold,
        backgroundColor: AppColors.surfaceElevated,
        onRefresh: () => orderProvider.loadOrders(),
        child: orders.isEmpty
            ? SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: SizedBox(
                  height: MediaQuery.of(context).size.height * 0.7,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.local_shipping_outlined, color: AppColors.textMuted, size: 64),
                        const SizedBox(height: 16),
                        Text(
                          'No Orders Placed Yet',
                          style: GoogleFonts.playfairDisplay(
                            color: AppColors.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Your couture purchase history will appear here.',
                          style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            : ListView.separated(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                itemCount: orders.length,
                separatorBuilder: (context, index) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'ORDER #${order.orderNumber}',
                              style: GoogleFonts.outfit(
                                color: AppColors.gold,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.0,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.goldGlow,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                order.statusDisplay.toUpperCase(),
                                style: GoogleFonts.outfit(
                                  color: AppColors.gold,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Placed on ${DateFormat('dd MMM yyyy, hh:mm a').format(order.createdAt)}',
                          style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11),
                        ),
                        if (order.trackingNumber != null && order.trackingNumber!.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(
                            'Tracking AWB: ${order.trackingNumber}',
                            style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.w600),
                          ),
                        ],
                        const Divider(color: AppColors.surfaceBorder, height: 20),

                        // Order Items Summary
                        Column(
                          children: order.items.map((item) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: Image.network(item.product.primaryImage, width: 44, height: 44, fit: BoxFit.cover),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(item.product.name, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
                                        Text('Qty: ${item.quantity} • Size: ${item.selectedSize}', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11)),
                                      ],
                                    ),
                                  ),
                                  Text(currencyFormatter.format(item.totalPrice), style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
                                ],
                              ),
                            );
                          }).toList(),
                        ),

                        const Divider(color: AppColors.surfaceBorder, height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Total Paid', style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 11)),
                                Text(currencyFormatter.format(order.totalAmount), style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 16, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            OutlinedButton(
                              onPressed: () => _showReturnDialog(context, order.id),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                side: const BorderSide(color: AppColors.surfaceBorder),
                              ),
                              child: Text('REQUEST RETURN', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
      ),
    );
  }
}
