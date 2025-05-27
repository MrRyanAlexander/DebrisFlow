'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, ChevronsUpDown, Building } from 'lucide-react';
import { APP_NAME, NAV_ITEMS, USER_NAV_ITEMS } from '@/lib/constants';
import { MOCK_USERS } from '@/lib/mock-data'; // for demo user

interface AppLayoutProps {
  children: React.ReactNode;
}

// A client component to access sidebar context for dynamic content
function SidebarDynamicContent() {
  const { state } = useSidebar(); // Get sidebar state (expanded/collapsed)
  const currentUser = MOCK_USERS[0]; // Demo user

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <Building className="h-7 w-7 text-primary" />
            {state === 'expanded' && (
              <h1 className="text-xl font-semibold text-sidebar-foreground whitespace-nowrap">
                {APP_NAME}
              </h1>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={usePathname() === item.href}
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>

      <Separator className="my-2 bg-sidebar-border" />
      
      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <div className="flex items-center gap-2 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {state === 'expanded' && (
                  <div className="flex flex-col items-start grow text-left overflow-hidden">
                    <span className="text-sm font-medium truncate">{currentUser.name}</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate">{currentUser.email}</span>
                  </div>
                )}
                 {state === 'expanded' && <ChevronsUpDown className="h-4 w-4 opacity-50 ml-auto shrink-0" />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {USER_NAV_ITEMS.map((item) => (
              <Link href={item.href} passHref key={item.label}>
                <DropdownMenuItem asChild>
                  <a>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </a>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}


export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarDynamicContent />
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" /> {/* Mobile trigger */}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
