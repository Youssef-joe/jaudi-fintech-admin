
import React from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {useNavigate} from "react-router-dom";


type UserRole = 'Global Admin' | 'Regional Admin' | 'Sending Partner' | 'Receiving Partner';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface NavbarProps {
  user: User;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'Global Admin': return 'bg-purple-100 text-purple-800';
    case 'Regional Admin': return 'bg-blue-100 text-blue-800';
    case 'Sending Partner': return 'bg-green-100 text-green-800';
    case 'Receiving Partner': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function Navbar({ user, role, onRoleChange }: NavbarProps) {
  const roles: UserRole[] = ['Global Admin', 'Regional Admin', 'Sending Partner', 'Receiving Partner'];
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="hidden md:block">
          <Badge className={getRoleBadgeColor(role)}>
            {role}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
       

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-2">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
