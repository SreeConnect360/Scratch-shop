/// User Profile Model.
class UserProfile {
  final String id;
  final String email;
  final String fullName;
  final String phone;
  final String avatarUrl;
  final String role;
  final double walletBalance;
  final DateTime? createdAt;

  UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone = '',
    this.avatarUrl = '',
    this.role = 'customer',
    this.walletBalance = 0.0,
    this.createdAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      fullName: json['full_name']?.toString() ?? json['name']?.toString() ?? json['email']?.toString().split('@').first ?? 'ReeVibes Member',
      phone: json['phone']?.toString() ?? '',
      avatarUrl: json['avatar_url']?.toString() ?? json['avatarUrl']?.toString() ?? '',
      role: json['role']?.toString() ?? 'customer',
      walletBalance: (json['wallet_balance'] ?? json['walletBalance'] ?? 0.0) as double,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone': phone,
      'avatar_url': avatarUrl,
      'role': role,
      'wallet_balance': walletBalance,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
