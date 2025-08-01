import { useState } from 'react'
import { Search } from 'lucide-react'
import { MailDisplay } from './mail-display'
import { MailList } from './mail-list'
import type { Mail } from '@/types/mail'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { mails } from '@/data/mails'

export function MailPage() {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">Mail</h1>
      </div>
      <Separator />
      <Tabs defaultValue="all" className="flex flex-col flex-1">
        <div className="flex items-center px-4 py-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All mail</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </form>
        </div>
        <TabsContent value="all" className="flex flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} minSize={30}>
              <MailList
                items={mails}
                selectedMail={selectedMail}
                onSelectMail={setSelectedMail}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <MailDisplay mail={selectedMail} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        <TabsContent value="unread" className="flex flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} minSize={30}>
              <MailList
                items={mails.filter((mail) => !mail.read)}
                selectedMail={selectedMail}
                onSelectMail={setSelectedMail}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <MailDisplay mail={selectedMail} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
