/** A same-site path to redirect to, or null: must start with one "/" (no "//host" or "/\host" open redirects). */
export const safePath = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") && !p.includes("\\") ? p : null);
