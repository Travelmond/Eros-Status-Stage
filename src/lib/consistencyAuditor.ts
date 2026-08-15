/**
 * Re-export do auditor de consistência real.
 * O auditor passivo está em `src/core/audit.ts`.
 */

export { runAudit, filterPendingIssues, countPendingIssues } from '@/core/audit';

export type { AuditOptions } from '@/core/audit';
