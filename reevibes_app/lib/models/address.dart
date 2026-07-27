/// Address Model.
class Address {
  final String id;
  final String fullName;
  final String phone;
  final String streetAddress;
  final String city;
  final String state;
  final String zipCode;
  final String country;
  final bool isDefault;

  Address({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.streetAddress,
    required this.city,
    required this.state,
    required this.zipCode,
    this.country = 'India',
    this.isDefault = false,
  });

  String get formatted {
    return '$streetAddress, $city, $state - $zipCode, $country';
  }

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id']?.toString() ?? '',
      fullName: json['full_name']?.toString() ?? json['fullName']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      streetAddress: json['street_address']?.toString() ?? json['streetAddress']?.toString() ?? json['address']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      state: json['state']?.toString() ?? '',
      zipCode: json['zip_code']?.toString() ?? json['zipCode']?.toString() ?? json['pincode']?.toString() ?? '',
      country: json['country']?.toString() ?? 'India',
      isDefault: json['is_default'] ?? json['isDefault'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'phone': phone,
      'street_address': streetAddress,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'country': country,
      'is_default': isDefault,
    };
  }
}
