"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle, Send, X } from "lucide-react";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

function formatChatTime(iso) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function formatChatListTime(iso) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function PeerTitle({ active }) {
  if (!active) return null;
  if ("requesterName" in active) {
    const { requesterName, requesterUsername } = active;
    if (requesterUsername) {
      return (
        <Link
          href={`/toybox/profile/${requesterUsername}`}
          className="hover:text-[#00ACC1] hover:underline"
        >
          {requesterName}
        </Link>
      );
    }
    return requesterName;
  }
  const { sellerName, sellerUsername } = active;
  if (sellerUsername) {
    return (
      <Link href={`/toybox/profile/${sellerUsername}`} className="hover:text-[#00ACC1] hover:underline">
        {sellerName}
      </Link>
    );
  }
  return sellerName;
}

export default function GlobalChatWidget() {
  const {
    incoming,
    outgoing,
    messagesByRequest,
    panelOpen,
    panelView,
    activeThreadId,
    openWidget,
    closePanel,
    goToList,
    selectThread,
    appendMessage,
    getRequestById,
  } = useChatWidget();

  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef(null);

  const threadRows = useMemo(() => {
    const rows = [];
    for (const req of incoming) {
      const msgs = messagesByRequest[req.id] ?? [];
      const last = msgs[msgs.length - 1];
      rows.push({
        id: req.id,
        peerName: req.requesterName,
        toyTitle: req.toyTitle,
        imageUrl: req.imageUrl,
        preview: last?.body ?? req.message ?? "No messages yet",
        sortTime: last?.time ?? req.requestedAt,
      });
    }
    for (const req of outgoing) {
      const msgs = messagesByRequest[req.id] ?? [];
      const last = msgs[msgs.length - 1];
      rows.push({
        id: req.id,
        peerName: req.sellerName,
        toyTitle: req.toyTitle,
        imageUrl: req.imageUrl,
        preview: last?.body ?? req.message ?? "No messages yet",
        sortTime: last?.time ?? req.requestedAt,
      });
    }
    return rows.sort(
      (a, b) => new Date(b.sortTime).getTime() - new Date(a.sortTime).getTime()
    );
  }, [incoming, outgoing, messagesByRequest]);

  const active = activeThreadId ? getRequestById(activeThreadId) : null;
  const threadMessages = activeThreadId ? messagesByRequest[activeThreadId] ?? [] : [];

  useEffect(() => {
    if (!panelOpen || panelView !== "thread") setChatInput("");
  }, [panelOpen, panelView, activeThreadId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threadMessages, panelView, activeThreadId]);

  const handleSend = () => {
    if (!activeThreadId) return;
    appendMessage(activeThreadId, chatInput);
    setChatInput("");
  };

  const fab = (
    <button
      type="button"
      onClick={() => (panelOpen ? closePanel() : openWidget())}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00C4D9] text-white shadow-[0_8px_32px_rgba(0,196,217,0.45)] ring-4 ring-white/90 transition-transform hover:scale-105 hover:bg-[#00ACC1] active:scale-[0.98]"
      aria-label={panelOpen ? "Close messages" : "Open messages"}
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </button>
  );

  /** Same panel height for conversation list and active thread (~60vh, capped for small/large screens). */
  const panelShellClass =
    "pointer-events-auto flex h-[min(60vh,calc(100dvh-8rem))] max-h-[560px] w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]";

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[85] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {panelOpen && (
        <div className={panelShellClass} role="dialog" aria-label="Messages">
          {panelView === "list" && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-[#e0f7fa]/90 to-white px-4 py-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900">Messages</h2>
                  <p className="text-xs text-slate-500">Your conversations</p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Minimize"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {threadRows.length === 0 ? (
                  <li className="px-4 py-10 text-center text-sm text-slate-500">
                    No conversations yet.
                  </li>
                ) : (
                  threadRows.map((row) => (
                    <li key={row.id} className="border-b border-slate-50 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => selectThread(row.id)}
                        className="flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-[#e0f7fa]/40"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={row.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {row.peerName}
                            </p>
                            <span className="shrink-0 text-[10px] font-medium text-slate-400">
                              {formatChatListTime(row.sortTime)}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-500">{row.toyTitle}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                            {row.preview}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {panelView === "thread" && active && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 items-start gap-2 border-b border-slate-100 px-3 py-3 sm:px-4">
                <button
                  type="button"
                  onClick={goToList}
                  className="shrink-0 rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-bold text-slate-900">
                    <PeerTitle active={active} />
                  </h2>
                  <p className="truncate text-xs text-slate-500">About: {active.toyTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="shrink-0 rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4"
              >
                {threadMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[85%] ${m.from === "me"
                          ? "rounded-br-md bg-[#00C4D9] text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-800"
                        }`}
                    >
                      <p>{m.body}</p>
                      <p
                        className={`mt-1 text-[10px] font-medium ${m.from === "me" ? "text-white/80" : "text-slate-500"
                          }`}
                      >
                        {formatChatTime(m.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message…"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#e0f7fa]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!chatInput.trim()}
                    className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#00C4D9] px-4 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-[#00ACC1] disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pointer-events-auto">{fab}</div>
    </div>
  );
}
