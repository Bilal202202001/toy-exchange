import { areFriends } from "@/lib/db/friends";

/**
 * @param {string | import('mongoose').Types.ObjectId | null | undefined} viewerUserId
 * @param {import('mongoose').Types.ObjectId} ownerUserId
 * @param {boolean} shareWithAll
 * @param {(string | import('mongoose').Types.ObjectId | { toString(): string })[]} contactRefs
 */
export async function viewerCanSeeListing(
  viewerUserId,
  ownerUserId,
  shareWithAll,
  contactRefs,
) {
  if (!viewerUserId) return false;

  const ownerStr = ownerUserId.toString();
  const viewerStr = viewerUserId.toString();

  if (viewerStr === ownerStr) return true;

  const friend = await areFriends(viewerStr, ownerStr);
  if (!friend) return false;

  if (shareWithAll) return true;

  return contactRefs.some((c) => String(c).toString() === viewerStr);
}
