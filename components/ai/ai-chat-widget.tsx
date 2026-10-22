"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Sparkles, Send, Loader2 } from "lucide-react";
import type { ProductCard } from "@/lib/ai/product-card-types";
import AIVoiceRecorder from "./ai-voice-recorder";
import AIProductCard from "./ai-product-card";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { useSession } from "@/lib/auth-client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ProductCard[];
};

type ChatResponse = {
  conversationId: string;
  reply: string;
  products: ProductCard[];
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session, isPending: sessionLoading } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, open, isSending]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isSending) return;

    setError(null);
    setIsSending(true);
    setInput("");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((previous) => [...previous, userMessage]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          ...(conversationId ? { conversationId } : {}),
        }),
      });

      const data = (await response.json()) as ChatResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setConversationId(data.conversationId);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          products: data.products ?? [],
        },
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setInput(message);

      setMessages((previous) =>
        previous.filter((item) => item.id !== userMessage.id),
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open HeavyFuel AI assistant"
          className="
            fixed bottom-36 right-6 z-50
            flex h-14 w-14 items-center justify-center
            rounded-full bg-[#CCFF00] text-black
            shadow-[0_0_30px_rgba(204,255,0,0.25)]
            transition-all duration-200
            hover:scale-110
            hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]
            active:scale-95
          "
        >
          <Bot size={27} strokeWidth={2.2} />
        </button>
      )}

      <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerContent
          className="
            ![--drawer-content-width:100%]
            sm:![--drawer-content-width:440px]
            ![--drawer-inset:0px]
            !h-dvh
            !rounded-none
            border-l border-white/10
            bg-[#0B0D10] text-white
          "
        >
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-[#0B0D10] px-5 py-4 text-left">
            {/* Branding */}
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <DrawerTitle className="text-xl font-black uppercase tracking-tighter text-white">
                  Heavy<span className="text-[#CCFF00]">Fuel</span>
                </DrawerTitle>

                <span className="rounded-md border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#CCFF00]">
                  AI
                </span>
              </div>

              <DrawerDescription className="text-xs text-[#8E8E93]">
                Your personal shopping assistant
              </DrawerDescription>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <DrawerClose
                aria-label="Close AI assistant"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8E8E93] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </DrawerClose>
            </div>
          </DrawerHeader>

          {!sessionLoading && !session ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <Bot size={42} className="text-[#CCFF00]" />

              <h3 className="text-xl font-black uppercase tracking-tight">
                Your AI shopping assistant
              </h3>

              <p className="max-w-xs text-sm leading-relaxed text-[#8E8E93]">
                Sign in to get personalized product recommendations and help
                finding the right gear.
              </p>

              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#CCFF00] px-6 py-3 text-sm font-black uppercase text-black transition-colors hover:bg-[#b3e600]"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-5">
                  <div className="flex flex-col items-start gap-2">
                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-[#13161C] px-4 py-3">
                      <p className="text-sm leading-relaxed text-white/90">
                        Hey! I'm your HeavyFuel shopping assistant. Looking for
                        supplements, apparel, or training gear? Tell me what you
                        need!
                      </p>
                    </div>
                  </div>

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex w-full max-w-[90%] flex-col gap-3">
                        <div
                          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            message.role === "user"
                              ? "self-end rounded-tr-sm bg-[#CCFF00] text-black"
                              : "self-start rounded-tl-sm border border-white/10 bg-[#13161C] text-white/90"
                          }`}
                        >
                          {message.content}
                        </div>

                        {message.role === "assistant" &&
                          message.products &&
                          message.products.length > 0 && (
                            <div className="flex flex-col gap-2">
                              {message.products.map((product) => (
                                <AIProductCard
                                  key={product.id}
                                  product={product}
                                  onNavigate={() => setOpen(false)}
                                />
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex items-center gap-2 text-sm text-[#8E8E93]">
                      <Loader2
                        size={16}
                        className="animate-spin text-[#CCFF00]"
                      />
                      HeavyFuel AI is thinking...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#0B0D10] p-4">
                {error && (
                  <p role="alert" className="mb-3 text-xs text-red-400">
                    {error}
                  </p>
                )}

                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about our products..."
                    maxLength={1000}
                    disabled={isSending || sessionLoading}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#13161C] px-4 py-3 text-sm text-white outline-none placeholder:text-[#8E8E93] focus:border-[#CCFF00]/50 disabled:opacity-50"
                  />
                  <AIVoiceRecorder
                    disabled={isSending || sessionLoading}
                    onTranscript={(transcript) => {
                      setInput((previous) =>
                        [previous.trim(), transcript]
                          .filter(Boolean)
                          .join(" ")
                          .slice(0, 1000),
                      );
                    }}
                    onError={(message) => setError(message || null)}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending || sessionLoading}
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00] text-black transition-colors hover:bg-[#b3e600] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSending ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <Send size={19} />
                    )}
                  </button>
                </form>

                <p className="mt-3 text-center text-[10px] text-[#8E8E93]">
                  AI-generated recommendations. Verify product details before
                  purchasing.
                </p>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
