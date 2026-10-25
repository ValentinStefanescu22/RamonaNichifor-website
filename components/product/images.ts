import type { Media } from "@/content/types";

// Which photo of a keepsake plays which part (the deck's winner, its two public pairs, the fans) is found by the number at the
// end of the printer file's name, never by its place in the admin list: Ramona can reorder the photos freely.
// ponytail: a file renamed away from „…-NN.webp” drops out of its part (the fans then fall back to the stored order);
// a per-photo role field in Payload if she ever uploads decks whose files are not numbered.

/** fluturele-03.webp → 3 (also after Payload's „-1” suffix for a file uploaded twice); NaN when the name has no number */
const numberOf = (m: Media) => Number(/-(\d{2})(?:-\d+)?\.\w+$/.exec(m.src.split("?")[0])?.[1] ?? Number.NaN);

export const byNumber = (images: Media[], n: number) => images.find((m) => numberOf(m) === n);

/** The photos numbered `wanted`, in that order; when none is found, the first ones in the stored order */
export function pickNumbered(images: Media[], wanted: number[]): Media[] {
  const found = wanted.map((n) => byNumber(images, n)).filter((m): m is Media => Boolean(m));
  return found.length ? found : images.slice(0, wanted.length);
}

/** What the small fans show (the mockup's choice): three cards, three bookmarks */
export const fanOf = (gallery: "bookmarks" | "cards" | null, images: Media[]) =>
  gallery === "cards" ? pickNumbered(images, [3, 1, 5]) : gallery === "bookmarks" ? pickNumbered(images, [1, 4, 8]) : images.slice(0, 1);
