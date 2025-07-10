
import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, User, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';
type AuditStatus = 'Success' | 'Failed';
type ActionType = 'Login' | 'Transaction' | 'User Management' | 'Settings Update' | 'Export Data' | 'Password Change';

interface AuditLog {
  id: string;
  user: string;
  action: ActionType;
  timestamp: string;
  status: AuditStatus;
  details?: string;
  ipAddress?: string;
}

interface AuditLogsTableProps {
  currentRole: UserRole;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'AUD-001', user: 'admin@fintech.com', action: 'Login', timestamp: '2024-01-15 14:45:00', status: 'Success', ipAddress: '192.168.1.100' },
  { id: 'AUD-002', user: 'regional@fintech.com', action: 'Transaction', timestamp: '2024-01-15 14:30:00', status: 'Success', details: 'Approved TXN-001' },
  { id: 'AUD-003', user: 'partner1@sender.com', action: 'Transaction', timestamp: '2024-01-15 14:15:00', status: 'Failed', details: 'Insufficient funds' },
  { id: 'AUD-004', user: 'admin@fintech.com', action: 'User Management', timestamp: '2024-01-15 13:45:00', status: 'Success', details: 'Created new user account' },
  { id: 'AUD-005', user: 'regional@fintech.com', action: 'Settings Update', timestamp: '2024-01-15 13:30:00', status: 'Success', details: 'Updated transaction limits' },
  { id: 'AUD-006', user: 'partner2@receiver.com', action: 'Export Data', timestamp: '2024-01-15 13:00:00', status: 'Success', details: 'Downloaded transaction report' },
  { id: 'AUD-007', user: 'user@fintech.com', action: 'Password Change', timestamp: '2024-01-15 12:45:00', status: 'Failed', details: 'Invalid current password' },
  { id: 'AUD-008', user: 'admin@fintech.com', action: 'Login', timestamp: '2024-01-15 12:30:00', status: 'Failed', details: 'Multiple failed attempts', ipAddress: '10.0.0.1' },
];

const getStatusBadgeColor = (status: AuditStatus) => {
  switch (status) {
    case 'Success': return 'bg-green-100 text-green-800';
    case 'Failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getActionIcon = (action: ActionType) => {
  switch (action) {
    case 'Login': return User;
    case 'Transaction': return Activity;
    case 'User Management': return User;
    case 'Settings Update': return Filter;
    case 'Export Data': return Activity;
    case 'Password Change': return User;
    default: return Activity;
  }
};

export function AuditLogsTable({ currentRole }: AuditLogsTableProps) {
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'All'>('All');
  const [actionFilter, setActionFilter] = useState<ActionType | 'All'>('All');
  const [userFilter, setUserFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter(log => {
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchesAction = actionFilter === 'All' || log.action === actionFilter;
      const matchesUser = userFilter === 'All' || log.user === userFilter;
      const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role-based filtering
      if (currentRole === 'Sending Partner' || currentRole === 'Receiving Partner') {
        // Partners only see their own audit logs
        const userDomain = currentRole === 'Sending Partner' ? 'sender.com' : 'receiver.com';
        return matchesStatus && matchesAction && matchesUser && matchesSearch && 
               log.user.includes(userDomain);
      }
      
      return matchesStatus && matchesAction && matchesUser && matchesSearch;
    });
  }, [statusFilter, actionFilter, userFilter, searchTerm, currentRole]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueUsers = [...new Set(mockAuditLogs.map(log => log.user))];
  const uniqueActions: ActionType[] = ['Login', 'Transaction', 'User Management', 'Settings Update', 'Export Data', 'Password Change'];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AuditStatus | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as ActionType | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && <TableHead>IP Address</TableHead>}
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ActionIcon className="w-4 h-4 mr-2 text-blue-600" />
                      {log.action}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.details || '-'}
                  </TableCell>
                  {(currentRole === 'Global Admin' || currentRole === 'Regional Admin') && (
                    <TableCell className="text-sm text-gray-500">
                      {log.ipAddress || '-'}
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
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
