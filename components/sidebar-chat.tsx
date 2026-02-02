"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Logo } from "@/components/logo";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Plus, 
  Search, 
  MessageSquare, 
  LayoutGrid,
  PanelLeft,
} from "lucide-react"

interface SidebarChatProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean
}

// Grouped Mock Data
const historyGroups = [
  {
    label: "Today",
    items: [
      { id: 1, title: "Sidebar ChatGPT Custom UI" },
      { id: 2, title: "Prompt Video Gemini AI" },
    ]
  },
  {
    label: "Yesterday",
    items: [
      { id: 3, title: "Rekomendasi Training LLM" },
      { id: 4, title: "Next.js FastAPI Docker Nginx" },
    ]
  },
  {
    label: "Previous 7 Days",
    items: [
        { id: 5, title: "Akses Chat History Claude" },
        { id: 6, title: "AI Builder Web dan Dataset" },
    ]
  },
    {
    label: "Previous 30 Days",
    items: [
        { id: 7, title: "Masalah Komunikasi Cloud Pi" },
        { id: 8, title: "Metode Terbaru Kecerdasan" },
        { id: 9, title: "Code Editor untuk React Nat..." },
    ]
  }
]

export function SidebarChat({ className, defaultCollapsed = false, ...props }: SidebarChatProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        data-collapsed={isCollapsed}
        className={cn(
          "group relative flex h-screen flex-col bg-muted/20 dark:bg-[#09090b] border-r data-[collapsed=true]:w-[60px] w-[260px] shrink-0 transition-all duration-300 ease-in-out sticky top-0 left-0 z-50",
          className
        )}
        {...props}
      >
        
        {/* Top Section */}
        <div className="flex flex-col gap-2 p-3">
             {/* Header Links / Branding + Toggle */}
             <div className={cn("flex items-center justify-between mb-2", isCollapsed ? "flex-col gap-2" : "px-2")}>
                {isCollapsed ? (
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground" onClick={toggleCollapse}>
                            <PanelLeft className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black text-white border-zinc-800">Open sidebar</TooltipContent>
                    </Tooltip>
                ) : (
                    <div className="flex w-full items-center justify-between">
                    <Link 
                        className="rounded-md px-3 py-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" 
                        href="/"
                    >
                        <Logo className="h-4" />
                    </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleCollapse}>
                                    <PanelLeft className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-white border-zinc-800" side="bottom">Close sidebar</TooltipContent>
                        </Tooltip>
                    </div>
                )}
             </div>

             {/* New Chat & Search */}

             {/* New Chat & Search */}
             {isCollapsed ? (
                 <div className="flex flex-col gap-2 items-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-black text-white border-zinc-800">New chat</TooltipContent>
                    </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Search className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-black text-white border-zinc-800">Search chats</TooltipContent>
                    </Tooltip>
                 </div>
             ) : (
                 <div className="space-y-1">
                     <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3 bg-background/50 hover:bg-muted/50 border-input/50 backdrop-blur-sm shadow-none">
                         <Plus className="h-4 w-4" />
                         <span>New chat</span>
                     </Button>
                 </div>
             )}
        </div>


        {/* History List */}
        <ScrollArea className="flex-1 px-3">
             {/* Secondary Actions (Images, Apps, etc. - modeled after ref) */}
             {!isCollapsed && (
                 <div className="mb-4">
                     <Button variant="ghost" className="w-full justify-start gap-3 h-9 px-2 text-sm text-muted-foreground hover:text-foreground">
                        <LayoutGrid className="h-4 w-4" />
                        <span>Explore GPTs</span>
                     </Button>
                 </div>
             )}

            <div className="flex flex-col gap-4 pb-4">
                {historyGroups.map((group) => (
                    <div key={group.label} className="flex flex-col gap-1">
                        {!isCollapsed && (
                            <h3 className="px-2 text-xs font-medium text-muted-foreground/70 mb-1 mt-2">
                                {group.label}
                            </h3>
                        )}
                        {group.items.map((chat) => (
                            isCollapsed ? (
                                <Tooltip key={chat.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 justify-center mx-auto"
                                    >
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">{chat.title}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4 bg-black text-white border-zinc-800">
                                    {chat.title}
                                </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button
                                key={chat.id}
                                variant="ghost"
                                className="w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 overflow-hidden"
                                >
                                <span className="truncate">{chat.title}</span>
                                </Button>
                            )
                        ))}
                    </div>
                ))}
            </div>
        </ScrollArea>

        {/* Footer: User Profile */}
        <div className="p-3 mt-auto">
            {isCollapsed ? (
                 <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-10 w-10 mx-auto flex">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>RN</AvatarFallback>
                     </Avatar>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right" className="bg-black text-white border-zinc-800">Radit Nathan</TooltipContent>
               </Tooltip>
            ) : (
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group/user">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-muted-foreground/20 text-xs">RN</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col text-sm text-left flex-1 min-w-0">
                        <span className="font-medium truncate text-sm">Radit Nathan</span>
                        <span className="text-xs text-muted-foreground truncate">Free</span>
                     </div>
                     <span className="text-xs border px-2 py-0.5 rounded-full bg-background/50 group-hover/user:bg-background">
                         Upgrade
                     </span>
                </div>
            )}
        </div>
      </div>
    </TooltipProvider>
  )
}
