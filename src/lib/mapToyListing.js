const CATEGORY_LABELS = {
  doll: "Doll",
  puzzles: "Puzzles",
  vehicle: "Vehicle",
  educational: "Educational",
  outdoor: "Outdoor",
};

const EXCHANGE_LABELS = { ...CATEGORY_LABELS, any: "Any Category" };

function catLabel(slug, map) {
  const k = String(slug || "");
  return map[k] || (k ? k : "—");
}

export function isMongoId(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

export function mapApiToyToListing(toy) {
  const t = toy;
  const owner =
    typeof t.owner === "object"
      ? t.owner
      : { name: "", username: "", reliabilityAvg: 8 };

  const images =
    Array.isArray(t.imageUrls) && t.imageUrls.length ? t.imageUrls : [""];

  const oc = owner;
  const reliability =
    typeof oc.reliabilityAvg === "number" && Number.isFinite(oc.reliabilityAvg)
      ? oc.reliabilityAvg
      : 8;

  const details = [
    { label: "Category", value: catLabel(t.category, CATEGORY_LABELS) },
    { label: "Condition", value: `${t.condition ?? 8}/10` },
    { label: "Age group", value: t.ageRange || "—" },
    { label: "Estimated worth", value: t.estimatedWorth || "—" },
    {
      label: "Open to exchange for",
      value: catLabel(t.exchangeFor, EXCHANGE_LABELS),
    },
    {
      label: "Visible to",
      value: t.shareWithAll
        ? "All friends"
        : `Friends (${t.contacts?.length ?? 0} selected)`,
    },
  ];

  const listedOn =
    typeof t.createdAt === "string" ? t.createdAt.slice(0, 10) : "";

  return {
    id: t.id,
    title: t.title,
    imageUrl: images[0] || "",
    images,
    listedBy: oc.name || oc.username || "Member",
    ownerUsername: oc.username || null,
    listedOn,
    rating: reliability / 2,
    ownerUserId: oc.id ?? null,
    location: oc.location || "—",
    description:
      typeof t.description === "string"
        ? t.description
        : "No description provided.",
    details,
    _api: true,
  };
}
