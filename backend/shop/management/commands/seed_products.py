from django.core.management.base import BaseCommand
from shop.models import Product

PRODUCTS = [
    {
        'id': 'oak-lounge-chair', 'name': 'Oak Lounge Chair', 'category': 'Seating', 'price': 1240,
        'material': 'Solid oak / wool boucle', 'dimensions': 'W76 x D80 x H72 cm', 'sku': 'FRM-SE-001',
        'colors': ['#3F3A33', '#A35C3E', '#6B7560'],
        'image': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop'],
        'description': 'A low, wide-armed lounge chair built around a steam-bent oak frame. The seat is sprung and finished in a heavyweight boucle that softens with use. Designed to be sat in sideways as often as forwards.', 'stock': 6,
    },
    {
        'id': 'brass-arc-pendant', 'name': 'Brass Arc Pendant', 'category': 'Lighting', 'price': 410,
        'material': 'Brushed brass / opal glass', 'dimensions': 'Ø32 x H28 cm', 'sku': 'FRM-LI-014',
        'colors': ['#B98B4E', '#14171C'],
        'image': 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop'],
        'description': 'An asymmetric pendant with a brushed brass arm and an opal glass diffuser that casts a wide, even pool of light. Hangs from a braided cord rated for ceilings up to 4m.', 'stock': 14,
    },
    {
        'id': 'walnut-side-table', 'name': 'Walnut Side Table', 'category': 'Tables', 'price': 380,
        'material': 'Solid walnut', 'dimensions': 'W45 x D45 x H50 cm', 'sku': 'FRM-TA-007', 'colors': ['#5C4433'],
        'image': 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'],
        'description': 'A single-board walnut top set on a tapered three-leg base, joined without visible hardware. Reads as sculpture as easily as furniture.', 'stock': 9,
    },
    {
        'id': 'wool-throw', 'name': 'Shetland Wool Throw', 'category': 'Textiles', 'price': 165,
        'material': '100% Shetland wool', 'dimensions': '130 x 180 cm', 'sku': 'FRM-TX-022', 'colors': ['#6B7560', '#A35C3E', '#8A8D91'],
        'image': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'],
        'description': 'Woven on a traditional Shetland loom from undyed, naturally pigmented fleece. Each throw carries the slight irregularity of the wool it came from.', 'stock': 21,
    },
    {
        'id': 'stoneware-dinner-set', 'name': 'Stoneware Dinner Set', 'category': 'Objects', 'price': 220,
        'material': 'Reactive-glaze stoneware', 'dimensions': '16-piece, service for 4', 'sku': 'FRM-OB-031', 'colors': ['#8A8D91', '#3F3A33'],
        'image': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?q=80&w=1200&auto=format&fit=crop'],
        'description': 'Hand-thrown plates, bowls, and mugs finished in a reactive glaze, so no two pieces break the light in quite the same way.', 'stock': 12,
    },
    {
        'id': 'linen-sofa', 'name': 'Two-Seat Linen Sofa', 'category': 'Seating', 'price': 2150,
        'material': 'Kiln-dried frame / washed linen', 'dimensions': 'W175 x D88 x H78 cm', 'sku': 'FRM-SE-002', 'colors': ['#EDE9E2', '#8A8D91', '#3F3A33'],
        'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop'],
        'description': "A loose-cushioned two-seater on a kiln-dried hardwood frame, upholstered in pre-washed linen that's built to soften and fade evenly over years of use.", 'stock': 4,
    },
    {
        'id': 'rattan-mirror', 'name': 'Rattan Sun Mirror', 'category': 'Objects', 'price': 145,
        'material': 'Woven rattan / glass', 'dimensions': 'Ø60 cm', 'sku': 'FRM-OB-018', 'colors': ['#B98B4E'],
        'image': 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop',
        'gallery': ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=1200&auto=format&fit=crop'],
        'description': 'A sunburst frame of hand-split rattan around a beveled mirror plate. Light enough to hang from a single picture hook.', 'stock': 17,
    },
]


class Command(BaseCommand):
    help = 'Create or update the storefront catalog.'

    def handle(self, *args, **options):
        for product in PRODUCTS:
            Product.objects.update_or_create(id=product['id'], defaults=product)
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(PRODUCTS)} products.'))
