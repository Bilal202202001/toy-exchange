"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeProfileUsername } from "@/lib/profile";
import { apiFetch } from "@/lib/apiClient";
import { getStoredToken } from "@/lib/authToken";

const ChatWidgetContext = createContext(null);

export function ChatWidgetProvider({ children }) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [completedExchanges, setCompletedExchanges] = useState([]);
  const [messagesByRequest, setMessagesByRequest] = useState({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState("list");
  const [activeThreadId, setActiveThreadId] = useState(null);

  const loadExchanges = useCallback(async () => {
    if (!getStoredToken()) {
      setIncoming([]);
      setOutgoing([]);
      setCompletedExchanges([]);
      return;
    }

    const res = await apiFetch("/api/exchanges");
    if (!res.ok) return;

    /** @type {any} */

    const data = await res.json();

    setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
    setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
    setCompletedExchanges(Array.isArray(data.completed) ? data.completed : []);

  }, []);

  useEffect(() => {
    loadExchanges();
  }, [loadExchanges]);

  const getRequestById = useCallback(

    (id) => [...incoming, ...outgoing].find((r) => r.id === id) ?? null,
    [incoming, outgoing],

  );

  const openWidget = useCallback(() => {

    void loadExchanges();

    setPanelOpen(true);

    setPanelView("list");

    setActiveThreadId(null);

  }, [loadExchanges]);

  const openWidgetToThread = useCallback((requestId) => {
    void loadExchanges();

    setPanelOpen(true);

    setPanelView("thread");

    setActiveThreadId(requestId);

  }, [loadExchanges]);

  const openWidgetForPeerUsername = useCallback(

    (username) => {

      const u = normalizeProfileUsername(username);

      if (!u) {

        openWidget();

        return;

      }

      const inc = incoming.find(
        (r) => normalizeProfileUsername(r.requesterUsername) === u,
      );

      if (inc) {

        openWidgetToThread(inc.id);

        return;

      }

      const out = outgoing.find(

        (r) => normalizeProfileUsername(r.sellerUsername) === u,

      );

      if (out) {

        openWidgetToThread(out.id);

        return;

      }

      openWidget();

    },

    [incoming, outgoing, openWidget, openWidgetToThread],

  );

  const closePanel = useCallback(() => setPanelOpen(false), []);

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

  const setRequestStatus = useCallback(

    async (id, uiStatus) => {

      const status =

        uiStatus === "accepted"

          ? "accepted"

          : uiStatus === "declined"

            ? "declined"

            : null;

      if (!status) return;

      const res = await apiFetch(`/api/exchanges/${id}`, {

        method: "PATCH",

        body: JSON.stringify({ status }),

      });

      if (res.ok) await loadExchanges();

    },

    [loadExchanges],

  );

  const value = useMemo(
    () => ({
      incoming,
      outgoing,
      completedExchanges,
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
      loadExchanges,
    }),
    [
      incoming,
      outgoing,
      completedExchanges,
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
      loadExchanges,
    ],
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
