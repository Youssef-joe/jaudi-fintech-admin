export interface AuditLog {
  _id: string;
  userEmail: string;
  action: string;
  timestamp: string;
  ip?: string;
  region?: string;
}
