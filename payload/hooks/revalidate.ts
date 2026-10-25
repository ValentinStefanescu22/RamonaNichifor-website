import { revalidateTag } from "next/cache";
import { NEXT_CACHE_IMPLICIT_TAG_ID } from "next/dist/lib/constants";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, RequestContext } from "payload";

type Status = { _status?: "draft" | "published" | null } | null | undefined;

/** Every page under the root layout carries this implicit tag: it is what `revalidatePath("/", "layout")` expires. */
const SITE_TAG = `${NEXT_CACHE_IMPLICIT_TAG_ID}/layout`;

/** Re-render the public site after a publish.
 *  Stale-while-revalidate ("max"), not revalidatePath's expire: the next visit gets the last good page at once and
 *  re-renders it in the background, so a database outage right after a publish never 500s a page (a failed
 *  re-render keeps the old one and retries). Cost: the first visit after a publish still shows the previous version.
 *  ponytail: whole-site revalidation is fine for a small site; switch to per-page tags if it grows. */
function revalidateSite(context: RequestContext, doc: Status, previousDoc?: Status) {
  if (context.seeding) return;
  // drafts stay private: only a published doc (or one unpublished just now, or an unversioned one like media) changes the site.
  // The first draft saved over a published doc also passes (previousDoc is that published doc): a harmless identical re-render.
  if (doc?._status === "draft" && previousDoc?._status !== "published") return;
  try {
    revalidateTag(SITE_TAG, "max");
  } catch {
    // outside a Next request (seed, `payload run`, CLI) there is no cache to revalidate
  }
}

const afterChange: CollectionAfterChangeHook & GlobalAfterChangeHook = ({ context, doc, previousDoc }) => {
  revalidateSite(context, doc, previousDoc);
  return doc;
};
const afterDelete: CollectionAfterDeleteHook = ({ context }) => revalidateSite(context, null);

/** A collection's `hooks` (fresh arrays per config: Payload may add its own hooks to them) */
export const revalidateCollection = () => ({ afterChange: [afterChange], afterDelete: [afterDelete] });
/** A global's `hooks` (globals can't be deleted) */
export const revalidateGlobal = () => ({ afterChange: [afterChange] });
