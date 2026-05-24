"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  AVA_INTRO,
  AVA_NODES,
  matchIntent,
  shouldSuppressDetailRepeat,
  type AvaNode,
} from "@/lib/content/ava-conversations";

interface ChatMessage {
  sender: "ava" | "user";
  text: string;
  quickReplies?: string[];
}

const TYPING_DELAY_MIN = 600;
const TYPING_DELAY_MAX = 1200;
const MAX_FALLBACKS = 3;

function typingDelay() {
  return Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN) + TYPING_DELAY_MIN;
}

export function AvaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fallbackCount, setFallbackCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const pushAvaMessage = useCallback(
    (node: AvaNode) => {
      setIsTyping(true);
      const delay = typingDelay();
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ava",
            text: node.avaMessage,
            quickReplies: node.autoFollowUp ? undefined : node.quickReplies,
          },
        ]);
        setIsTyping(false);
        scrollToBottom();

        if (node.autoFollowUp) {
          const followUpDelay = node.autoFollowUpDelay ?? 2000;
          setTimeout(() => {
            setIsTyping(true);
            scrollToBottom();
            setTimeout(() => {
              setMessages((prev) => {
                const lastTwoAva = prev
                  .filter((m) => m.sender === "ava")
                  .map((m) => m.text)
                  .slice(-2);
                const useAlternate =
                  Boolean(node.autoFollowUpAlternate) &&
                  shouldSuppressDetailRepeat(lastTwoAva);
                const followId = useAlternate
                  ? node.autoFollowUpAlternate!
                  : node.autoFollowUp!;
                const followUpNode = AVA_NODES[followId];
                if (!followUpNode) return prev;
                return [
                  ...prev,
                  {
                    sender: "ava",
                    text: followUpNode.avaMessage,
                    quickReplies: followUpNode.quickReplies,
                  },
                ];
              });
              setIsTyping(false);
              scrollToBottom();
            }, followUpDelay);
          }, 400);
        }
      }, delay);
    },
    [scrollToBottom],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    pushAvaMessage(AVA_INTRO);
  }, [pushAvaMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleUserInput = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, quickReplies: undefined })),
        { sender: "user", text: text.trim() },
      ]);
      setInput("");

      const nodeId = matchIntent(text);

      if (nodeId) {
        setFallbackCount(0);
        const node = AVA_NODES[nodeId];
        if (node) pushAvaMessage(node);
      } else {
        const nextFallback = fallbackCount + 1;
        setFallbackCount(nextFallback);
        const fallbackId =
          nextFallback >= MAX_FALLBACKS
            ? "fallback-3"
            : `fallback-${nextFallback}`;
        const node = AVA_NODES[fallbackId];
        if (node) pushAvaMessage(node);
      }
    },
    [isTyping, fallbackCount, pushAvaMessage],
  );

  const handleQuickReply = useCallback(
    (reply: string) => {
      handleUserInput(reply);
    },
    [handleUserInput],
  );

  const handleReset = useCallback(() => {
    setMessages([]);
    setFallbackCount(0);
    setIsTyping(false);
    initialized.current = false;
    setTimeout(() => {
      initialized.current = true;
      pushAvaMessage(AVA_INTRO);
    }, 100);
  }, [pushAvaMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserInput(input);
  };

  return (
    <div className="bg-gray-50 border border-ethos-blue/10 p-6 min-[768px]:p-8 relative overflow-hidden">
      {/* Session label */}
      <div className="absolute top-4 right-4 font-sans uppercase tracking-tight text-[9px] text-ethos-blue/40">
        AVA_SESSION_ACTIVE
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-ethos-blue pb-4">
        <div className="w-6 h-6 bg-ethos-blue flex items-center justify-center">
          <span className="font-sans text-[8px] font-bold text-white">AVA</span>
        </div>
        <h3 className="font-sans uppercase tracking-[0.15em] text-[11px] font-medium text-gray-900">
          Autodesk Virtual Assistant
        </h3>
        <button
          onClick={handleReset}
          className="ml-auto font-sans text-[10px] uppercase tracking-[0.1em] text-ethos-blue hover:opacity-60 transition-opacity cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="space-y-6 min-h-[280px] max-h-[360px] overflow-y-auto mb-8"
      >
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.sender === "ava" ? (
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-7 h-7 shrink-0 bg-ethos-blue flex items-center justify-center">
                  <span className="font-sans text-[8px] font-bold text-white">AVA</span>
                </div>
                <div>
                  <p className="font-serif text-[15px] leading-[1.6] text-gray-800 italic whitespace-pre-line">
                    {msg.text}
                  </p>
                  {msg.quickReplies && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          disabled={isTyping}
                          className="font-sans text-[10px] uppercase tracking-[0.05em] px-3 py-1.5 border border-ethos-blue/30 text-ethos-blue hover:bg-ethos-blue hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-7 h-7 shrink-0 bg-ethos-blue/10 flex items-center justify-center">
                  <span className="font-sans text-[8px] font-bold text-ethos-blue">YOU</span>
                </div>
                <p className="font-sans text-[13px] text-gray-800 pt-1">
                  {msg.text}
                </p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 shrink-0 bg-ethos-blue flex items-center justify-center">
              <span className="font-sans text-[8px] font-bold text-white">AVA</span>
            </div>
            <div className="flex items-center gap-1 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ethos-blue/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ethos-blue/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ethos-blue/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-ethos-blue pt-4 flex items-center gap-3"
      >
        <span className="text-ethos-blue font-bold text-sm">&gt;&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder="Type your question..."
          className="flex-1 bg-transparent font-sans text-[13px] text-gray-800 placeholder:text-ethos-blue/30 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="font-sans text-[11px] uppercase tracking-[0.1em] font-medium text-ethos-blue disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
