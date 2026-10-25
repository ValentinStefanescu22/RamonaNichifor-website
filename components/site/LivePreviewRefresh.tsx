"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Inside the admin's Live Preview: re-render the page from the latest draft each time Ramona saves. Draft mode only. */
export function LivePreviewRefresh() {
  const router = useRouter();
  // the admin is served by this same app, so its origin is ours
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  if (!origin) return null;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />;
}
