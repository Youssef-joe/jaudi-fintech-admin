
import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';
type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';

interface Transaction {
  id: string;
  amountUSD: number;
  amountUSDC: number;
  status: TransactionStatus;
  region: string;
  timestamp: string;
  sender?: string;
  receiver?: string;
}

interface TransactionsTableProps {
  currentRole: UserRole;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', amountUSD: 1000, amountUSDC: 999.80, status: 'Approved', region: 'US-East', timestamp: '2024-01-15 14:30:00', sender: 'John Doe', receiver: 'Jane Smith' },
  { id: 'TXN-002', amountUSD: 2500, amountUSDC: 2499.50, status: 'Pending', region: 'EU-West', timestamp: '2024-01-15 13:45:00', sender: 'Alice Johnson', receiver: 'Bob Wilson' },
  { id: 'TXN-003', amountUSD: 750, amountUSDC: 749.85, status: 'Rejected', region: 'APAC', timestamp: '2024-01-15 12:20:00', sender: 'Charlie Brown', receiver: 'Diana Prince' },
  { id: 'TXN-004', amountUSD: 5000, amountUSDC: 4999.00, status: 'Approved', region: 'US-West', timestamp: '2024-01-15 11:15:00', sender: 'Eve Davis', receiver: 'Frank Miller' },
  { id: 'TXN-005', amountUSD: 1250, amountUSDC: 1249.75, status: 'Pending', region: 'EU-Central', timestamp: '2024-01-15 10:30:00', sender: 'Grace Lee', receiver: 'Henry Ford' },
];

const getStatusBadgeVariant = (status: TransactionStatus) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Pending': return 'secondary';
    case 'Rejected': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusBadgeColor = (status: TransactionStatus) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function TransactionsTable({ currentRole }: TransactionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
      const matchesRegion = regionFilter === 'All' || transaction.region === regionFilter;
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.receiver?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role-based filtering
      if (currentRole === 'Regional Admin') {
        // Regional admin only sees transactions from US regions
        return matchesStatus && matchesRegion && matchesSearch && transaction.region.startsWith('US');
      }
      
      return matchesStatus && matchesRegion && matchesSearch;
    });
  }, [statusFilter, regionFilter, searchTerm, currentRole]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueRegions = [...new Set(mockTransactions.map(t => t.region))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Amount (USDC)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Region</TableHead>
              {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && <TableHead>Sender</TableHead>}
              {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && <TableHead>Receiver</TableHead>}
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    ${transaction.amountUSD.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>${transaction.amountUSDC.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.region}</TableCell>
                {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && (
                  <TableCell>{transaction.sender}</TableCell>
                )}
                {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && (
                  <TableCell>{transaction.receiver}</TableCell>
                )}
                <TableCell className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
