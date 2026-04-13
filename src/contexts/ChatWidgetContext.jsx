"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  incomingRequestsChatSeed,
  incomingRequestsMock,
  outgoingRequestsChatSeed,
  outgoingRequestsMock,
} from "@/data/toyRequests";
import { normalizeProfileUsername } from "@/lib/publicProfiles";

function buildInitialMessages() {
  const initial = {};
  for (const req of incomingRequestsMock) {
    initial[req.id] = [...(incomingRequestsChatSeed[req.id] ?? [])];
  }
  for (const req of outgoingRequestsMock) {
    initial[req.id] = [...(outgoingRequestsChatSeed[req.id] ?? [])];
  }
  return initial;
}

const ChatWidgetContext = createContext(null);

export function ChatWidgetProvider({ children }) {
  const [incoming, setIncoming] = useState(incomingRequestsMock);
  const [messagesByRequest, setMessagesByRequest] = useState(buildInitialMessages);
  const [panelOpen, setPanelOpen] = useState(false);
  /** 'list' shows conversation history; 'thread' shows active chat */
  const [panelView, setPanelView] = useState("list");
  const [activeThreadId, setActiveThreadId] = useState(null);

  const outgoing = outgoingRequestsMock;

  const getRequestById = useCallback(
    (id) =>
      incoming.find((r) => r.id === id) ?? outgoing.find((r) => r.id === id) ?? null,
    [incoming, outgoing]
  );

  const openWidget = useCallback(() => {
    setPanelOpen(true);
    setPanelView("list");
    setActiveThreadId(null);
  }, []);

  const openWidgetToThread = useCallback((requestId) => {
    setPanelOpen(true);
    setPanelView("thread");
    setActiveThreadId(requestId);
  }, []);

  /** Open chat: jump to thread with this user if we have one, else show history list. */
  const openWidgetForPeerUsername = useCallback(
    (username) => {
      const u = normalizeProfileUsername(username);
      if (!u) {
        openWidget();
        return;
      }
      const inc = incoming.find(
        (r) => normalizeProfileUsername(r.requesterUsername) === u
      );
      if (inc) {
        openWidgetToThread(inc.id);
        return;
      }
      const out = outgoing.find(
        (r) => normalizeProfileUsername(r.sellerUsername) === u
      );
      if (out) {
        openWidgetToThread(out.id);
        return;
      }
      openWidget();
    },
    [incoming, outgoing, openWidget, openWidgetToThread]
  );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const goToList = useCallback(() => {
    setPanelView("list");
    setActiveThreadId(null);
  }, []);

  const selectThread = useCallback((requestId) => {
    setActiveThreadId(requestId);
    setPanelView("thread");
  }, []);

  const appendMessage = useCallback((requestId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const row = {
      id: `local-${Date.now()}`,
      from: "me",
      body: trimmed,
      time: new Date().toISOString(),
    };
    setMessagesByRequest((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] ?? []), row],
    }));
  }, []);

  const setRequestStatus = useCallback((id, status) => {
    setIncoming((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const value = useMemo(
    () => ({
      incoming,
      outgoing,
      messagesByRequest,
      setMessagesByRequest,
      panelOpen,
      setPanelOpen,
      panelView,
      setPanelView,
      activeThreadId,
      setActiveThreadId,
      openWidget,
      openWidgetToThread,
      openWidgetForPeerUsername,
      closePanel,
      goToList,
      selectThread,
      appendMessage,
      setRequestStatus,
      getRequestById,
    }),
    [
      incoming,
      outgoing,
      messagesByRequest,
      panelOpen,
      panelView,
      activeThreadId,
      openWidget,
      openWidgetToThread,
      openWidgetForPeerUsername,
      closePanel,
      goToList,
      selectThread,
      appendMessage,
      setRequestStatus,
      getRequestById,
    ]
  );

  return (
    <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>
  );
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) {
    throw new Error("useChatWidget must be used within ChatWidgetProvider");
  }
  return ctx;
}
