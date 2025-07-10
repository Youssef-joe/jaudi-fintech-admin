
import React from 'react';
import { Home, Users, CreditCard, FileText, Settings, BarChart3, Shield, Building, Send, ArrowDownUp } from 'lucide-react';
import { Sidebar as SidebarUI, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';

type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

interface NavigationItem {
  title: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

interface SidebarProps {
  currentRole: UserRole;
}

const getNavigationItems = (role: UserRole): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    { title: 'Dashboard', icon: Home, active: true },
    { title: 'Transactions', icon: ArrowDownUp },
    { title: 'Audit Logs', icon: FileText },
  ];

  const roleSpecificItems: Record<UserRole, NavigationItem[]> = {
    'Global Admin': [
      { title: 'User Management', icon: Users },
      { title: 'Partners', icon: Building },
      { title: 'Analytics', icon: BarChart3 },
      { title: 'System Settings', icon: Settings },
      { title: 'Security', icon: Shield },
    ],
    'Regional Admin': [
      { title: 'Regional Analytics', icon: BarChart3 },
      { title: 'Local Partners', icon: Building },
      { title: 'Regional Settings', icon: Settings },
    ],
    'Sending Partner': [
      { title: 'Send Money', icon: Send },
      { title: 'Payment Methods', icon: CreditCard },
      { title: 'Partner Settings', icon: Settings },
    ],
    'Receiving Partner': [
      { title: 'Receive Funds', icon: ArrowDownUp },
      { title: 'Payout Methods', icon: CreditCard },
      { title: 'Partner Settings', icon: Settings },
    ],
  };

  return [...baseItems, ...roleSpecificItems[role]];
};

export function Sidebar({ currentRole }: SidebarProps) {
  const navigationItems = getNavigationItems(currentRole);

  return (
    <SidebarUI className="w-64 border-r bg-white">
      <SidebarContent>
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinTech</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {currentRole}
            </span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={item.active ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-50'}
                  >
                    <a href="#" className="flex items-center space-x-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
}
