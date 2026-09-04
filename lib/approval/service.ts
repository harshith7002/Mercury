import { prisma } from '@/lib/db';
import { ApprovalRequestRecord } from '@/types';
import { AuditService } from '@/lib/audit/service';

export interface CreateApprovalInput {
  agentType: 'BUYER_AGENT' | 'GROWTH_AGENT';
  actionType: string;
  requestedAmount: number;
  policyLimit: number;
  reason: string;
  payloadJson: string;
}

export class ApprovalService {
  /**
   * Create a new pending approval request when an action exceeds policy limits
   */
  static async createRequest(input: CreateApprovalInput): Promise<ApprovalRequestRecord> {
    const record = await prisma.approvalRequest.create({
      data: {
        agentType: input.agentType,
        actionType: input.actionType,
        requestedAmount: input.requestedAmount,
        policyLimit: input.policyLimit,
        reason: input.reason,
        payloadJson: input.payloadJson,
        status: 'PENDING',
      },
    });

    await AuditService.log({
      actor: input.agentType,
      agent: input.agentType,
      action: 'APPROVAL_REQUESTED',
      reason: `Action requires merchant approval: ${input.reason}`,
      amount: input.requestedAmount,
      policy: `Policy Limit: ₹${input.policyLimit.toLocaleString('en-IN')}`,
      approvalStatus: 'BLOCKED',
      result: 'PENDING',
    });

    return {
      id: record.id,
      agentType: record.agentType,
      actionType: record.actionType,
      requestedAmount: record.requestedAmount,
      policyLimit: record.policyLimit,
      reason: record.reason,
      payloadJson: record.payloadJson,
      status: record.status as ApprovalRequestRecord['status'],
      createdAt: record.createdAt.toISOString(),
    };
  }

  /**
   * Fetch pending approval requests for Merchant Console
   */
  static async getPendingRequests(): Promise<ApprovalRequestRecord[]> {
    const requests = await prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => ({
      id: r.id,
      agentType: r.agentType,
      actionType: r.actionType,
      requestedAmount: r.requestedAmount,
      policyLimit: r.policyLimit,
      reason: r.reason,
      payloadJson: r.payloadJson,
      status: r.status as ApprovalRequestRecord['status'],
      decidedBy: r.decidedBy,
      decidedAt: r.decidedAt?.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  /**
   * Merchant approves or rejects an out-of-bounds agent action
   */
  static async decideRequest(
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    decidedBy: string = 'Merchant Admin'
  ): Promise<ApprovalRequestRecord> {
    const record = await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: decision,
        decidedBy,
        decidedAt: new Date(),
      },
    });

    const isApproved = decision === 'APPROVED';

    await AuditService.log({
      actor: decidedBy,
      agent: record.agentType,
      action: isApproved ? 'APPROVAL_GRANTED' : 'APPROVAL_REJECTED',
      reason: isApproved
        ? `Merchant manually approved override for ₹${record.requestedAmount.toLocaleString('en-IN')} action.`
        : `Merchant rejected override for ₹${record.requestedAmount.toLocaleString('en-IN')} action. Action cancelled.`,
      amount: record.requestedAmount,
      policy: `Policy Limit: ₹${record.policyLimit.toLocaleString('en-IN')}`,
      approvalStatus: isApproved ? 'APPROVED' : 'REJECTED',
      result: isApproved ? 'SUCCESS' : 'FAILED',
    });

    return {
      id: record.id,
      agentType: record.agentType,
      actionType: record.actionType,
      requestedAmount: record.requestedAmount,
      policyLimit: record.policyLimit,
      reason: record.reason,
      payloadJson: record.payloadJson,
      status: record.status as ApprovalRequestRecord['status'],
      decidedBy: record.decidedBy,
      decidedAt: record.decidedAt?.toISOString(),
      createdAt: record.createdAt.toISOString(),
    };
  }
}
