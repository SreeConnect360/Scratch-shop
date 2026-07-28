import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../config/app_config.dart';
import '../core/theme/app_colors.dart';
import '../models/address.dart';
import '../providers/cart_provider.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../services/haptic_service.dart';
import 'orders_screen.dart';

/// Native Checkout Screen handling Shipping Address selection, Razorpay Gateway, Order summary, and Placement.
class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedPaymentMethod = 'RAZORPAY'; // 'RAZORPAY' or 'COD'
  late Razorpay _razorpay;
  bool _isProcessing = false;

  final Address _defaultAddress = Address(
    id: 'addr_1',
    fullName: 'Sree',
    phone: '+91 98765 43210',
    streetAddress: 'Flat 402, ReeVibes Residency, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500033',
    country: 'India',
    isDefault: true,
  );

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    final cart = context.read<CartProvider>();
    final orderProvider = context.read<OrderProvider>();

    try {
      // 1. Verify Payment Signature on Backend
      if (response.paymentId != null && response.orderId != null && response.signature != null) {
        await ApiService.instance.verifyRazorpayPayment(
          razorpayPaymentId: response.paymentId!,
          razorpayOrderId: response.orderId!,
          razorpaySignature: response.signature!,
        );
      }

      // 2. Complete Order Placement on Backend
      final order = await orderProvider.placeOrder(
        items: List.from(cart.items),
        totalAmount: cart.grandTotal,
        discountAmount: cart.discountAmount,
        shippingAddress: _defaultAddress,
        paymentMethod: 'Razorpay Gateway',
        razorpayPaymentId: response.paymentId,
        razorpayOrderId: response.orderId,
        razorpaySignature: response.signature,
      );

      setState(() => _isProcessing = false);

      if (mounted && order != null) {
        await cart.clearCart();
        if (!mounted) return;
        _showOrderConfirmedModal(order.orderNumber);
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Payment verification warning: ${e.toString()}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    setState(() => _isProcessing = false);
    HapticService.instance.errorNotification();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Payment Failed: ${response.message ?? "Transaction cancelled"}'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    setState(() => _isProcessing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Selected Wallet: ${response.walletName}'),
        ),
      );
    }
  }

  Future<void> _processCheckout() async {
    final cart = context.read<CartProvider>();
    final auth = context.read<AuthProvider>();

    if (cart.items.isEmpty) return;

    setState(() => _isProcessing = true);
    await HapticService.instance.mediumImpact();

    if (_selectedPaymentMethod == 'COD') {
      // Cash on delivery direct placement
      final orderProvider = context.read<OrderProvider>();
      final order = await orderProvider.placeOrder(
        items: List.from(cart.items),
        totalAmount: cart.grandTotal,
        discountAmount: cart.discountAmount,
        shippingAddress: _defaultAddress,
        paymentMethod: 'Cash on Delivery',
      );

      setState(() => _isProcessing = false);

      if (mounted && order != null) {
        await cart.clearCart();
        if (!mounted) return;
        _showOrderConfirmedModal(order.orderNumber);
      }
    } else {
      // Razorpay Payment Flow
      try {
        final rzpRes = await ApiService.instance.createRazorpayOrder(cart.grandTotal);
        final String? rzpOrderId = rzpRes != null ? rzpRes['order_id']?.toString() : null;

        final options = {
          'key': AppConfig.razorpayKeyId,
          'amount': (cart.grandTotal * 100).round(),
          'name': 'ReeVibes Couture',
          'description': 'Luxury Fashion Purchase',
          if (rzpOrderId != null && rzpOrderId.isNotEmpty) 'order_id': rzpOrderId,
          'prefill': {
            'contact': _defaultAddress.phone,
            'email': auth.userProfile?.email ?? 'customer@reevibes.com',
          },
          'theme': {
            'color': '#D4AF37',
          }
        };

        _razorpay.open(options);
      } catch (e) {
        setState(() => _isProcessing = false);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to initiate Razorpay checkout: ${e.toString()}'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    }
  }

  void _showOrderConfirmedModal(String orderNumber) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: AppColors.goldGlow,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, color: AppColors.gold, size: 40),
            ),
            const SizedBox(height: 16),
            Text(
              'Order Confirmed!',
              style: GoogleFonts.playfairDisplay(
                color: AppColors.textPrimary,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Order #$orderNumber has been placed successfully. Your couture piece is being prepared for dispatch.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const OrdersScreen()),
                  );
                },
                child: const Text('TRACK ORDER'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final currencyFormatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'CHECKOUT',
          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. SHIPPING ADDRESS
            Text(
              'SHIPPING ADDRESS',
              style: GoogleFonts.outfit(
                color: AppColors.gold,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.location_on_outlined, color: AppColors.gold, size: 22),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _defaultAddress.fullName,
                          style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _defaultAddress.formatted,
                          style: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 12),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _defaultAddress.phone,
                          style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 2. PAYMENT METHOD SELECTION
            Text(
              'PAYMENT METHOD',
              style: GoogleFonts.outfit(
                color: AppColors.gold,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 10),
            _PaymentOptionTile(
              title: 'Razorpay Secure Checkout',
              subtitle: 'UPI (GPay, PhonePe), Credit/Debit Cards, NetBanking',
              icon: Icons.account_balance_wallet_rounded,
              value: 'RAZORPAY',
              groupValue: _selectedPaymentMethod,
              onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
            ),
            const SizedBox(height: 8),
            _PaymentOptionTile(
              title: 'Cash on Delivery',
              subtitle: 'Pay at doorstep upon delivery',
              icon: Icons.local_atm_rounded,
              value: 'COD',
              groupValue: _selectedPaymentMethod,
              onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
            ),
            const SizedBox(height: 24),

            // 3. FINAL SUMMARY
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Total Items', style: GoogleFonts.outfit(color: AppColors.textSecondary)),
                      Text('${cart.itemCount}', style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Order Amount', style: GoogleFonts.outfit(color: AppColors.textSecondary)),
                      Text(currencyFormatter.format(cart.grandTotal), style: GoogleFonts.outfit(color: AppColors.gold, fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // PLACE ORDER BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _processCheckout,
                child: _isProcessing
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5),
                      )
                    : Text('PAY & PLACE ORDER • ${currencyFormatter.format(cart.grandTotal)}'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentOptionTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String value;
  final String groupValue;
  final Function(String?) onChanged;

  const _PaymentOptionTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.value,
    required this.groupValue,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = value == groupValue;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppColors.gold : AppColors.surfaceBorder,
          width: isSelected ? 1.5 : 1.0,
        ),
      ),
      child: RadioListTile<String>(
        value: value,
        groupValue: groupValue,
        onChanged: onChanged,
        activeColor: AppColors.gold,
        title: Text(title, style: GoogleFonts.outfit(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(subtitle, style: GoogleFonts.outfit(color: AppColors.textMuted, fontSize: 12)),
        secondary: Icon(icon, color: isSelected ? AppColors.gold : AppColors.textMuted),
      ),
    );
  }
}
