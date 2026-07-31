import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_colors.dart';

/// Floating AI Concierge / Chatbot button and modal dialog.
class ChatbotFab extends StatelessWidget {
  final bool enabled;

  const ChatbotFab({
    super.key,
    required this.enabled,
  });

  void _openChatbotModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const ChatbotModalSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!enabled) return const SizedBox.shrink();

    return Positioned(
      bottom: 85,
      right: 16,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _openChatbotModal(context),
          borderRadius: BorderRadius.circular(30),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFD4AF37), Color(0xFFAA7C11)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.4),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.smart_toy_outlined, color: Colors.black, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Stylist AI',
                  style: GoogleFonts.outfit(
                    color: Colors.black,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ChatbotModalSheet extends StatefulWidget {
  const ChatbotModalSheet({super.key});

  @override
  State<ChatbotModalSheet> createState() => _ChatbotModalSheetState();
}

class _ChatbotModalSheetState extends State<ChatbotModalSheet> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'sender': 'bot',
      'text': 'Greetings! I am your ReeVibes AI Stylist & Fashion Concierge. How can I assist your curation today?'
    }
  ];

  void _sendMessage() {
    final query = _textController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _messages.add({'sender': 'user', 'text': query});
      _textController.clear();
    });

    // Simulate AI Concierge response
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() {
        String reply = 'I recommend exploring our Haute Couture drops and Summer Essentials curation!';
        final q = query.toLowerCase();
        if (q.contains('order') || q.contains('shipping') || q.contains('track')) {
          reply = 'You can track all your active shipments in your Account → Orders tab with real-time Shiprocket updates.';
        } else if (q.contains('return') || q.contains('refund')) {
          reply = 'Our concierge offers hassle-free 7-day returns. You can initiate a return directly from your Order History.';
        } else if (q.contains('size') || q.contains('fit')) {
          reply = 'Our garments follow tailored European sizing. We recommend checking the size guide on each product page.';
        } else if (q.contains('coupon') || q.contains('discount')) {
          reply = 'Use promo code FESTIVE20 at checkout for 20% off your fashion order!';
        }
        _messages.add({'sender': 'bot', 'text': reply});
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle and Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.surfaceBorder, width: 0.5)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.smart_toy, color: AppColors.gold, size: 20),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ReeVibes AI Stylist',
                      style: GoogleFonts.playfairDisplay(
                        color: AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Online • Dynamic Fashion Assistance',
                      style: GoogleFonts.outfit(
                        color: Colors.greenAccent,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),

          // Messages List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isBot = msg['sender'] == 'bot';
                return Align(
                  alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    decoration: BoxDecoration(
                      color: isBot ? AppColors.surfaceElevated : AppColors.gold,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: Radius.circular(isBot ? 2 : 16),
                        bottomRight: Radius.circular(isBot ? 16 : 2),
                      ),
                    ),
                    child: Text(
                      msg['text']!,
                      style: GoogleFonts.outfit(
                        color: isBot ? AppColors.textPrimary : Colors.black,
                        fontSize: 13,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Input field
          Container(
            padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 12,
              bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            ),
            decoration: const BoxDecoration(
              color: AppColors.surfaceElevated,
              border: Border(top: BorderSide(color: AppColors.surfaceBorder, width: 0.5)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    style: GoogleFonts.outfit(color: AppColors.textPrimary, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Ask your AI Stylist...',
                      hintStyle: GoogleFonts.outfit(color: AppColors.textSecondary, fontSize: 13),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: AppColors.surface,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send_rounded, color: AppColors.gold),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
