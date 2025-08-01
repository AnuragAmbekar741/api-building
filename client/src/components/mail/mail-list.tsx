import { formatDistanceToNow } from 'date-fns'
import type { Mail } from '@/types/mail'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MailListProps {
  items: Array<Mail>
  selectedMail?: Mail
  onSelectMail: (mail: Mail) => void
}

export function MailList({ items, selectedMail, onSelectMail }: MailListProps) {
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {items.map((item) => (
        <button
          key={item.id}
          className={cn(
            'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
            selectedMail?.id === item.id && 'bg-muted',
          )}
          onClick={() => onSelectMail(item)}
        >
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="w-6 h-6">
                  <AvatarImage alt={item.name} />
                  <AvatarFallback>
                    {item.name
                      .split(' ')
                      .map((chunk) => chunk[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="font-semibold">{item.name}</div>
                {!item.read && (
                  <span className="flex w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              <div
                className={cn(
                  'ml-auto text-xs',
                  selectedMail?.id === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {formatDistanceToNow(new Date(item.date), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className="text-xs font-medium">{item.subject}</div>
          </div>
          <div className="text-xs line-clamp-2 text-muted-foreground">
            {item.text.substring(0, 300)}
          </div>
          {item.labels.length ? (
            <div className="flex gap-2 items-center">
              {item.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )
}
