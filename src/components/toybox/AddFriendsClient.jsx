"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Inbox, Send } from "lucide-react";
import { slugifyUsername } from "@/lib/profile";
import { apiFetch } from "@/lib/apiClient";

function formatUserRatingTenth(n) {
  const raw = Number(n);
  if (n == null || Number.isNaN(raw)) return "—";
  return `${raw.toFixed(1)}/10`;
}

const inviteStatusStyles = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 dark:bg-amber-900/25 dark:text-amber-200 dark:ring-amber-800/80",
  },
};

function InviteStatusBadge() {
  const cfg = inviteStatusStyles.pending;
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

async function patchFriendship(id, action) {
  return apiFetch(`/api/friends/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

/** Incoming friend invites — mirrors IncomingForToyCard on Requests. */
function FriendInviteIncomingCard({ req, index, actionBusyId, respond }) {
  const router = useRouter();

  const nameEl =
    req.username != null ? (
      <Link
        href={`/toybox/profile/${req.username}`}
        onClick={(e) => e.stopPropagation()}
        className="font-semibold text-slate-700 underline-offset-2 hover:text-primary hover:underline dark:text-slate-300 dark:hover:text-[#80deea]"
      >
        {req.name || req.username}
      </Link>
    ) : (
      <span className="font-semibold text-slate-700 dark:text-slate-300">
        {req.name || req.username}
      </span>
    );

  const badgeEl = (
    <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400">
      Pending
    </span>
  );

  const openProfile = () => {
    if (req.username) router.push(`/toybox/profile/${req.username}`);
  };

  return (
    <li
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${index % 2 === 1 ? "opacity-90" : ""}`}
    >
      <div
        role="button"
        tabIndex={0}
        className="-m-[1px] cursor-pointer rounded-2xl p-4 text-left outline-none transition-colors hover:bg-slate-50/90 focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-slate-800/60 dark:focus-visible:ring-[#4dd0e1]"
        onClick={openProfile}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProfile();
          }
        }}
      >
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={req.avatarUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <span className="truncate font-bold text-slate-800 dark:text-slate-100">
                Wants to be friends
              </span>
              {badgeEl}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              From {nameEl}
              {req.username ? (
                <>
                  {" "}
                  <span className="text-slate-400 dark:text-slate-500">
                    @{req.username}
                    {req.location && req.location !== "—" ? ` · ${req.location}` : null}
                  </span>
                </>
              ) : null}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-amber-400">star</span>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                User rating: {formatUserRatingTenth(req.reliabilityAvg)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-slate-100 p-4 pt-3 dark:border-slate-700">
        <button
          type="button"
          className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-800"
          disabled={actionBusyId === req.friendshipId}
          onClick={(e) => {
            e.stopPropagation();
            void respond(req.friendshipId, "reject");
          }}
        >
          Decline
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,196,217,0.25)] transition-colors hover:bg-primary-hover active:opacity-90 disabled:opacity-60"
          disabled={actionBusyId === req.friendshipId}
          onClick={(e) => {
            e.stopPropagation();
            void respond(req.friendshipId, "accept");
          }}
        >
          {actionBusyId === req.friendshipId ? "Saving…" : "Accept"}
        </button>
      </div>
    </li>
  );
}

/** Outgoing friend invite row — mirrors outgoing toy request rows. */
function FriendInviteOutgoingCard({ req }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <Link
          href={`/toybox/profile/${req.username ?? ""}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24"
        >
          <Image
            src={req.avatarUrl}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                You invited
              </p>
              {req.username ? (
                <Link
                  href={`/toybox/profile/${req.username}`}
                  className="mt-1 block text-lg font-bold text-slate-900 transition-colors hover:text-[#00C4D9] dark:text-slate-100"
                >
                  {req.name || req.username}
                </Link>
              ) : (
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {req.name || "Member"}
                </p>
              )}
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                @{req.username}
                <span className="text-slate-400">
                  {" "}
                  · {req.location || "—"}
                </span>
              </p>
            </div>
            <InviteStatusBadge />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/toybox/profile/${req.username ?? ""}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
            >
              View profile
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

function ConnectedFriendCard({ f }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="p-4">
        <div className="flex gap-4">
          <Link
            href={`/toybox/profile/${f.username ?? ""}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
          >
            <Image src={f.avatarUrl} alt="" fill className="object-cover" sizes="80px" unoptimized />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/toybox/profile/${f.username ?? ""}`}
                className="truncate text-base font-bold text-slate-800 transition-colors hover:text-primary dark:text-slate-100 dark:hover:text-[#80deea]"
              >
                {f.name || f.username}
              </Link>
              <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400">
                Friends
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              @{f.username}
              {f.location && f.location !== "—" ? (
                <>
                  {" "}
                  <span className="text-slate-400 dark:text-slate-500">· {f.location}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Preview card after username search — action depends on friendship state. */
function FindFriendSearchResultCard({
  profile,
  relation,
  sendBusy,
  actionMessage,
  onSendRequest,
}) {
  const href = `/toybox/profile/${profile.username ?? ""}`;

  let action = null;
  if (relation === "friends") {
    action = (
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Already friends</p>
    );
  } else if (relation === "incoming") {
    action = (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This person already sent you a request — open{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">For you</span> to respond.
      </p>
    );
  } else if (relation === "outgoing") {
    action = (
      <button
        type="button"
        disabled
        className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
      >
        Request pending
      </button>
    );
  } else {
    action = (
      <button
        type="button"
        disabled={sendBusy}
        onClick={onSendRequest}
        className="rounded-2xl bg-[#00C4D9] px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,196,217,0.35)] transition hover:bg-[#00ACC1] disabled:opacity-50"
      >
        {sendBusy ? "Sending…" : "Send request"}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <Link
            href={href}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
          >
            <Image
              src={profile.avatarUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          </Link>
          <div className="min-w-0">
            <Link
              href={href}
              className="truncate text-lg font-bold text-slate-900 transition-colors hover:text-[#00C4D9] dark:text-slate-100"
            >
              {profile.displayName || profile.username}
            </Link>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              @{profile.username}
              {profile.location ? (
                <span className="text-slate-400">
                  {" "}
                  · {profile.location}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              User rating: {formatUserRatingTenth(profile.reliabilityAvg)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">{action}</div>
      </div>
      {actionMessage ? (
        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">{actionMessage}</p>
      ) : null}
    </div>
  );
}

export default function AddFriendsClient() {
  const [phase, setPhase] = useState("pending");
  const [tab, setTab] = useState("incoming");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [sendRequestBusy, setSendRequestBusy] = useState(false);
  /** @type {null | { profile: any; isSelf?: boolean }} */
  const [searchPayload, setSearchPayload] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [requestActionMessage, setRequestActionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  /** @type {string | null} */
  const [actionBusyId, setActionBusyId] = useState(null);
  const [respondError, setRespondError] = useState("");

  const load = useCallback(async () => {
    const res = await apiFetch("/api/friends");
    if (!res.ok) {
      setFriends([]);
      setIncoming([]);
      setOutgoing([]);
      return;
    }
    const data = await res.json();
    setFriends(Array.isArray(data.friends) ? data.friends : []);
    setIncoming(Array.isArray(data.incomingFriendRequests) ? data.incomingFriendRequests : []);
    setOutgoing(Array.isArray(data.outgoingFriendRequests) ? data.outgoingFriendRequests : []);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await load();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  useEffect(() => {
    function onFocus() {
      if (document.visibilityState === "visible") void load();
    }
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [load]);

  const incomingCount = incoming.length;

  const sortedIncoming = useMemo(() => [...incoming], [incoming]);

  const searchedRelation = useMemo(() => {
    if (!searchPayload?.profile) return "none";
    const p = searchPayload.profile;
    const uname = String(p.username || "");
    const pid = String(p.id || "");
    if (friends.some((f) => f.username === uname || f.id === pid)) return "friends";
    if (incoming.some((r) => r.username === uname || r.id === pid)) return "incoming";
    if (outgoing.some((r) => r.username === uname || r.id === pid)) return "outgoing";
    return "none";
  }, [searchPayload, friends, incoming, outgoing]);

  const searchUserByUsername = async () => {
    setSearchError("");
    setRequestActionMessage("");
    setSearchPayload(null);
    const username = slugifyUsername(searchQuery);
    if (!username) return;
    setSearchBusy(true);
    try {
      const res = await apiFetch(`/api/users/${encodeURIComponent(username)}`);
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSearchError(
          typeof j?.error === "string" ? j.error : "No user with that username.",
        );
        return;
      }
      if (j.isSelf) {
        setSearchError("That's your username — enter someone else's @handle.");
        return;
      }
      setSearchPayload(j);
    } finally {
      setSearchBusy(false);
    }
  };

  const sendFriendRequestForSearched = async () => {
    const username = slugifyUsername(String(searchPayload?.profile?.username ?? ""));
    if (!username) return;
    setRequestActionMessage("");
    setSendRequestBusy(true);
    try {
      const res = await apiFetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRequestActionMessage(
          typeof j?.error === "string" ? j.error : "Could not send request.",
        );
        return;
      }
      setRequestActionMessage("Friend request sent.");
      await load();
    } finally {
      setSendRequestBusy(false);
    }
  };

  const respond = async (friendshipId, action) => {
    setRespondError("");
    setActionBusyId(friendshipId);
    try {
      const res = await patchFriendship(friendshipId, action);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRespondError(
          typeof body?.error === "string" ? body.error : "Something went wrong. Try again.",
        );
        return;
      }
      await load();
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div className="w-full min-w-0 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 lg:pb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">Friends</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 lg:text-base">
            Search by username to send a request, respond to invites, and browse everyone you&apos;re
            connected with.
          </p>
        </div>
      </div>

      <div
        className="mt-8 flex w-full rounded-xl bg-slate-200/50 p-1 dark:bg-slate-800/50 sm:max-w-md"
        role="tablist"
        aria-label="Friends view"
      >
        <button
          type="button"
          role="tab"
          aria-selected={phase === "pending"}
          onClick={() => setPhase("pending")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            phase === "pending"
              ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Pending
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={phase === "connected"}
          onClick={() => setPhase("connected")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            phase === "connected"
              ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Connected
        </button>
      </div>

      {phase === "connected" && (
        <div className="mt-8 space-y-4" role="tabpanel" aria-label="Connected friends">
          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ) : friends.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              No friends yet. Open <strong className="font-semibold text-slate-700 dark:text-slate-300">Pending</strong>{" "}
              to search by username and send a request, or respond under For you.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 xl:gap-6">
              {friends.map((f) => (
                <ConnectedFriendCard key={f.id} f={f} />
              ))}
            </ul>
          )}
        </div>
      )}

      {phase === "pending" && (
        <>
          <section className="mt-8 space-y-4" aria-label="Find a friend by username">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Add a friend
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search by ToyBox username. If they have an account, you&apos;ll see their card and can
                send a request.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void searchUserByUsername();
                    }
                  }}
                  placeholder="username"
                  disabled={searchBusy}
                  autoComplete="off"
                  className="min-h-[3.25rem] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm outline-none ring-2 ring-transparent transition placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:ring-[#e0f7fa] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  disabled={searchBusy || !slugifyUsername(searchQuery)}
                  onClick={() => void searchUserByUsername()}
                  className="rounded-2xl bg-[#00C4D9] px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,196,217,0.35)] transition hover:bg-[#00ACC1] disabled:opacity-50 sm:min-w-[8.5rem]"
                >
                  {searchBusy ? "Searching…" : "Search"}
                </button>
              </div>
              {searchError ? (
                <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                  {searchError}
                </p>
              ) : null}
            </div>

            {searchPayload?.profile ? (
              <FindFriendSearchResultCard
                profile={searchPayload.profile}
                relation={searchedRelation}
                sendBusy={sendRequestBusy}
                actionMessage={requestActionMessage}
                onSendRequest={() => void sendFriendRequestForSearched()}
              />
            ) : null}
          </section>

          <div
            className="mt-8 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:inline-flex"
            role="tablist"
            aria-label="Friend request direction"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "incoming"}
              onClick={() => setTab("incoming")}
              disabled={loading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none sm:px-6 ${
                tab === "incoming"
                  ? "bg-[#e0f7fa] text-[#00838F] shadow-sm ring-1 ring-[#B2EBF2]/80"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <Inbox className="h-4 w-4 shrink-0" aria-hidden />
              For you
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === "incoming"
                    ? "bg-white/80 text-[#00838F]"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                {loading ? "…" : incomingCount}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "outgoing"}
              onClick={() => setTab("outgoing")}
              disabled={loading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none sm:px-6 ${
                tab === "outgoing"
                  ? "bg-[#e0f7fa] text-[#00838F] shadow-sm ring-1 ring-[#B2EBF2]/80"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <Send className="h-4 w-4 shrink-0" aria-hidden />
              Sent invites
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === "outgoing"
                    ? "bg-white/80 text-[#00838F]"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                }`}
              >
                {loading ? "…" : outgoing.length}
              </span>
            </button>
          </div>

          <div className="mt-6 space-y-4" role="tabpanel">
            {respondError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                {respondError}
              </p>
            ) : null}

            {loading ? (
              <div className="space-y-4">
                <div className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              </div>
            ) : (
              <>
                {tab === "incoming" && (
                  <ul className="space-y-4">
                    {sortedIncoming.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                        No friend requests for you yet.
                      </p>
                    ) : (
                      sortedIncoming.map((req, idx) => (
                        <FriendInviteIncomingCard
                          key={req.friendshipId}
                          req={req}
                          index={idx}
                          actionBusyId={actionBusyId}
                          respond={respond}
                        />
                      ))
                    )}
                  </ul>
                )}

                {tab === "outgoing" && (
                  <ul className="space-y-4">
                    {outgoing.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                        No pending invites sent yet. Use Add a friend above to search by username.
                      </p>
                    ) : (
                      outgoing.map((req) => (
                        <FriendInviteOutgoingCard key={req.friendshipId} req={req} />
                      ))
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
