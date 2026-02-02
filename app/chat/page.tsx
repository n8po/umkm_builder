import { SidebarChat } from "@/components/sidebar-chat"
import { Chat } from "@/components/chat"
import { Header } from "@/components/header_chat"

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <SidebarChat />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Chat />
      </div>
    </div>
  )
}
