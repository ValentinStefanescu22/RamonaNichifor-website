import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { safePath } from "@/lib/preview";

export async function GET(request: Request) {
  (await draftMode()).disable();
  redirect(safePath(new URL(request.url).searchParams.get("path")) ?? "/");
}
