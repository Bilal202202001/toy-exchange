/** Mock exchange requests — replace with API data later */

/** Others requesting your listings (incoming). */
export const incomingRequestsMock = [
  {
    id: "req-in-1",
    toyId: "mine-seed-1",
    toyTitle: "Wooden train set",
    imageUrl:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
    requesterName: "Sarah M.",
    requesterLocation: "Austin, TX",
    message:
      "Hi! We’re looking for a train set for our 4-year-old. Happy to swap one of our board games if you’re interested.",
    requestedAt: "2026-04-10",
    status: "pending",
  },
  {
    id: "req-in-2",
    toyId: "mine-seed-3",
    toyTitle: "LEGO bricks bundle",
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop",
    requesterName: "The Chen family",
    requesterLocation: "Seattle, WA",
    message: "Could we pick up this weekend? Our kids are building a big city project.",
    requestedAt: "2026-04-08",
    status: "accepted",
  },
  {
    id: "req-in-3",
    toyId: "mine-seed-2",
    toyTitle: "Plush teddy bear",
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop",
    requesterName: "James K.",
    requesterLocation: "Portland, OR",
    message: "",
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
      body: "Could we pick up this weekend? Our kids are building a big city project.",
      time: "2026-04-08T11:30:00",
    },
    {
      id: "c2",
      from: "me",
      body: "Saturday morning works for us. I’ll send the address after we confirm.",
      time: "2026-04-08T12:05:00",
    },
  ],
  "req-in-3": [
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
    sellerName: "James K.",
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
    sellerName: "Maria L.",
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
      "https://images.unsplash.com/photo-1606503153255-59d8b8b82276?w=200&h=200&fit=crop",
    sellerName: "David R.",
    sellerLocation: "Chicago, IL",
    message: "Interested in the strategy titles if still available.",
    requestedAt: "2026-04-03",
    status: "declined",
  },
];
