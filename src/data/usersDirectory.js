/**
 * Mock public profiles — keyed by username (lowercase).
 * Listed toys on a profile come from toyListings + myToysDummyListings via ownerUsername.
 */

const ex = (
  id,
  toyId,
  title,
  imageUrl,
  receivedFrom,
  exchangedOn = "2026-03-15",
  tradedAway = "Toy swap"
) => ({
  id,
  toyId,
  title,
  imageUrl,
  receivedFrom,
  exchangedOn,
  tradedAway,
});

export const usersDirectory = {
  sabahat_hussain: {
    displayName: "Sabahat Hussain",
    bio: "Parent of two. Love sustainable swaps and LEGO nights.",
    location: "Austin, TX",
    avatarUrl: null,
    following: 42,
    followers: 128,
    likes: 316,
    exchanged: [
      ex("sh-1", "3", "LEGO bricks bundle", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop", "The Chen family", "2026-04-02", "Wooden blocks set"),
      ex("sh-2", "2", "Plush teddy bear", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop", "James K.", "2026-03-18", "Picture books bundle"),
      ex("sh-3", "4", "Balance bike", "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop", "Maria L.", "2026-03-05", "Scooter (toddler)"),
      ex("sh-4", "1", "Wooden train set", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop", "Sarah M.", "2026-02-20", "Puzzle collection"),
    ],
  },
  sarah_m: {
    displayName: "Sarah M.",
    bio: "Weekend swapper — trains, puzzles, and picture books.",
    location: "Austin, TX",
    avatarUrl: null,
    following: 18,
    followers: 56,
    likes: 210,
    exchanged: [
      ex("s1", "2", "Plush teddy bear", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop", "James K.", "2026-03-10", "Board game"),
      ex("s2", "5", "Board game collection", "https://images.unsplash.com/photo-1606503153255-59d8b8b82276?w=600&h=600&fit=crop", "David R.", "2026-02-28", "Puzzle set"),
    ],
  },
  james_k: {
    displayName: "James K.",
    bio: "Portland dad — soft toys and outdoor gear.",
    location: "Portland, OR",
    avatarUrl: null,
    following: 24,
    followers: 41,
    likes: 98,
    exchanged: [
      ex("j1", "1", "Wooden train set", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop", "Sarah M.", "2026-02-15", "Plush bundle"),
    ],
  },
  chen_family: {
    displayName: "The Chen family",
    bio: "LEGO enthusiasts in Seattle — always building.",
    location: "Seattle, WA",
    avatarUrl: null,
    following: 31,
    followers: 89,
    likes: 412,
    exchanged: [
      ex("c1", "4", "Balance bike", "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop", "Maria L.", "2026-03-01", "Scooter"),
      ex("c2", "6", "Dollhouse with furniture", "https://images.unsplash.com/photo-1515488043661-27bd3b4513d5?w=600&h=600&fit=crop", "Emma T.", "2026-01-20", "Brick lot"),
    ],
  },
  maria_l: {
    displayName: "Maria L.",
    bio: "Outdoor play & balance bikes.",
    location: "Denver, CO",
    avatarUrl: null,
    following: 12,
    followers: 34,
    likes: 67,
    exchanged: [
      ex("m1", "3", "LEGO bricks bundle", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop", "The Chen family", "2026-02-08", "Trike"),
    ],
  },
  david_r: {
    displayName: "David R.",
    bio: "Board games and family nights in Chicago.",
    location: "Chicago, IL",
    avatarUrl: null,
    following: 44,
    followers: 62,
    likes: 155,
    exchanged: [
      ex("d1", "8", "Puzzle set (500 pcs)", "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop", "Priya S.", "2026-03-22", "Card games"),
    ],
  },
  emma_t: {
    displayName: "Emma T.",
    bio: "Dollhouses, dress-up, and tea parties.",
    location: "Boston, MA",
    avatarUrl: null,
    following: 67,
    followers: 120,
    likes: 340,
    exchanged: [
      ex("e1", "7", "Remote control car", "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop", "Alex P.", "2026-03-30", "Kitchen set"),
    ],
  },
  alex_p: {
    displayName: "Alex P.",
    bio: "RC cars and STEM kits in Miami.",
    location: "Miami, FL",
    avatarUrl: null,
    following: 9,
    followers: 22,
    likes: 45,
    exchanged: [
      ex("a1", "9", "Science kit for kids", "https://images.unsplash.com/photo-1530982018-6d2aefe6d2d1?w=600&h=600&fit=crop", "Chris W.", "2026-02-11", "Drone toy"),
    ],
  },
  priya_s: {
    displayName: "Priya S.",
    bio: "Puzzles and nature themes — San Diego.",
    location: "San Diego, CA",
    avatarUrl: null,
    following: 28,
    followers: 51,
    likes: 188,
    exchanged: [
      ex("p1", "10", "Stuffed animals bundle", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", "Nina H.", "2026-03-14", "1000-pc puzzle"),
    ],
  },
  chris_w: {
    displayName: "Chris W.",
    bio: "STEM experiments with the kids in Phoenix.",
    location: "Phoenix, AZ",
    avatarUrl: null,
    following: 15,
    followers: 38,
    likes: 72,
    exchanged: [
      ex("ch1", "11", "Toy kitchen playset", "https://images.unsplash.com/photo-1515488043661-27bd3b4513d5?w=600&h=600&fit=crop", "Tom & Lisa", "2026-01-05", "Microscope kit"),
    ],
  },
  nina_h: {
    displayName: "Nina H.",
    bio: "Plushies for every nursery — Nashville.",
    location: "Nashville, TN",
    avatarUrl: null,
    following: 52,
    followers: 94,
    likes: 260,
    exchanged: [
      ex("n1", "12", "Action figures lot", "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=600&h=600&fit=crop", "Jordan B.", "2026-02-25", "Soft bundle"),
    ],
  },
  tom_lisa: {
    displayName: "Tom & Lisa",
    bio: "Pretend play and toy kitchens — Atlanta.",
    location: "Atlanta, GA",
    avatarUrl: null,
    following: 21,
    followers: 47,
    likes: 112,
    exchanged: [
      ex("tl1", "1", "Wooden train set", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop", "Sarah M.", "2026-03-18", "Play food set"),
    ],
  },
  jordan_b: {
    displayName: "Jordan B.",
    bio: "Action figures and collectibles — Minneapolis.",
    location: "Minneapolis, MN",
    avatarUrl: null,
    following: 8,
    followers: 19,
    likes: 33,
    exchanged: [
      ex("jo1", "5", "Board game collection", "https://images.unsplash.com/photo-1606503153255-59d8b8b82276?w=600&h=600&fit=crop", "David R.", "2026-01-12", "Figure lot"),
    ],
  },
};
