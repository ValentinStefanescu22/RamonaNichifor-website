/** Off-screen field for bots only: hidden from people, screen readers and the tab order (not display:none). */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
