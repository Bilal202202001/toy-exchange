/** Mock exchange requests — replace with API data later */

/** Others requesting your listings (incoming). */
export const incomingRequestsMock = [
  {
    id: "req-in-1",
    toyId: "mine-seed-3",
    toyTitle: "Lego Set",
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop",
    requesterName: "Sana Javed",
    requesterUsername: "sarah_m",
    requesterLocation: "Austin, TX",
    requesterRating: 9.8,
    message:
      "Hi! We’re looking for LEGO for our 4-year-old. Happy to swap one of our board games if you’re interested.",
    requestedAt: "2026-04-10",
    status: "pending",
  },
  {
    id: "req-in-2",
    toyId: "mine-seed-1",
    toyTitle: "Vintage Wooden Train",
    imageUrl:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
    requesterName: "Ali Tariq",
    requesterUsername: null,
    requesterLocation: "Portland, OR",
    requesterRating: 8,
    message: "",
    requestedAt: "2026-04-09",
    status: "pending",
  },
  {
    id: "req-in-3",
    toyId: "mine-seed-3",
    toyTitle: "LEGO bricks bundle",
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop",
    requesterName: "The Hussain family",
    requesterUsername: "chen_family",
    requesterLocation: "Seattle, WA",
    requesterRating: 9.2,
    message:
      "Could we pick up this weekend? Our kids are building a big city project.",
    requestedAt: "2026-04-08",
    status: "accepted",
  },
  {
    id: "req-in-4",
    toyId: "mine-seed-2",
    toyTitle: "Plush teddy bear",
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop",
    requesterName: "Ahmed K.",
    requesterUsername: "james_k",
    requesterLocation: "Portland, OR",
    requesterRating: 8.6,
    message:
      "Is the teddy still available? We can meet in Portland.",
    requestedAt: "2026-04-05",
    status: "declined",
  },
];

/** Initial thread per incoming request id (UI mock). */
export const incomingRequestsChatSeed = {
  "req-in-1": [
    {
      id: "c1",
      from: "them",
      body: "Hi! We’re looking for a train set for our 4-year-old. Happy to swap one of our board games if you’re interested.",
      time: "2026-04-10T14:22:00",
    },
    {
      id: "c2",
      from: "me",
      body: "Thanks for the message! What board games do you have in mind?",
      time: "2026-04-10T15:01:00",
    },
  ],
  "req-in-2": [
    {
      id: "c1",
      from: "them",
      body: "Interested in vintage wooden trains — can meet this week if helpful.",
      time: "2026-04-09T09:00:00",
    },
  ],
  "req-in-4": [
    {
      id: "c1",
      from: "them",
      body: "Is the teddy still available? We can meet in Portland.",
      time: "2026-04-05T09:00:00",
    },
  ],
};

/** Your requests on other people’s listings (outgoing). */
export const outgoingRequestsMock = [
  {
    id: "req-out-1",
    toyId: "2",
    toyTitle: "Plush teddy bear",
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop",
    sellerName: "Ahmed K.",
    sellerUsername: "james_k",
    sellerLocation: "Portland, OR",
    message: "Perfect for our toddler—thanks for listing!",
    requestedAt: "2026-04-11",
    status: "pending",
  },
  {
    id: "req-out-2",
    toyId: "4",
    toyTitle: "Balance bike (ages 2–4)",
    imageUrl:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&h=200&fit=crop",
    sellerName: "Ayesha L.",
    sellerUsername: "maria_l",
    sellerLocation: "Denver, CO",
    message: "",
    requestedAt: "2026-04-06",
    status: "accepted",
  },
  {
    id: "req-out-3",
    toyId: "5",
    toyTitle: "Board game collection",
    imageUrl:
      "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=200&h=200&fit=crop",
    sellerName: "Bilal R.",
    sellerUsername: "david_r",
    sellerLocation: "Chicago, IL",
    message: "Interested in the strategy titles if still available.",
    requestedAt: "2026-04-03",
    status: "declined",
  },
];

/** Initial thread per outgoing request id (you messaging the seller). */
export const outgoingRequestsChatSeed = {
  "req-out-1": [
    {
      id: "o1",
      from: "me",
      body: "Perfect for our toddler—thanks for listing!",
      time: "2026-04-11T10:00:00",
    },
    {
      id: "o2",
      from: "them",
      body: "Glad it helps! Pickup in Portland NE works for us.",
      time: "2026-04-11T10:18:00",
    },
  ],
  "req-out-2": [
    {
      id: "o1",
      from: "me",
      body: "Is the seat adjustable for a tall 3-year-old?",
      time: "2026-04-06T14:00:00",
    },
    {
      id: "o2",
      from: "them",
      body: "Yes—three height slots. I can send a quick photo.",
      time: "2026-04-06T14:22:00",
    },
  ],
  "req-out-3": [
    {
      id: "o1",
      from: "me",
      body: "Interested in the strategy titles if still available.",
      time: "2026-04-03T09:00:00",
    },
    {
      id: "o2",
      from: "them",
      body: "Sorry, those were claimed last week.",
      time: "2026-04-03T09:30:00",
    },
  ],
};

/**
 * Rich “request details” payload (Pending Request Detail View).
 * Requests with keys here resolve to /toybox/requests/[id].
 */
export const incomingRequestDetailExtras = {
  "req-in-2": {
    partnerOfferedToys: [
      {
        toyId: "partner-offer-1",
        title: "Retro Robot B-Series",
        imageUrl:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop",
        conditionLabel: "9/10",
        estValueUsd: 30,
      },
      {
        toyId: "partner-offer-2",
        title: "Lego Space Station",
        imageUrl:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop",
        conditionLabel: "8/10",
        estValueUsd: 20,
      },
    ],
    yourOfferToy: {
      toyId: "mine-seed-1",
      title: "Vintage Wooden Train",
      imageUrl:
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
      conditionLabel: "9/10",
      estValueUsd: 30,
    },
    partner: {
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
      tradesCount: 24,
      rating: 9.8,
      locationLabel: "Portland, Oregon",
    },
    totalRequestValueUsd: 50,
    totalOfferValueUsd: 30,
  },
};

const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces";

/** When no rich mock payload exists — enough to render request details consistently. */
function buildFallbackIncomingDetailExtra(base) {
  const rating = Number(base.requesterRating);
  const r = Number.isFinite(rating) ? rating : 8;
  const offerUsd = Math.max(15, Math.min(95, Math.round(r * 3.5)));

  return {
    partnerOfferedToys: [
      {
        toyId: `partner-stub-${base.id}`,
        title: `Offer bundle (chat for details)`,
        imageUrl: base.imageUrl,
        conditionLabel: "—",
        estValueUsd: offerUsd,
      },
    ],
    yourOfferToy: {
      toyId: base.toyId,
      title: base.toyTitle,
      imageUrl: base.imageUrl,
      conditionLabel: "—",
      estValueUsd: offerUsd,
    },
    partner: {
      avatarUrl: DEFAULT_AVATAR_URL,
      tradesCount: 12,
      rating: Number(r.toFixed(1)),
      locationLabel: base.requesterLocation,
    },
    totalRequestValueUsd: offerUsd,
    totalOfferValueUsd: offerUsd,
  };
}

export function getIncomingRequestDetailPayload(requestId) {
  const id = String(requestId);
  const base = incomingRequestsMock.find((r) => r.id === id);
  if (!base) return null;

  const extra =
    incomingRequestDetailExtras[id] ?? buildFallbackIncomingDetailExtra(base);

  const loc =
    extra.partner.locationLabel ??
    base.requesterLocation ??
    "";

  return {
    ...base,
    partnerOfferedToys: extra.partnerOfferedToys,
    yourOfferToy: extra.yourOfferToy,
    partnerDetail: {
      name: base.requesterName,
      avatarUrl: extra.partner.avatarUrl,
      location: loc,
      username: base.requesterUsername,
      tradesCount: extra.partner.tradesCount,
      ratingDisplay: Number(extra.partner.rating),
    },
    totalRequestValueUsd: extra.totalRequestValueUsd,
    totalOfferValueUsd: extra.totalOfferValueUsd,
  };
}

export function hasIncomingRequestDetailPage(requestId) {
  return incomingRequestsMock.some((r) => r.id === String(requestId));
}

/** Finished swaps — exchange history + rate partner (see Requests → Completed). */
export const completedExchangesMock = [
  {
    id: "cex-1",
    toyId: "2",
    toyTitle: "Vintage Teddy Bear",
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop",
    partnerName: "Sana Javed",
    partnerUsername: "sarah_m",
  },
  {
    id: "cex-2",
    toyId: "1",
    toyTitle: "Wooden Railway Set",
    imageUrl:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
    partnerName: "Muneeb Hussain",
    partnerUsername: "chen_family",
  },
  {
    id: "cex-3",
    toyId: "6",
    toyTitle: "Smart Robot Kit",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop",
    partnerName: "Mariam Raza",
    partnerUsername: null,
  },
];
