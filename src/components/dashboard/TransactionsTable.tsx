
import React, { useState } from 'react';
import { Filter, Search, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

interface TransactionsTableProps {
  currentRole: UserRole;
}

const mockTransactions = [
  {
    id: 'TXN-001',
    amountUSD: 1000.00,
    amountUSDC: 999.80,
    status: 'Approved',
    region: 'North America',
    timestamp: '2024-01-15 14:30:00'
  },
  {
    id: 'TXN-002',
    amountUSD: 2500.00,
    amountUSDC: 2499.50,
    status: 'Pending',
    region: 'Europe',
    timestamp: '2024-01-15 13:45:00'
  },
  {
    id: 'TXN-003',
    amountUSD: 750.00,
    amountUSDC: 749.85,
    status: 'Rejected',
    region: 'Asia Pacific',
    timestamp: '2024-01-15 12:20:00'
  },
  {
    id: 'TXN-004',
    amountUSD: 5000.00,
    amountUSDC: 4999.00,
    status: 'Approved',
    region: 'North America',
    timestamp: '2024-01-15 11:15:00'
  },
  {
    id: 'TXN-005',
    amountUSD: 320.00,
    amountUSDC: 319.94,
    status: 'Pending',
    region: 'Latin America',
    timestamp: '2024-01-15 10:30:00'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'Rejected':
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const filterTransactionsByRole = (transactions: typeof mockTransactions, role: UserRole) => {
  switch (role) {
    case 'Regional Admin':
      return transactions.filter(t => t.region === 'North America');
    case 'Sending Partner':
      return transactions.filter(t => t.status !== 'Rejected');
    case 'Receiving Partner':
      return transactions.filter(t => t.status === 'Approved');
    default:
      return transactions;
  }
};

export function TransactionsTable({ currentRole }: TransactionsTableProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = filterTransactionsByRole(mockTransactions, currentRole)
    .filter(transaction => {
      const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter;
      const matchesRegion = regionFilter === 'all' || transaction.region === regionFilter;
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesRegion && matchesSearch;
    });

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by Transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {currentRole === 'Global Admin' && (
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
              <SelectItem value="Latin America">Latin America</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Amount (USDC)</TableHead>
              <TableHead>Status</TableHead>
              {currentRole === 'Global Admin' && <TableHead>Region</TableHead>}
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>${transaction.amountUSD.toFixed(2)}</TableCell>
                <TableCell>{transaction.amountUSDC.toFixed(2)} USDC</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                {currentRole === 'Global Admin' && <TableCell>{transaction.region}</TableCell>}
                <TableCell className="text-gray-500">{transaction.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found matching your criteria.
        </div>
      )}
    </div>
  );
}
