
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/AuthContext';
import { useProfile } from '@/hooks/useSupabaseData';
import { LogOut, User, Settings } from 'lucide-react';

interface HeaderProps {
  selectedView: string;
  onViewChange: (view: 'overview' | 'institutions' | 'transactions' | 'management') => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedView, onViewChange }) => {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="gradient-primary text-white shadow-financial-lg">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sistem Keuangan Yayasan Al-Hidayah</h1>
            <p className="text-primary-foreground/80 mt-2">
              Dashboard konsolidasi multi-lembaga pendidikan
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation Menu */}
            <div className="flex gap-2">
              <Button 
                onClick={() => onViewChange('overview')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'overview' 
                    ? 'bg-white text-primary' 
                    : 'bg-primary-foreground/10 text-white hover:bg-primary-foreground/20'
                }`}
              >
                Overview
              </Button>
              <Button 
                onClick={() => onViewChange('institutions')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'institutions' 
                    ? 'bg-white text-primary' 
                    : 'bg-primary-foreground/10 text-white hover:bg-primary-foreground/20'
                }`}
              >
                Lembaga
              </Button>
              <Button 
                onClick={() => onViewChange('transactions')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'transactions' 
                    ? 'bg-white text-primary' 
                    : 'bg-primary-foreground/10 text-white hover:bg-primary-foreground/20'
                }`}
              >
                Transaksi
              </Button>
              <Button 
                onClick={() => onViewChange('management')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'management' 
                    ? 'bg-white text-primary' 
                    : 'bg-primary-foreground/10 text-white hover:bg-primary-foreground/20'
                }`}
              >
                Manajemen
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-white text-primary">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      Role: {profile?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
