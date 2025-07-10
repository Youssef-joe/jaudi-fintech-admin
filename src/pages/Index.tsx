
import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { CurrencyCard } from '@/components/dashboard/CurrencyCard';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { AuditLogsTable } from '@/components/dashboard/AuditLogsTable';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock user roles
type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Global Admin');
  const [currentUser] = useState({
    name: 'John Doe',
    email: 'john.doe@fintech.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar currentRole={currentRole} />
        
        <div className="flex-1 flex flex-col">
          <Navbar 
            user={currentUser} 
            role={currentRole} 
            onRoleChange={setCurrentRole}
          />
          
          <main className="flex-1 p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser.name}</p>
            </div>

            {/* Currency Rate Card */}
            <CurrencyCard />

            {/* Transactions Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                <p className="text-gray-600 text-sm mt-1">Monitor and manage financial transactions</p>
              </div>
              <TransactionsTable currentRole={currentRole} />
            </div>

            {/* Audit Logs Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
                <p className="text-gray-600 text-sm mt-1">Track system activities and user actions</p>
              </div>
              <AuditLogsTable currentRole={currentRole} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
