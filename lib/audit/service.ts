import { prisma } from '@/lib/db';
import { AuditEventRecord } from '@/types';

export interface LogAuditInput {
  actor: string;
  agent?: string;
  action: string;
  reason: string;
  amount?: number | null;
  policy?: string | null;
  approvalStatus?: 'APPROVED' | 'BLOCKED' | 'PASSED' | 'REJECTED' | 'NOT_REQUIRED' | null;
  result?: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'PENDING' | null;
  metadataJson?: string | null;
}

export class AuditService {
  /**
   * Record a new immutable audit event
   */
  static async log(input: LogAuditInput): Promise<AuditEventRecord> {
    try {
      const event = await prisma.auditEvent.create({
        data: {
          actor: input.actor,
          agent: input.agent || input.actor,
          action: input.action,
          reason: input.reason,
          amount: input.amount !== undefined ? input.amount : null,
          policy: input.policy || null,
          approvalStatus: input.approvalStatus || 'NOT_REQUIRED',
          result: input.result || 'SUCCESS',
          metadataJson: input.metadataJson || null,
        },
      });

      return {
        id: event.id,
        timestamp: event.timestamp.toISOString(),
        actor: event.actor,
        agent: event.agent,
        action: event.action,
        reason: event.reason,
        amount: event.amount,
        policy: event.policy,
        approvalStatus: event.approvalStatus as AuditEventRecord['approvalStatus'],
        result: event.result as AuditEventRecord['result'],
        metadataJson: event.metadataJson,
      };
    } catch (err: any) {
      console.warn('AuditService.log write error fallback:', err.message);
      return {
        id: `audit_fallback_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: input.actor,
        agent: input.agent || input.actor,
        action: input.action,
        reason: input.reason,
        amount: input.amount || null,
        policy: input.policy || null,
        approvalStatus: input.approvalStatus || 'NOT_REQUIRED',
        result: input.result || 'SUCCESS',
        metadataJson: input.metadataJson || null,
      };
    }
  }

  /**
   * Fetch audit trail with optional filtering
   */
  static async getEvents(options?: {
    actor?: string;
    action?: string;
    result?: string;
    search?: string;
    limit?: number;
  }): Promise<AuditEventRecord[]> {
    try {
      const where: any = {};

      if (options?.actor && options.actor !== 'ALL') {
        where.actor = options.actor;
      }

      if (options?.action) {
        where.action = { contains: options.action };
      }

      if (options?.result && options.result !== 'ALL') {
        where.result = options.result;
      }

      if (options?.search) {
        where.OR = [
          { action: { contains: options.search } },
          { reason: { contains: options.search } },
          { actor: { contains: options.search } },
          { policy: { contains: options.search } },
        ];
      }

      const events = await prisma.auditEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: options?.limit || 100,
      });

      return events.map((e) => ({
        id: e.id,
        timestamp: e.timestamp.toISOString(),
        actor: e.actor,
        agent: e.agent,
        action: e.action,
        reason: e.reason,
        amount: e.amount,
        policy: e.policy,
        approvalStatus: e.approvalStatus as AuditEventRecord['approvalStatus'],
        result: e.result as AuditEventRecord['result'],
        metadataJson: e.metadataJson,
      }));
    } catch (err: any) {
      console.warn('AuditService.getEvents read error fallback:', err.message);
      return [];
    }
  }
}
