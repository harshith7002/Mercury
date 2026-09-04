import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS_DATA = [
  // Electronics
  {
    id: "prod_kbd_k2",
    name: "Keychron K2 Wireless Mechanical Keyboard",
    description: "Compact 75% layout mechanical keyboard with Gateron switches, RGB backlighting, and Bluetooth 5.1 multi-device connectivity. Designed for Mac & Windows developers.",
    category: "Electronics",
    price: 5499,
    inventory: 85,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["75% Layout", "Gateron Brown Switches", "RGB Backlight", "Bluetooth 5.1 & Wired", "4000mAh Battery"]),
    tags: JSON.stringify(["keyboard", "mechanical", "coding", "wireless", "mac", "windows"]),
    compatibleProducts: JSON.stringify(["prod_wrist_rest", "prod_keycaps", "prod_coiled_cable"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_wrist_rest", score: 0.31, reason: "31% of buyers purchase an ergonomic wrist rest to complete their setup." },
      { productId: "prod_keycaps", score: 0.18, reason: "18% of mechanical keyboard enthusiasts customize keycaps." },
      { productId: "prod_coiled_cable", score: 0.15, reason: "15% add a custom coiled USB-C cable." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 35, maxUpsellDiscount: 200 })
  },
  {
    id: "prod_laptop_dev14",
    name: "DeveloperBook Pro 14",
    description: "Next-gen developer laptop with 16-Core Neural Engine, 16 GB Unified Memory, 512 GB NVMe SSD, and 18-hour battery life. Optimized for heavy compilation and Docker workloads.",
    category: "Electronics",
    price: 64999,
    inventory: 30,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["16GB Unified RAM", "512GB High-Speed SSD", "Retina XDR Display", "Silent Cooling", "18h Battery"]),
    tags: JSON.stringify(["laptop", "developer", "coding", "macbook", "high-performance"]),
    compatibleProducts: JSON.stringify(["prod_mouse_mx", "prod_laptop_stand", "prod_usbc_hub", "prod_sleeve_14"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_laptop_stand", score: 0.42, reason: "42% of laptop buyers purchase an aluminum stand for desktop ergonomics." },
      { productId: "prod_usbc_hub", score: 0.38, reason: "38% add a multiport adapter for external displays." },
      { productId: "prod_mouse_mx", score: 0.29, reason: "29% buy a high-precision productivity mouse." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 10, promoEligible: false }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 20, maxUpsellDiscount: 500 })
  },
  {
    id: "prod_laptop_dev16",
    name: "DeveloperBook Studio 16 Ultra",
    description: "Flagship workstation laptop with 36GB RAM, 1TB SSD, Liquid Retina XDR screen, and extreme multi-threaded CPU power.",
    category: "Electronics",
    price: 124999,
    inventory: 15,
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["36GB RAM", "1TB SSD", "16-inch 120Hz Display", "Thunderbolt 4"]),
    tags: JSON.stringify(["laptop", "workstation", "high-end", "developer"]),
    compatibleProducts: JSON.stringify(["prod_monitor_34", "prod_usbc_hub", "prod_mouse_mx"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_monitor_34", score: 0.50, reason: "50% add an ultrawide display." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 5, promoEligible: false }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 18, maxUpsellDiscount: 1000 })
  },
  {
    id: "prod_monitor_34",
    name: "Mercury UltraWide 34\" Curved Monitor",
    description: "WQHD 3440x1440 curved IPS monitor with 144Hz refresh rate, USB-C 90W power delivery, and dual-window PBP mode for multitasking.",
    category: "Electronics",
    price: 32999,
    inventory: 22,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["34 inch Curved WQHD", "144Hz IPS", "90W USB-C Charging", "HDR400"]),
    tags: JSON.stringify(["monitor", "ultrawide", "display", "desk-setup"]),
    compatibleProducts: JSON.stringify(["prod_monitor_arm", "prod_light_bar"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_monitor_arm", score: 0.45, reason: "45% of monitor buyers add a heavy-duty arm mount." },
      { productId: "prod_light_bar", score: 0.28, reason: "28% add a monitor light bar to reduce eye strain." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 12, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 25, maxUpsellDiscount: 400 })
  },
  {
    id: "prod_headphones_nc",
    name: "Mercury ANC Pro Wireless Headphones",
    description: "Active Noise Cancelling over-ear headphones with 40-hour battery life, multipoint pairing, and ultra-clear microphone array for calls.",
    category: "Electronics",
    price: 12499,
    inventory: 50,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["Active Noise Cancellation", "40h Playtime", "Multipoint Bluetooth", "Transparency Mode"]),
    tags: JSON.stringify(["headphones", "anc", "audio", "focus", "office"]),
    compatibleProducts: JSON.stringify(["prod_headphone_stand"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_headphone_stand", score: 0.22, reason: "22% buy an aluminum headphone desk hook/stand." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 30, maxUpsellDiscount: 300 })
  },

  // Accessories
  {
    id: "prod_wrist_rest",
    name: "Ergonomic Memory Foam Wrist Rest",
    description: "High-density memory foam wrist cushion with cooling gel layer and anti-slip rubber base. Perfectly fits 75% and 80% keyboards.",
    category: "Accessories",
    price: 799,
    inventory: 150,
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["Memory Foam", "Cooling Gel Top", "Anti-Slip Base", "75%/80% Keyboard Fit"]),
    tags: JSON.stringify(["wrist-rest", "ergonomic", "keyboard-accessory", "comfort"]),
    compatibleProducts: JSON.stringify(["prod_kbd_k2", "prod_keycaps"]),
    frequentlyBoughtTogether: JSON.stringify([]),
    discountRules: JSON.stringify({ maxDiscountPercent: 20, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 50, maxUpsellDiscount: 150 })
  },
  {
    id: "prod_mouse_mx",
    name: "Wireless Precision Ergonomic Mouse",
    description: "Advanced ergonomic mouse with MagSpeed electromagnetic scrolling, silent clicks, side thumb wheel, and cross-computer control.",
    category: "Accessories",
    price: 1499,
    inventory: 110,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["MagSpeed Scroll", "8K DPI Sensor", "Quiet Clicks", "USB-C Rechargeable"]),
    tags: JSON.stringify(["mouse", "ergonomic", "wireless", "productivity"]),
    compatibleProducts: JSON.stringify(["prod_laptop_dev14", "prod_desk_pad"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_desk_pad", score: 0.33, reason: "33% add a felt desk pad mat for smooth tracking." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 40, maxUpsellDiscount: 150 })
  },
  {
    id: "prod_laptop_stand",
    name: "Ergonomic Aluminum Laptop Stand",
    description: "Precision CNC machined aluminum stand elevating laptop screen by 6 inches to eye level. Folds flat for travel.",
    category: "Accessories",
    price: 1299,
    inventory: 130,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["Aircraft Aluminum", "Non-Slip Silicone", "Ventilation Cutouts", "Foldable"]),
    tags: JSON.stringify(["laptop-stand", "ergonomic", "desk-setup", "aluminum"]),
    compatibleProducts: JSON.stringify(["prod_laptop_dev14", "prod_usbc_hub"]),
    frequentlyBoughtTogether: JSON.stringify([]),
    discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 45, maxUpsellDiscount: 150 })
  },
  {
    id: "prod_usbc_hub",
    name: "USB-C 8-in-1 Multiport Adapter Hub",
    description: "Aluminum USB-C hub featuring 4K 60Hz HDMI, 100W Power Delivery, SD/MicroSD card reader, 3x USB 3.0 ports, and Gigabit Ethernet.",
    category: "Accessories",
    price: 2199,
    inventory: 100,
    imageUrl: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["4K 60Hz HDMI", "100W PD Pass-through", "Gigabit Ethernet", "SD/TF Card Slots"]),
    tags: JSON.stringify(["usbc-hub", "adapter", "dock", "macbook-accessory"]),
    compatibleProducts: JSON.stringify(["prod_laptop_dev14", "prod_ssd_1tb"]),
    frequentlyBoughtTogether: JSON.stringify([]),
    discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 40, maxUpsellDiscount: 200 })
  },
  {
    id: "prod_desk_pad",
    name: "Premium Felt & Leather Desk Pad Mat (XL)",
    description: "Large 900x400mm dual-sided desk pad crafted from high-density wool felt and water-resistant PU leather.",
    category: "Accessories",
    price: 899,
    inventory: 140,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["900x400mm XL", "Dual-Sided Felt/Leather", "Stitched Edges", "Non-Slip"]),
    tags: JSON.stringify(["desk-pad", "mat", "desk-setup", "leather", "felt"]),
    compatibleProducts: JSON.stringify(["prod_mouse_mx", "prod_kbd_k2"]),
    frequentlyBoughtTogether: JSON.stringify([]),
    discountRules: JSON.stringify({ maxDiscountPercent: 20, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 55, maxUpsellDiscount: 150 })
  },

  // Office Equipment
  {
    id: "prod_desk_standing",
    name: "Mercury Motion Motorized Standing Desk",
    description: "Dual-motor height-adjustable desk frame with 4 memory presets, collision detection, and solid walnut wood table top (140x70cm).",
    category: "Office equipment",
    price: 24999,
    inventory: 20,
    imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["Dual Motor Electric", "Memory Height Presets", "120kg Weight Capacity", "Solid Wood Top"]),
    tags: JSON.stringify(["standing-desk", "desk", "office", "ergonomic"]),
    compatibleProducts: JSON.stringify(["prod_chair_mesh", "prod_cable_mgmt"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_chair_mesh", score: 0.38, reason: "38% purchase alongside an ergonomic chair." },
      { productId: "prod_cable_mgmt", score: 0.25, reason: "25% add an under-desk cable tray kit." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 10, promoEligible: false }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 25, maxUpsellDiscount: 500 })
  },
  {
    id: "prod_chair_mesh",
    name: "Mercury ErgoPro Mesh Office Chair",
    description: "Full breathable mesh chair with 3D lumbar support, adjustable headrest, 4D armrests, and 135-degree recline function.",
    category: "Office equipment",
    price: 14499,
    inventory: 35,
    imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["3D Lumbar Support", "Breathable Mesh", "4D Armrests", "Class 4 Gas Lift"]),
    tags: JSON.stringify(["chair", "ergonomic", "office-chair", "seating"]),
    compatibleProducts: JSON.stringify(["prod_footrest"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_footrest", score: 0.20, reason: "20% add an under-desk footrest." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 12, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 30, maxUpsellDiscount: 300 })
  },

  // Software
  {
    id: "prod_sw_ide",
    name: "Developer IDE Suite Pro (1-Year License)",
    description: "All-in-one IDE license supporting 15+ programming languages, AI code completion extension, database client, and remote SSH environment.",
    category: "Software",
    price: 4999,
    inventory: 999,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["All IDE Tools Included", "AI Completion Engine", "Cloud Sync", "Priority Support"]),
    tags: JSON.stringify(["software", "ide", "developer-tools", "license", "coding"]),
    compatibleProducts: JSON.stringify(["prod_sw_cloud"]),
    frequentlyBoughtTogether: JSON.stringify([
      { productId: "prod_sw_cloud", score: 0.27, reason: "27% bundle with cloud monitoring software." }
    ]),
    discountRules: JSON.stringify({ maxDiscountPercent: 20, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 70, maxUpsellDiscount: 300 })
  },

  // Lifestyle
  {
    id: "prod_smart_mug",
    name: "Temperature Control Smart Heated Mug",
    description: "App-controlled ceramic mug keeping hot beverages at your exact chosen temperature (50°C - 62.5°C) for 1.5 hours.",
    category: "Lifestyle",
    price: 3499,
    inventory: 50,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    features: JSON.stringify(["App Temperature Control", "Charging Coaster", "Auto-Sleep", "IPX7 Waterproof"]),
    tags: JSON.stringify(["mug", "smart-home", "coffee", "lifestyle"]),
    compatibleProducts: JSON.stringify([]),
    frequentlyBoughtTogether: JSON.stringify([]),
    discountRules: JSON.stringify({ maxDiscountPercent: 10, promoEligible: true }),
    merchantPolicy: JSON.stringify({ minMarginPercent: 35, maxUpsellDiscount: 200 })
  }
];

// Fallback image pool for generated products
const CATEGORY_IMAGES: Record<string, string[]> = {
  Electronics: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80"
  ],
  "Office equipment": [
    "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80"
  ],
  Software: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
  ],
  Lifestyle: [
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
  ]
};

function generateExtendedProducts() {
  const extra: typeof PRODUCTS_DATA = [];
  const baseCategories = ["Electronics", "Accessories", "Office equipment", "Software", "Lifestyle"];
  
  for (let i = 1; i <= 38; i++) {
    const cat = baseCategories[i % baseCategories.length];
    const imgList = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Electronics;
    const imgUrl = imgList[i % imgList.length];

    const price = Math.floor(Math.random() * 80 + 5) * 100 + 99; // ₹599 to ₹8499
    extra.push({
      id: `prod_gen_${i}`,
      name: `Mercury Pro Series ${cat.slice(0, 4)} Accessory #${i}`,
      description: `High quality ${cat.toLowerCase()} item crafted for professional developers and remote workers. Item #${i}.`,
      category: cat,
      price: price,
      inventory: Math.floor(Math.random() * 80) + 20,
      imageUrl: imgUrl,
      features: JSON.stringify(["Durable Construction", "1-Year Warranty", "Ergonomic Design"]),
      tags: JSON.stringify([cat.toLowerCase(), "gadget", "mercury", "pro"]),
      compatibleProducts: JSON.stringify(["prod_kbd_k2", "prod_mouse_mx"]),
      frequentlyBoughtTogether: JSON.stringify([
        { productId: "prod_wrist_rest", score: 0.15, reason: "Frequently paired during checkout promotions." }
      ]),
      discountRules: JSON.stringify({ maxDiscountPercent: 15, promoEligible: true }),
      merchantPolicy: JSON.stringify({ minMarginPercent: 40, maxUpsellDiscount: 150 })
    });
  }
  return extra;
}

async function main() {
  console.log("🌱 Starting Mercury database seeding...");

  // 1. Clear existing data
  await prisma.auditEvent.deleteMany({});
  await prisma.approvalRequest.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.policy.deleteMany({});

  // 2. Create Default Merchant Policy
  await prisma.policy.create({
    data: {
      id: "merchant_default",
      merchantName: "Mercury Flagship Store",
      maxAutoDiscountAmount: 1000.0,
      maxAutoDiscountPercent: 20.0,
      maxCampaignBudget: 25000.0,
      maxAutoTransactionAmount: 10000.0,
      approvalThresholdAmount: 10000.0,
      maxUpsellAttempts: 1,
      maxPromosPerCustomer: 2,
      active: true,
    }
  });
  console.log("✅ Seeded default merchant policy.");

  // 3. Seed Products (52 Total)
  const allProductsData = [...PRODUCTS_DATA, ...generateExtendedProducts()];
  for (const p of allProductsData) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ Seeded ${allProductsData.length} products with high-res product photos.`);

  // 4. Seed Customers (500 Total)
  const firstNames = ["Aarav", "Ananya", "Rohan", "Priya", "Vikram", "Neha", "Aditya", "Sneha", "Karan", "Diya", "Rahul", "Pooja", "Siddharth", "Ishaan", "Meera", "Kabir", "Tanvi", "Arjun", "Riya", "Dev"];
  const lastNames = ["Sharma", "Verma", "Patel", "Gupta", "Rao", "Nair", "Reddy", "Mehta", "Joshi", "Singhania", "Chopra", "Kulkarni", "Deshmukh", "Kapoor", "Bhat"];
  const segments = ["VIP", "High-Frequency", "Tech Enthusiast", "Standard", "Corporate Buyer"];

  const customerIds: string[] = [];
  const customerList = [];
  for (let i = 1; i <= 500; i++) {
    const fname = firstNames[i % firstNames.length];
    const lname = lastNames[i % lastNames.length];
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@devmail.com`;
    const segment = segments[i % segments.length];
    
    customerList.push({
      id: `cust_${i}`,
      name: `${fname} ${lname}`,
      email: email,
      segment: segment,
      totalSpent: 0,
      orderCount: 0,
    });
    customerIds.push(`cust_${i}`);
  }

  for (const c of customerList) {
    await prisma.customer.create({ data: c });
  }
  console.log("✅ Seeded 500 synthetic customer accounts.");

  // 5. Seed Historical Orders (1,050 Orders for realistic dynamic analytics)
  console.log("📦 Generating 1,050 historical orders & AI analytics data...");
  const sampleProductList = await prisma.product.findMany();
  
  let totalSeededRevenue = 0;
  let totalAiAssistedRevenue = 0;
  let totalUpsellRevenue = 0;

  const now = new Date();

  for (let i = 1; i <= 1050; i++) {
    const custId = customerIds[i % customerIds.length];
    const isAi = Math.random() < 0.68; // 68% AI assisted orders
    const hasUpsell = isAi && Math.random() < 0.32; // 32% upsell conversion

    // Pick main product
    const mainProd = sampleProductList[Math.floor(Math.random() * sampleProductList.length)];
    let items = [{
      productId: mainProd.id,
      productName: mainProd.name,
      unitPrice: mainProd.price,
      quantity: 1,
      isUpsell: false,
    }];

    let baseAmount = mainProd.price;
    let upsellAmount = 0;

    if (hasUpsell) {
      // Pick secondary accessory item
      const upsellProd = sampleProductList.find(p => p.category === "Accessories") || sampleProductList[0];
      items.push({
        productId: upsellProd.id,
        productName: upsellProd.name,
        unitPrice: upsellProd.price,
        quantity: 1,
        isUpsell: true,
      });
      upsellAmount = upsellProd.price;
    }

    const discountAmount = isAi && Math.random() < 0.4 ? Math.min(500, Math.floor(baseAmount * 0.1)) : 0;
    const totalAmount = baseAmount + upsellAmount - discountAmount;

    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        id: `ord_${1000 + i}`,
        customerId: custId,
        customerName: customerList[(i % customerList.length)].name,
        customerEmail: customerList[(i % customerList.length)].email,
        totalAmount,
        baseAmount,
        upsellAmount,
        discountAmount,
        isAiAssisted: isAi,
        status: i % 25 === 0 ? "FAILED" : "CAPTURED",
        razorpayOrderId: `order_rzp_${1000 + i}`,
        razorpayPaymentId: i % 25 === 0 ? null : `pay_rzp_${1000 + i}`,
        razorpaySignature: i % 25 === 0 ? null : `sig_${Math.random().toString(36).substring(2)}`,
        paymentMethod: i % 3 === 0 ? "UPI" : i % 3 === 1 ? "CARD" : "NETBANKING",
        createdAt,
        items: {
          create: items
        }
      }
    });

    if (order.status === "CAPTURED") {
      totalSeededRevenue += totalAmount;
      if (isAi) totalAiAssistedRevenue += totalAmount;
      totalUpsellRevenue += upsellAmount;
    }
  }

  console.log(`✅ Seeded 1,050 orders. Total Revenue: ₹${totalSeededRevenue.toLocaleString("en-IN")}, AI-Assisted: ₹${totalAiAssistedRevenue.toLocaleString("en-IN")}, Upsell Revenue: ₹${totalUpsellRevenue.toLocaleString("en-IN")}.`);

  // 6. Initial Audit Log Entries
  await prisma.auditEvent.createMany({
    data: [
      {
        actor: "Policy Engine",
        agent: "System",
        action: "INITIALIZE_POLICIES",
        reason: "System bootup: Merchant governance policies active (Max Auto Discount: ₹1,000, Max Auto Tx: ₹10,000).",
        amount: 10000,
        policy: "merchant_default",
        approvalStatus: "PASSED",
        result: "SUCCESS"
      },
      {
        actor: "Merchant Growth Agent",
        agent: "GROWTH_AGENT",
        action: "AFFINITY_ANALYSIS_COMPLETED",
        reason: "Analyzed 1,050 past orders. Found 31% co-purchase affinity between Keychron K2 Keyboard and Wrist Rest.",
        amount: null,
        policy: "Within upsell rules",
        approvalStatus: "PASSED",
        result: "SUCCESS"
      }
    ]
  });

  console.log("✅ Seeded initial audit trail.");
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
