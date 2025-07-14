
export type TransactionStatus = "Approved" | "Pending" | "Rejected"

export interface Transaction {
    _id: string;
    sender?: string;
    receiver?: string;
    amountUSD: number;
    amountUSDC: number;
    status: TransactionStatus
    region: string;
    createdAt: string;
    timestamp: string;
}

export type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

export interface TransactionsTableProps {
  currentRole: UserRole;
}
