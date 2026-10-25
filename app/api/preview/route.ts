import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { safePath } from "@/lib/preview";

const sameSecret = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Live Preview entry (admin.livePreview.url): turns draft mode on for this browser, then opens the page.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.PREVIEW_SECRET;
  const secret = searchParams.get("secret") ?? "";
  const path = safePath(searchParams.get("path"));
  if (!expected || !sameSecret(secret, expected)) return new Response("Invalid preview secret", { status: 401 });
  if (!path) return new Response("Invalid path", { status: 400 });
  (await draftMode()).enable();
  redirect(path);
}
