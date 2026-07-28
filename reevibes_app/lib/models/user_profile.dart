/// User Profile Model.
class UserProfile {
  final String id;
  final String email;
  final String fullName;
  final String phone;
  final String avatarUrl;
  final String gender;
  final String dob;
  final String country;
  final String role;
  final double walletBalance;
  final DateTime? createdAt;

  UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone = '',
    this.avatarUrl = '',
    this.gender = '',
    this.dob = '',
    this.country = '',
    this.role = 'customer',
    this.walletBalance = 0.0,
    this.createdAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    String nameVal = json['full_name']?.toString() ?? json['name']?.toString() ?? '';
    if (nameVal.isEmpty) {
      final fName = json['firstName']?.toString() ?? '';
      final lName = json['lastName']?.toString() ?? '';
      nameVal = '$fName $lName'.trim();
    }
    if (nameVal.isEmpty) {
      nameVal = json['email']?.toString().split('@').first ?? 'ReeVibes Member';
    }

    double parseBalance(dynamic val) {
      if (val is num) return val.toDouble();
      if (val is String) return double.tryParse(val) ?? 0.0;
      return 0.0;
    }

    return UserProfile(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      fullName: nameVal,
      phone: json['phone']?.toString() ?? '',
      avatarUrl: json['avatar_url']?.toString() ?? json['avatarUrl']?.toString() ?? json['avatar']?.toString() ?? '',
      gender: json['gender']?.toString() ?? '',
      dob: json['dob']?.toString() ?? '',
      country: json['country']?.toString() ?? '',
      role: json['role']?.toString() ?? json['roles']?.toString() ?? 'customer',
      walletBalance: parseBalance(json['wallet_balance'] ?? json['walletBalance']),
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at'].toString()) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone': phone,
      'avatar_url': avatarUrl,
      'gender': gender,
      'dob': dob,
      'country': country,
      'role': role,
      'wallet_balance': walletBalance,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  UserProfile copyWith({
    String? id,
    String? email,
    String? fullName,
    String? phone,
    String? avatarUrl,
    String? gender,
    String? dob,
    String? country,
    String? role,
    double? walletBalance,
    DateTime? createdAt,
  }) {
    return UserProfile(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      gender: gender ?? this.gender,
      dob: dob ?? this.dob,
      country: country ?? this.country,
      role: role ?? this.role,
      walletBalance: walletBalance ?? this.walletBalance,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
