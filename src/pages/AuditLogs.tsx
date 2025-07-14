import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { fetchAuditLogs } from '@/utils/auditlogs.ts';
import { AuditLog } from '@/types/AuditLogs.ts';
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import {Sidebar} from "./../components/dashboard/Sidebar.tsx";

const getActionColor = (action: string) => {
  if (action.toLowerCase().includes("login")) return 'bg-blue-100 text-blue-800';
  if (action.toLowerCase().includes("delete")) return 'bg-red-100 text-red-800';
  if (action.toLowerCase().includes("create")) return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

type UserRole =
  | "Global Admin"
  | "Regional Admin"
  | "Sending Partner"
  | "Receiving Partner";

 function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRole, setCurrentRole] = useState<UserRole>("Global Admin")
  const itemsPerPage = 6;
  const navigate = useNavigate();

  function handleGetBack () {
    navigate("/")
  }

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log =>
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
      (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
);

  return (
      
      <div className="space-y-4">
        {/* <SidebarProvider>

        <Sidebar currentRole={currentRole}/>

        </SidebarProvider> */}
      {/* Search Filter */}
      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button onClick={handleGetBack} className= "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-5" > Get Back To Dashboard </button>


      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map(log => (
              <TableRow key={log._id}>
                <TableCell>
                  <Badge className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>{log.userEmail}</TableCell>
                <TableCell>{log.region || '-'}</TableCell>
                <TableCell>{log.ip || '-'}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
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

export default AuditLogsTable
