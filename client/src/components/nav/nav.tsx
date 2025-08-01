import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavProps {
  isCollapsed: boolean
  links: Array<{
    title: string
    label?: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
    href: string
  }>
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Button
              key={index}
              variant={link.variant}
              size="icon"
              className="w-9 h-9"
              asChild
            >
              <a href={link.href}>
                <link.icon className="w-4 h-4" />
                <span className="sr-only">{link.title}</span>
              </a>
            </Button>
          ) : (
            <Button
              key={index}
              variant={link.variant}
              className="justify-start w-full"
              asChild
            >
              <a href={link.href}>
                <link.icon className="w-4 h-4 mr-2" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      'ml-auto',
                      link.variant === 'default' &&
                        'text-background dark:text-white',
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </a>
            </Button>
          ),
        )}
      </nav>
    </div>
  )
}
