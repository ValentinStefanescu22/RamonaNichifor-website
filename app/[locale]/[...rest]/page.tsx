import { notFound } from "next/navigation";

// Any URL no route claims renders the localized 404 (app/[locale]/not-found.tsx) inside the site chrome.
export default function CatchAll() {
  notFound();
}
