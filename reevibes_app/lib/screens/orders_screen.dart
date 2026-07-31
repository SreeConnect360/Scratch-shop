import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../providers/auth_provider.dart';
import '../providers/order_provider.dart';
import '../services/api_service.dart';

/// Native Orders & Live Order Tracking Screen with Courier Status, Cancellation, and Returns/Refunds Integration.
class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  List<Map<String, dynamic>> _returnRequests = [];

  @override
  void initState() {
    super.initState();
    _fetchReturns();
  }

  Future<void> _fetchReturns() async {
    try {
      final rets = await ApiService.instance.fetchReturns();
      if (rets != null && mounted) {
        final auth = context.read<AuthProvider>();
        final user = auth.userProfile;
        final uid = user?.id ?? '';
        final email = user?.email.toLowerCase() ?? '';

        final userReturns = rets.where((r) {
          final cId = (r['customerId'] ?? r['customer_id'] ?? '').toString().toLowerCase();
          final cName = (r['customerName'] ?? r['customer_name'] ?? '').toString().toLowerCase();
          if (uid.isEmpty && email.isEmpty) return true;
          return cId == uid.toLowerCase() ||
              cId == 'usr-$uid'.toLowerCase() ||
              (email.isNotEmpty && (cId == email || cName.contains(email)));
        }).toList();

        setState(() {
          _returnRequests = userReturns;
        });
      }
    } catch (_) {}
  }

  void _showReturnDialog(BuildContext context, Order order) {
    if (order.items.isEmpty) return;

    CartItem selectedItem = order.items.first;
    String selectedReason = 'Defective / Damaged Item';
    final commentController = TextEditingController();

    final returnReasons = [
      'Defective / Damaged Item',
      'Incorrect Size / Fit Issue',
      'Item Different from Image',
      'Quality Not as Expected',
      'Wrong Item Delivered',
      'Changed My Mind',
    ];

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          final auth = context.read<AuthProvider>();
          final user = auth.userProfile;
          final refundAmount = selectedItem.totalPrice;

          return AlertDialog(
            backgroundColor: AppColors.surface,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: Row(
              children: [
                const Icon(Icons.assignment_return_rounded, color: AppColors.gold, size: 22),
                const SizedBox(width: 8),
                Text('REQUEST RETURN', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
              ],
            ),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('SELECT PRODUCT TO RETURN', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<CartItem>(
                    value: selectedItem,
                    dropdownColor: AppColors.surfaceElevated,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 12),
                    items: order.items.map((item) {
                      return DropdownMenuItem(
                        value: item,
                        child: Text(
                          '${item.product.name} (Size: ${item.selectedSize}) - ₹${item.totalPrice.toStringAsFixed(0)}',
                          overflow: TextOverflow.ellipsis,
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedItem = val);
                    },
                  ),
                  const SizedBox(height: 14),

                  Text('REASON FOR RETURN', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: selectedReason,
                    dropdownColor: AppColors.surfaceElevated,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 12),
                    items: returnReasons.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedReason = val);
                    },
                  ),
                  const SizedBox(height: 14),

                  Text('ADDITIONAL DETAILS / COMMENT', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: commentController,
                    maxLines: 3,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 12),
                    decoration: const InputDecoration(
                      hintText: 'Describe the issue or packaging condition...',
                    ),
                  ),
                  const SizedBox(height: 14),

                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('ESTIMATED REFUND', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                        Text('₹${refundAmount.toStringAsFixed(0)}', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 14, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('CANCEL', style: GoogleFonts.outfit(color: AppColors.textMuted)),
              ),
              ElevatedButton(
                onPressed: () async {
                  Navigator.pop(context);
                  final returnPayload = {
                    'orderId': order.id,
                    'productId': selectedItem.product.id,
                    'productName': selectedItem.product.name,
                    'customerId': user?.id ?? order.userId,
                    'customerName': user?.fullName ?? 'Customer',
                    'reason': selectedReason,
                    'comment': commentController.text.trim(),
                    'status': 'Requested',
                    'refundAmount': refundAmount,
                    'selectedSize': selectedItem.selectedSize,
                    'qty': selectedItem.quantity,
                  };

                  final success = await ApiService.instance.createReturn(returnPayload);
                  _fetchReturns();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(success
                            ? 'Return request for ${selectedItem.product.name} submitted successfully!'
                            : 'Failed to submit return request.'),
                        backgroundColor: success ? AppColors.gold : Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                child: Text('SUBMIT RETURN', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
              ),
            ],
          );
        },
      ),
    );
  }

  void _confirmCancelOrder(BuildContext context, Order order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('CANCEL ORDER #${order.orderNumber}', style: GoogleFonts.playfairDisplay(color: AppColors.textPrimary, fontSize: 16)),
        content: Text(
          'Are you sure you want to cancel this order? This action will immediately notify the logistics team.',
          style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('KEEP ORDER', style: GoogleFonts.outfit(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () async {
              Navigator.pop(context);
              final success = await ApiService.instance.cancelOrder(order.id);
              if (context.mounted) {
                context.read<OrderProvider>().loadOrders();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(success ? 'Order #${order.orderNumber} cancelled successfully' : 'Failed to cancel order'),
                    backgroundColor: success ? AppColors.surfaceElevated : Colors.redAccent,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: Text('CANCEL ORDER', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
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
          'MY ORDERS & RETURNS',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.gold,
        backgroundColor: AppColors.surfaceElevated,
        onRefresh: () async {
          await orderProvider.loadOrders();
          await _fetchReturns();
        },
        child: orders.isEmpty && _returnRequests.isEmpty
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
            : ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                children: [
                  // Active & Past Orders Section
                  if (orders.isNotEmpty) ...[
                    Text(
                      'PURCHASE HISTORY (${orders.length})',
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 12),
                    ...orders.map((order) => _buildOrderCard(context, order, currencyFormatter)),
                    const SizedBox(height: 24),
                  ],

                  // Return Requests & Refund Tracking Section
                  if (_returnRequests.isNotEmpty) ...[
                    Text(
                      'RETURNS & REFUNDS TRACKER (${_returnRequests.length})',
                      style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 12),
                    ..._returnRequests.map((ret) => _buildReturnCard(ret, currencyFormatter)),
                  ],
                ],
              ),
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, Order order, NumberFormat currencyFormatter) {
    final isCancellable = order.status == OrderStatus.placed ||
        order.status == OrderStatus.confirmed ||
        order.status == OrderStatus.processing;

    final isReturnable = order.status == OrderStatus.delivered ||
        order.status == OrderStatus.shipped ||
        order.status == OrderStatus.outForDelivery;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Order Number & Status Pill
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
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: order.status == OrderStatus.cancelled
                      ? Colors.redAccent.withOpacity(0.15)
                      : AppColors.goldGlow,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: order.status == OrderStatus.cancelled ? Colors.redAccent : AppColors.gold,
                  ),
                ),
                child: Text(
                  order.statusDisplay.toUpperCase(),
                  style: GoogleFonts.outfit(
                    color: order.status == OrderStatus.cancelled ? Colors.redAccent : AppColors.gold,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          Text(
            'Placed on ${DateFormat('dd MMM yyyy, hh:mm a').format(order.createdAt)}',
            style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11),
          ),
          const SizedBox(height: 12),

          // Order Tracking Progress Stepper
          _buildTrackingStepper(order.status),
          const SizedBox(height: 12),

          // Logistics & Courier Tracking AWB
          if (order.trackingNumber != null && order.trackingNumber!.isNotEmpty) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Row(
                children: [
                  const Icon(Icons.local_shipping_rounded, color: AppColors.gold, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Courier: ${order.courierPartner ?? "Shiprocket / BlueDart"}',
                          style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          'AWB Tracking: ${order.trackingNumber}',
                          style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
          ],

          const Divider(color: AppColors.surfaceBorder, height: 16),

          // Items Summary
          Column(
            children: order.items.map((item) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        item.product.primaryImage,
                        width: 44,
                        height: 44,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 44,
                          height: 44,
                          color: AppColors.surfaceElevated,
                          child: const Icon(Icons.checkroom_rounded, color: AppColors.gold, size: 20),
                        ),
                      ),
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

          // Footer Row: Total & Action Buttons (Cancel / Return)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Total Paid (${order.paymentMethod})', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 10)),
                  Text(currencyFormatter.format(order.totalAmount), style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 15, fontWeight: FontWeight.bold)),
                ],
              ),

              Row(
                children: [
                  if (isCancellable)
                    OutlinedButton(
                      onPressed: () => _confirmCancelOrder(context, order),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        side: const BorderSide(color: Colors.redAccent),
                      ),
                      child: Text('CANCEL ORDER', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.redAccent)),
                    ),
                  if (isReturnable) ...[
                    if (isCancellable) const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () => _showReturnDialog(context, order),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        backgroundColor: AppColors.surfaceElevated,
                        elevation: 0,
                      ),
                      child: Text('REQUEST RETURN', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.gold)),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTrackingStepper(OrderStatus status) {
    if (status == OrderStatus.cancelled) {
      return Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.redAccent.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            const Icon(Icons.cancel_outlined, color: Colors.redAccent, size: 16),
            const SizedBox(width: 6),
            Text('This order was cancelled.', style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold)),
          ],
        ),
      );
    }

    final steps = ['Placed', 'Accepted', 'Shipped', 'Delivered'];
    int currentStepIndex = 0;

    switch (status) {
      case OrderStatus.placed:
        currentStepIndex = 0;
        break;
      case OrderStatus.confirmed:
      case OrderStatus.processing:
        currentStepIndex = 1;
        break;
      case OrderStatus.shipped:
      case OrderStatus.outForDelivery:
        currentStepIndex = 2;
        break;
      case OrderStatus.delivered:
      case OrderStatus.returned:
        currentStepIndex = 3;
        break;
      default:
        currentStepIndex = 0;
    }

    return Row(
      children: List.generate(steps.length, (idx) {
        final isActive = idx <= currentStepIndex;
        final isLast = idx == steps.length - 1;

        return Expanded(
          child: Row(
            children: [
              Column(
                children: [
                  Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isActive ? AppColors.gold : AppColors.surfaceBorder,
                    ),
                    child: Icon(
                      isActive ? Icons.check : Icons.circle,
                      size: 10,
                      color: isActive ? Colors.black : AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    steps[idx],
                    style: GoogleFonts.outfit(
                      color: isActive ? AppColors.gold : AppColors.textMuted,
                      fontSize: 9,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    height: 2,
                    margin: const EdgeInsets.only(bottom: 14),
                    color: idx < currentStepIndex ? AppColors.gold : AppColors.surfaceBorder,
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildReturnCard(Map<String, dynamic> ret, NumberFormat currencyFormatter) {
    final status = (ret['status'] ?? 'Requested').toString();
    final pName = (ret['productName'] ?? ret['product_name'] ?? 'Product').toString();
    final reason = (ret['reason'] ?? 'Return Request').toString();
    final amt = ret['refundAmount'] != null ? (ret['refundAmount'] as num).toDouble() : 0.0;
    final retId = (ret['id'] ?? '').toString();

    Color statusColor = AppColors.gold;
    if (status.contains('Approve') || status.contains('Issue')) statusColor = Colors.greenAccent;
    if (status.contains('Reject')) statusColor = Colors.redAccent;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('RETURN #$retId', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(status.toUpperCase(), style: GoogleFonts.outfit(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(pName, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          Text('Reason: $reason', style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 11)),
          if (amt > 0) ...[
            const SizedBox(height: 4),
            Text('Refund Amount: ₹${amt.toStringAsFixed(0)}', style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ],
      ),
    );
  }
}
