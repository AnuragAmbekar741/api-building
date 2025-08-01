import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Mail } from '@/types/mail'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  if (!mail) {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <div className="flex flex-col gap-2 items-center text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            No message selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a message from the list to view here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" disabled={!mail}>
            <Archive className="w-4 h-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon" disabled={!mail}>
            <ArchiveX className="w-4 h-4" />
            <span className="sr-only">Move to junk</span>
          </Button>
          <Button variant="ghost" size="icon" disabled={!mail}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Move to trash</span>
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" disabled={!mail}>
            <Clock className="w-4 h-4" />
            <span className="sr-only">Snooze</span>
          </Button>
        </div>
        <div className="flex gap-2 items-center ml-auto">
          <Button variant="ghost" size="icon" disabled={!mail}>
            <Reply className="w-4 h-4" />
            <span className="sr-only">Reply</span>
          </Button>
          <Button variant="ghost" size="icon" disabled={!mail}>
            <ReplyAll className="w-4 h-4" />
            <span className="sr-only">Reply all</span>
          </Button>
          <Button variant="ghost" size="icon" disabled={!mail}>
            <Forward className="w-4 h-4" />
            <span className="sr-only">Forward</span>
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <Button variant="ghost" size="icon" disabled={!mail}>
          <MoreVertical className="w-4 h-4" />
          <span className="sr-only">More</span>
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col flex-1">
        <div className="flex items-start p-4">
          <div className="flex gap-4 items-start text-sm">
            <Avatar>
              <AvatarImage alt={mail.name} />
              <AvatarFallback>
                {mail.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{mail.name}</div>
              <div className="text-xs line-clamp-1">{mail.subject}</div>
              <div className="text-xs line-clamp-1">
                <span className="font-medium">Reply-To:</span> {mail.email}
              </div>
            </div>
          </div>
          {mail.date && (
            <div className="ml-auto text-xs text-muted-foreground">
              {format(new Date(mail.date), 'PPpp')}
            </div>
          )}
        </div>
        <Separator />
        <div className="flex-1 p-4 text-sm whitespace-pre-wrap">
          {mail.text}
        </div>
        <Separator className="mt-auto" />
        <div className="p-4">
          <form>
            <div className="grid gap-4">
              <Textarea className="p-4" placeholder={`Reply ${mail.name}...`} />
              <div className="flex items-center">
                <Label
                  htmlFor="mute"
                  className="flex gap-2 items-center text-xs font-normal"
                >
                  <input type="checkbox" id="mute" className="w-4 h-4" />
                  Mute this conversation
                </Label>
                <Button
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                  className="ml-auto"
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
