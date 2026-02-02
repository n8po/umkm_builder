"use client";

import { useState } from "react";
import { 
  PromptInput, 
  PromptInputProvider, 
  PromptInputTextarea
} from "@/components/ai-elements/prompt-input";
import { 
  Plus, 
  Paperclip, 
  ArrowUp, 
  ChevronDown,
  AudioWaveform
} from "lucide-react";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Chat() {
  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center bg-background p-4 text-foreground">
      {/* Container */}
      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        {/* Hero Text */}
        <h1 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">
          Let&apos;s build something, Raditya
        </h1>

        {/* Prompt Input */}
        <div className="w-full">
            <PromptInputProvider>
                <ChatInput />
            </PromptInputProvider>
        </div>

      </div>
    </div>
  );
}

function ChatInput() {
    const [inputValue, setInputValue] = useState("");
  
    return (
      <PromptInput
        className="group w-full overflow-hidden rounded-[28px] border border-input bg-background shadow-xl ring-1 ring-black/5 transition-all duration-150 ease-in-out hover:bg-muted/20 focus-within:bg-muted/20 focus-within:ring-ring/20 p-3 gap-2 [&_[data-slot=input-group]]:border-none [&_[data-slot=input-group]]:shadow-none"
        onSubmit={(message) => {
          console.log("Submitted:", message);
          setInputValue("");
        }}
        maxFiles={5}
      >
        <div className="relative flex flex-1 items-center">
            <PromptInputTextarea 
            placeholder="Ask AI to create a landing page for my..."
            className="flex-1 min-h-[40px] max-h-[max(35svh,5rem)] resize-none border-none bg-transparent px-2 py-2 text-[16px] leading-snug text-foreground placeholder:text-muted-foreground focus-visible:ring-0 md:text-base"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
        
        <InputGroupAddon align="block-end" className="flex w-full items-center justify-between px-0 pb-0 pt-0">
            
            {/* Left Actions */}
            <div className="flex items-center gap-0">
                <InputGroupButton 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-8 w-8 rounded-full border-[0.5px] border-transparent p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Add"
                >
                    <Plus className="h-5 w-5" />
                </InputGroupButton>

                <InputGroupButton 
                    variant="ghost"
                    className="h-8 gap-2 rounded-full border-[0.5px] border-transparent px-4 py-2 text-sm font-normal text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <Paperclip className="h-4 w-4" />
                    <span>Attach</span>
                </InputGroupButton>

                <button className="hidden md:flex flex-row items-center gap-2 rounded-full border-[0.5px] border-transparent px-4 py-2 text-sm font-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-[2px] border border-current opacity-70" />
                        <span className="truncate">Theme</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-60 ml-0.5" />
                </button>
            </div>

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-1">
                <button className="inline-flex h-8 items-center justify-center gap-2 rounded-full border-[0.5px] border-transparent bg-transparent px-4 py-2 text-sm font-normal text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                    Plan
                </button>
                
                <InputGroupButton 
                    variant="ghost" 
                    size="icon-sm" 
                    className="relative ms-2 h-8 w-8 rounded-full border-[0.5px] border-transparent p-0 text-blue-400 hover:bg-muted hover:text-blue-500"
                    aria-label="Voice Input"
                >
                    <AudioWaveform className="relative z-10 h-5 w-5" />
                </InputGroupButton>

                <Button 
                    type="submit"
                    size="icon"
                    className={cn(
                        "ms-2 h-8 w-8 rounded-full border-[0.5px] border-transparent p-0 shadow-sm transition-all text-primary-foreground",
                        inputValue.trim() 
                            ? "bg-primary hover:brightness-[0.8] active:brightness-[0.65]" 
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                    disabled={!inputValue.trim()}
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>
            </div>

        </InputGroupAddon>
      </PromptInput>
    );
  }
