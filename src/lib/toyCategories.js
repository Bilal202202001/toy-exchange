export const TOY_CATEGORIES = [
  { value: "art-crafts", label: "Art & Crafts" },
  { value: "building-blocks", label: "Building Blocks" },
  { value: "creative", label: "Creative" },
  { value: "dolls-figures", label: "Dolls & Figures" },
  { value: "electronic-toys", label: "Electronic Toys" },
  { value: "outdoor-sports", label: "Outdoor & Sports" },
  { value: "puzzles-games", label: "Puzzles & Games" },
  { value: "stuffed-animals", label: "Stuffed Animals" },
  { value: "vehicles", label: "Vehicles" },
];

const LEGACY_CATEGORY_SLUGS = {
  doll: "dolls-figures",
  puzzles: "puzzles-games",
  vehicle: "vehicles",
  outdoor: "outdoor-sports",
  educational: "creative",
};

export const CATEGORY_LABELS = {
  ...Object.fromEntries(TOY_CATEGORIES.map((c) => [c.value, c.label])),
  doll: "Doll",
  puzzles: "Puzzles",
  vehicle: "Vehicle",
  educational: "Educational",
  outdoor: "Outdoor",
};

/** Turn free-text / spaced values into canonical slugs used by the UI. */
export function resolveCategorySlug(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return LEGACY_CATEGORY_SLUGS[normalized] || normalized;
}
