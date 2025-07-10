
import React, { useState } from 'react';
import { Search, Download, User, Shield, CreditCard, Settings } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

interface AuditLogsTableProps {
  currentRole: UserRole;
}

const mockAuditLogs = [
  {
    id: 1,
    user: 'john.doe@fintech.com',
    action: 'Transaction Approved',
    timestamp: '2024-01-15 14:35:00',
    status: 'Success',
    details: 'Approved transaction TXN-001'
  },
  {
    id: 2,
    user: 'admin@fintech.com',
    action: 'User Role Updated',
    timestamp: '2024-01-15 14:20:00',
    status: 'Success',
    details: 'Changed user role from Partner to Regional Admin'
  },
  {
    id: 3,
    user: 'partner@fintech.com',
    action: 'Failed Login Attempt',
    timestamp: '2024-01-15 14:10:00',
    status: 'Failed',
    details: 'Invalid credentials provided'
  },
  {
    id: 4,
    user: 'regional@fintech.com',
    action: 'Settings Modified',
    timestamp: '2024-01-15 13:55:00',
    status: 'Success',
    details: 'Updated regional transaction limits'
  },
  {
    id: 5,
    user: 'system@fintech.com',
    action: 'Auto-Compliance Check',
    timestamp: '2024-01-15 13:30:00',
    status: 'Success',
    details: 'Automated compliance verification completed'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Success':
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    case 'Failed':
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getActionIcon = (action: string) => {
  if (action.includes('Transaction')) return <CreditCard className="w-4 h-4" />;
  if (action.includes('User') || action.includes('Login')) return <User className="w-4 h-4" />;
  if (action.includes('Settings')) return <Settings className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
};

const filterLogsByRole = (logs: typeof mockAuditLogs, role: UserRole) => {
  switch (role) {
    case 'Regional Admin':
      return logs.filter(log => 
        log.user.includes('regional') || 
        log.action.includes('Transaction') ||
        log.action.includes('Settings')
      );
    case 'Sending Partner':
    case 'Receiving Partner':
      return logs.filter(log => 
        log.user.includes('partner') || 
        log.action.includes('Transaction')
      );
    default:
      return logs;
  }
};

export function AuditLogsTable({ currentRole }: AuditLogsTableProps) {
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = filterLogsByRole(mockAuditLogs, currentRole)
    .filter(log => {
      const matchesUser = userFilter === 'all' || log.user.includes(userFilter);
      const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter);
      const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesUser && matchesAction && matchesSearch;
    });

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {currentRole === 'Global Admin' && (
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="partner">Partners</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="transaction">Transactions</SelectItem>
            <SelectItem value="user">User Management</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
            <SelectItem value="login">Authentication</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{log.user}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    <span>{log.action}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{log.timestamp}</TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No audit logs found matching your criteria.
        </div>
      )}
    </div>
  );
}
