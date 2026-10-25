// The admin's own marks: her butterfly and name, in the site's plum ink. Kept light on purpose:
// the admin is a tool, so it stays Payload's UI with her identity on the login screen and in the nav.
const ink = "#34224a";

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/apple-icon.png" alt="" width={56} height={56} style={{ borderRadius: 14 }} />
      <span style={{ fontFamily: "Georgia, 'Iowan Old Style', serif", fontSize: 30, color: ink, letterSpacing: "-0.02em" }}>
        Ramona <em style={{ color: "#7a5fb0" }}>Nichifor</em>
      </span>
    </div>
  );
}

export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icon.png" alt="Ramona Nichifor" width={28} height={28} style={{ borderRadius: 6 }} />;
}
