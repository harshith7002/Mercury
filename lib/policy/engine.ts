import { prisma } from '@/lib/db';
import { PolicyRules } from '@/types';
import { AuditService } from '@/lib/audit/service';

export interface PolicyCheckResult {
  allowed: boolean;
  requiresApproval: boolean;
  blockedReason?: string;
  policyLimit?: number;
  requestedValue?: number;
  policyRuleName?: string;
}

export class PolicyEngine {
  /**
   * Fetch current active merchant policy rules
   */
  static async getActivePolicy(): Promise<PolicyRules> {
    let policy = await prisma.policy.findUnique({
      where: { id: 'merchant_default' },
    });

    if (!policy) {
      policy = await prisma.policy.create({
        data: {
          id: 'merchant_default',
          merchantName: 'Mercury Flagship Store',
          maxAutoDiscountAmount: 1000.0,
          maxAutoDiscountPercent: 20.0,
          maxCampaignBudget: 25000.0,
          maxAutoTransactionAmount: 10000.0,
          approvalThresholdAmount: 10000.0,
          maxUpsellAttempts: 1,
          maxPromosPerCustomer: 2,
          active: true,
        },
      });
    }

    return {
      id: policy.id,
      merchantName: policy.merchantName,
      maxAutoDiscountAmount: policy.maxAutoDiscountAmount,
      maxAutoDiscountPercent: policy.maxAutoDiscountPercent,
      maxCampaignBudget: policy.maxCampaignBudget,
      maxAutoTransactionAmount: policy.maxAutoTransactionAmount,
      approvalThresholdAmount: policy.approvalThresholdAmount,
      maxUpsellAttempts: policy.maxUpsellAttempts,
      maxPromosPerCustomer: policy.maxPromosPerCustomer,
      active: policy.active,
    };
  }

  /**
   * Evaluate financial transaction against policy rules
   */
  static async validateTransaction(amount: number, actor: string = 'AI Buyer'): Promise<PolicyCheckResult> {
    // 1. Hard Sanity Security Checks
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return {
        allowed: false,
        requiresApproval: false,
        blockedReason: 'Invalid transaction amount: Amount must be a positive number.',
      };
    }

    if (amount > 1000000) {
      return {
        allowed: false,
        requiresApproval: true,
        blockedReason: 'Security alert: Extremely large transaction amount exceeds maximum system safety limit (₹1,000,000).',
        policyLimit: 1000000,
        requestedValue: amount,
      };
    }

    const policy = await this.getActivePolicy();

    if (amount > policy.maxAutoTransactionAmount) {
      const blockedReason = `Transaction amount of ₹${amount.toLocaleString('en-IN')} exceeds maximum automatic limit of ₹${policy.maxAutoTransactionAmount.toLocaleString('en-IN')}.`;

      await AuditService.log({
        actor,
        agent: actor,
        action: 'POLICY_CHECK_TRANSACTION',
        reason: blockedReason,
        amount,
        policy: `Max Auto Transaction <= ₹${policy.maxAutoTransactionAmount}`,
        approvalStatus: 'BLOCKED',
        result: 'BLOCKED',
      });

      return {
        allowed: false,
        requiresApproval: true,
        blockedReason,
        policyLimit: policy.maxAutoTransactionAmount,
        requestedValue: amount,
        policyRuleName: 'maxAutoTransactionAmount',
      };
    }

    await AuditService.log({
      actor,
      agent: actor,
      action: 'POLICY_CHECK_TRANSACTION',
      reason: `Transaction ₹${amount.toLocaleString('en-IN')} passed automatic policy checks (Limit: ₹${policy.maxAutoTransactionAmount.toLocaleString('en-IN')}).`,
      amount,
      policy: `Max Auto Transaction <= ₹${policy.maxAutoTransactionAmount}`,
      approvalStatus: 'PASSED',
      result: 'SUCCESS',
    });

    return {
      allowed: true,
      requiresApproval: false,
    };
  }

  /**
   * Evaluate discount request against policy rules
   */
  static async validateDiscount(
    discountAmount: number,
    itemPrice: number,
    actor: string = 'AI Buyer Agent'
  ): Promise<PolicyCheckResult> {
    // 1. Negative / Invalid Discount Security Check
    if (typeof discountAmount !== 'number' || isNaN(discountAmount) || discountAmount < 0) {
      return {
        allowed: false,
        requiresApproval: false,
        blockedReason: 'Invalid discount request: Discount amount cannot be negative or invalid.',
      };
    }

    // 2. Discount Exceeding Item Price Security Check
    if (discountAmount > itemPrice && itemPrice > 0) {
      return {
        allowed: false,
        requiresApproval: false,
        blockedReason: `Invalid discount request: Requested discount (₹${discountAmount}) cannot exceed total item price (₹${itemPrice}).`,
      };
    }

    const policy = await this.getActivePolicy();
    const discountPercent = itemPrice > 0 ? (discountAmount / itemPrice) * 100 : 0;

    // 3. 100% Discount Security Check
    if (discountPercent >= 100) {
      return {
        allowed: false,
        requiresApproval: true,
        blockedReason: 'Security alert: 100% free promotional discount requests require merchant approval.',
        policyLimit: policy.maxAutoDiscountPercent,
        requestedValue: discountPercent,
      };
    }

    // 4. Maximum Discount Amount Check
    if (discountAmount > policy.maxAutoDiscountAmount) {
      const blockedReason = `Requested discount of ₹${discountAmount.toLocaleString('en-IN')} exceeds maximum allowed automatic discount of ₹${policy.maxAutoDiscountAmount.toLocaleString('en-IN')}.`;

      await AuditService.log({
        actor,
        agent: actor,
        action: 'POLICY_CHECK_DISCOUNT',
        reason: blockedReason,
        amount: discountAmount,
        policy: `Max Discount Amount <= ₹${policy.maxAutoDiscountAmount}`,
        approvalStatus: 'BLOCKED',
        result: 'BLOCKED',
      });

      return {
        allowed: false,
        requiresApproval: true,
        blockedReason,
        policyLimit: policy.maxAutoDiscountAmount,
        requestedValue: discountAmount,
        policyRuleName: 'maxAutoDiscountAmount',
      };
    }

    // 5. Maximum Discount Percentage Check
    if (discountPercent > policy.maxAutoDiscountPercent) {
      const blockedReason = `Requested discount of ${discountPercent.toFixed(1)}% exceeds maximum allowed discount percentage of ${policy.maxAutoDiscountPercent}%.`;

      await AuditService.log({
        actor,
        agent: actor,
        action: 'POLICY_CHECK_DISCOUNT_PERCENT',
        reason: blockedReason,
        amount: discountAmount,
        policy: `Max Discount Percent <= ${policy.maxAutoDiscountPercent}%`,
        approvalStatus: 'BLOCKED',
        result: 'BLOCKED',
      });

      return {
        allowed: false,
        requiresApproval: true,
        blockedReason,
        policyLimit: policy.maxAutoDiscountPercent,
        requestedValue: discountPercent,
        policyRuleName: 'maxAutoDiscountPercent',
      };
    }

    await AuditService.log({
      actor,
      agent: actor,
      action: 'POLICY_CHECK_DISCOUNT',
      reason: `Discount ₹${discountAmount} (${discountPercent.toFixed(1)}%) satisfies merchant policy rules.`,
      amount: discountAmount,
      policy: `Max Discount <= ₹${policy.maxAutoDiscountAmount} / ${policy.maxAutoDiscountPercent}%`,
      approvalStatus: 'PASSED',
      result: 'SUCCESS',
    });

    return {
      allowed: true,
      requiresApproval: false,
    };
  }
}
