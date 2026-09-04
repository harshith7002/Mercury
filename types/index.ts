export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  inventory: number;
  imageUrl?: string;
  features: string[];
  tags: string[];
  compatibleProducts: string[];
  frequentlyBoughtTogether: Array<{
    productId: string;
    score: number;
    reason: string;
  }>;
  discountRules: {
    maxDiscountPercent: number;
    promoEligible: boolean;
  };
  merchantPolicy: {
    minMarginPercent: number;
    maxUpsellDiscount: number;
  };
  active: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  isUpsell?: boolean;
  upsellReason?: string;
  appliedDiscount?: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface PolicyRules {
  id: string;
  merchantName: string;
  maxAutoDiscountAmount: number;
  maxAutoDiscountPercent: number;
  maxCampaignBudget: number;
  maxAutoTransactionAmount: number;
  approvalThresholdAmount: number;
  maxUpsellAttempts: number;
  maxPromosPerCustomer: number;
  active: boolean;
}

export interface AuditEventRecord {
  id: string;
  timestamp: string;
  actor: string;
  agent?: string | null;
  action: string;
  reason: string;
  amount?: number | null;
  policy?: string | null;
  approvalStatus?: 'APPROVED' | 'BLOCKED' | 'PASSED' | 'REJECTED' | 'NOT_REQUIRED' | null;
  result?: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'PENDING' | null;
  metadataJson?: string | null;
}

export interface ApprovalRequestRecord {
  id: string;
  agentType: string;
  actionType: string;
  requestedAmount: number;
  policyLimit: number;
  reason: string;
  payloadJson: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decidedBy?: string | null;
  decidedAt?: string | null;
  createdAt: string;
}

export interface AgentStep {
  id: string;
  title: string;
  status: 'thinking' | 'tool_call' | 'policy_check' | 'waiting_approval' | 'executing' | 'completed' | 'blocked' | 'failed';
  detail: string;
  timestamp: string;
  toolName?: string;
}

export interface UpsellRecommendation {
  product: ProductItem;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  reason: string;
  confidenceScore: number;
  expectedAovImpact: number;
}
