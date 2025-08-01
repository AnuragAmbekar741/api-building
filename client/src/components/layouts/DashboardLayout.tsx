import { useState } from 'react'
import {
  Mail,
  Home,
  Settings,
  Users,
  BarChart3,
  Menu,
  LogOut,
} from 'lucide-react'

import { useAuth } from '@/hooks/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Nav } from '@/components/nav/nav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      title: 'Dashboard',
      label: '',
      icon: Home,
      variant: 'default' as const,
      href: '/dashboard',
    },
    {
      title: 'Mail',
      label: '9',
      icon: Mail,
      variant: 'ghost' as const,
      href: '/dashboard/mail',
    },
    {
      title: 'Analytics',
      label: '',
      icon: BarChart3,
      variant: 'ghost' as const,
      href: '/dashboard/analytics',
    },
    {
      title: 'Users',
      label: '',
      icon: Users,
      variant: 'ghost' as const,
      href: '/dashboard/users',
    },
    {
      title: 'Settings',
      label: '',
      icon: Settings,
      variant: 'ghost' as const,
      href: '/dashboard/settings',
    },
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        variant="default"
        size={isCollapsed ? 'icon' : 'default'}
        className="relative"
      >
        <SidebarHeader className="p-4">
          <div className="flex justify-between items-center">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold tracking-tight">
                Dashboard
              </h2>
            )}
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="icon"
              className="w-6 h-6"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </SidebarHeader>

        <Separator />

        <SidebarContent className="p-2">
          <Nav isCollapsed={isCollapsed} links={navItems} />
        </SidebarContent>

        <Separator />

        <SidebarFooter className="p-4">
          <div className="flex justify-between items-center">
            {!isCollapsed && user && (
              <div className="flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage alt={user.firstName} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            <Button
              onClick={logout}
              variant="ghost"
              size={isCollapsed ? 'icon' : 'sm'}
              className={isCollapsed ? 'w-8 h-8' : 'h-8'}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="overflow-hidden flex-1">{children}</main>
    </div>
  )
}
