/// Category Model for ReeVibes Catalog.
class Category {
  final String id;
  final String name;
  final String slug;
  final String imageUrl;
  final int itemCount;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    required this.imageUrl,
    this.itemCount = 0,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Collection',
      slug: json['slug']?.toString() ?? (json['name']?.toString().toLowerCase().replaceAll(' ', '-') ?? 'all'),
      imageUrl: json['image_url']?.toString() ?? json['image']?.toString() ?? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      itemCount: json['item_count'] as int? ?? json['itemCount'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'image_url': imageUrl,
      'item_count': itemCount,
    };
  }
}
