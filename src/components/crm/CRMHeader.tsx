import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationCenter } from '@/components/crm/notifications/NotificationCenter';
import { AdvancedSearchDialog } from '@/components/crm/search/AdvancedSearchDialog';
import { Search, Settings, LogOut, User, Filter } from 'lucide-react';
import { useIsMobile } from '@/components/ui/use-mobile';
import { cn } from '@/lib/utils';

interface CRMHeaderProps {
  className?: string;
}

export function CRMHeader({ className }: CRMHeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setAdvancedSearchOpen(true);
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className={`flex h-16 items-center justify-between border-b bg-background px-6 ${className}`}>
      {/* Search */}
      <div className={cn(
        "flex items-center gap-4 flex-1",
        isMobile ? "max-w-[200px]" : "max-w-md"
      )}>
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isMobile ? "Pesquisar..." : "Pesquisar empresas, contactos, oportunidades..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setAdvancedSearchOpen(true)}
          className={cn(isMobile ? "h-8 w-8" : "")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side actions */}
      <div className={cn(
        "flex items-center",
        isMobile ? "gap-2" : "gap-4"
      )}>
        {/* Notifications */}
        <NotificationCenter />

        {/* Theme Toggle - Hide on mobile */}
        {!isMobile && <ThemeToggle />}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
                <AvatarFallback>
                  {user ? getUserInitials(user.first_name, user.last_name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Terminar Sessão</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Advanced Search Dialog */}
      <AdvancedSearchDialog
        open={advancedSearchOpen}
        onOpenChange={setAdvancedSearchOpen}
        onResultSelect={(result) => {
          // Navigate to result
          window.location.href = result.url;
        }}
      />
    </header>
  );
}
