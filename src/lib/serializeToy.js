/** @typedef {{ _id?: import('mongoose').Types.ObjectId } & Record<string, unknown>} ToyLean */

/** @param {ToyLean['owner']} ownerRaw */
function serializeOwner(ownerRaw) {
  if (ownerRaw == null || typeof ownerRaw !== "object") return {};

  if ("username" in ownerRaw && "_id" in ownerRaw) {
    const o = /** @type {any} */ (ownerRaw);
    const rel = Number(o.reliabilityAvg);
    return {
      id: String(o._id),
      name: o.name ?? "",
      email: o.email ?? "",
      username: o.username ?? "",
      avatarUrl: o.avatarUrl ?? "",
      location: o.location ?? "",
      reliabilityAvg:
        typeof o.reliabilityAvg === "number" && Number.isFinite(rel)
          ? rel
          : null,
      exchangesCompleted:
        typeof o.exchangesCompleted === "number"
          ? o.exchangesCompleted
          : undefined,
    };
  }

  if ("_id" in ownerRaw) {
    const o = /** @type {any} */ (ownerRaw);
    return {
      id: String(o._id),
      name: o.name ?? "",
      email: o.email ?? "",
    };
  }

  try {

    /** @type {{ toString(): string }} */
    const o = ownerRaw;
    return { id: o.toString() };
  } catch {
    return {};
  }

}

/** @param {ToyLean} doc */

export function serializeToy(doc) {
  const contactsRaw = doc.contacts;

  return {
    id: doc._id?.toString(),
    owner: serializeOwner(doc.owner),
    title: doc.title,
    category: doc.category,
    condition: doc.condition,
    ageRange: doc.ageRange,
    description: doc.description,
    estimatedWorth: doc.estimatedWorth,
    exchangeFor: doc.exchangeFor,
    imageUrls: doc.imageUrls,
    shareWithAll: doc.shareWithAll,
    contacts: Array.isArray(contactsRaw)
      ? contactsRaw.map((c) =>
          typeof c === "object" && c !== null && "_id" in c
            ? /** @type {{ _id: { toString(): string }}} */ (c)._id.toString()
            : String(c),
        )
      : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

}
