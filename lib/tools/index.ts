import { prisma } from '@/lib/db';
import { ProductItem, UpsellRecommendation } from '@/types';

export class CatalogTools {
  /**
   * Search Merchant Catalog by query, category, and budget
   */
  static async searchCatalog(params: {
    query?: string;
    category?: string;
    maxPrice?: number;
  }): Promise<ProductItem[]> {
    const where: any = { active: true };

    if (params.category && params.category !== 'ALL') {
      where.category = { contains: params.category };
    }

    if (params.maxPrice) {
      where.price = { lte: params.maxPrice };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    let filtered = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      currency: p.currency,
      inventory: p.inventory,
      features: JSON.parse(p.features || '[]'),
      tags: JSON.parse(p.tags || '[]'),
      compatibleProducts: JSON.parse(p.compatibleProducts || '[]'),
      frequentlyBoughtTogether: JSON.parse(p.frequentlyBoughtTogether || '[]'),
      discountRules: JSON.parse(p.discountRules || '{}'),
      merchantPolicy: JSON.parse(p.merchantPolicy || '{}'),
      active: p.active,
    }));

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  /**
   * Find Product by exact ID
   */
  static async getProductById(id: string): Promise<ProductItem | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return null;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      currency: p.currency,
      inventory: p.inventory,
      features: JSON.parse(p.features || '[]'),
      tags: JSON.parse(p.tags || '[]'),
      compatibleProducts: JSON.parse(p.compatibleProducts || '[]'),
      frequentlyBoughtTogether: JSON.parse(p.frequentlyBoughtTogether || '[]'),
      discountRules: JSON.parse(p.discountRules || '{}'),
      merchantPolicy: JSON.parse(p.merchantPolicy || '{}'),
      active: p.active,
    };
  }

  /**
   * Merchant Growth Agent: Compute high-affinity upsell recommendation
   */
  static async getGrowthAgentUpsell(mainProductId: string): Promise<UpsellRecommendation | null> {
    const mainProduct = await this.getProductById(mainProductId);
    if (!mainProduct) return null;

    // Check frequently bought together list
    let targetUpsellId: string | null = null;
    let confidenceScore = 0.31;
    let reasonText = '31% of historical buyers of this product category purchased this complementary item.';

    if (mainProduct.frequentlyBoughtTogether && mainProduct.frequentlyBoughtTogether.length > 0) {
      const topAffinity = mainProduct.frequentlyBoughtTogether[0];
      targetUpsellId = topAffinity.productId;
      confidenceScore = topAffinity.score || 0.31;
      reasonText = topAffinity.reason || reasonText;
    } else if (mainProduct.compatibleProducts && mainProduct.compatibleProducts.length > 0) {
      targetUpsellId = mainProduct.compatibleProducts[0];
      confidenceScore = 0.28;
      reasonText = 'Highly compatible accessory recommended for desktop ergonomic setup.';
    } else {
      // Fallback accessory
      targetUpsellId = 'prod_wrist_rest';
    }

    const upsellProduct = await this.getProductById(targetUpsellId);
    if (!upsellProduct) return null;

    const originalPrice = upsellProduct.price;
    const discountAmount = 0; // standard price or promo
    const discountedPrice = originalPrice - discountAmount;

    return {
      product: upsellProduct,
      originalPrice,
      discountedPrice,
      discountAmount,
      reason: reasonText,
      confidenceScore,
      expectedAovImpact: discountedPrice,
    };
  }
}
