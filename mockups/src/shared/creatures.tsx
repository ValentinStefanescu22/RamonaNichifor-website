import type { SVGProps } from "react";
import type { UniverseId } from "./content";

// Line-drawn stand-ins for the three unreleased characters, drawn in the same
// 1.6 stroke so they read as one hand. Ramona's own illustrations replace them.
type Props = SVGProps<SVGSVGElement> & { size?: number | string };

function Frame({ size = 64, children, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Ladybird = (p: Props) => (
  <Frame {...p}>
    <path d="M28 14c-2-4-5-6-8-6M36 14c2-4 5-6 8-6" />
    <circle cx="19.5" cy="7.8" r="1.3" fill="currentColor" />
    <circle cx="44.5" cy="7.8" r="1.3" fill="currentColor" />
    <path d="M15 31l-6-3M14 38H7.5M15.5 45l-6 3.5M49 31l6-3M50 38h6.5M48.5 45l6 3.5" />
    <ellipse cx="32" cy="19" rx="8" ry="6" />
    <circle cx="32" cy="37" r="18" />
    <path d="M32 24.5V55" />
    <circle cx="24" cy="32" r="2.8" fill="currentColor" stroke="none" />
    <circle cx="40" cy="32" r="2.8" fill="currentColor" stroke="none" />
    <circle cx="21.5" cy="42.5" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="42.5" cy="42.5" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="27.5" cy="50" r="2" fill="currentColor" stroke="none" />
    <circle cx="36.5" cy="50" r="2" fill="currentColor" stroke="none" />
  </Frame>
);

const boot = (x: number, y: number) =>
  `M${x - 2.2} ${y - 4}h4.4v3.6h3.1a1.7 1.7 0 0 1 0 3.4h-7.5Z`;

export const Mosquito = (p: Props) => (
  <Frame {...p}>
    <path d="M30 18c-2-6 3-12 11-12-.6 7-4.6 11-11 12Z" />
    <path d="M33 19c1-5 7-9 14-7-2 6-7 8.6-14 7Z" />
    <circle cx="23.5" cy="21.5" r="4.4" />
    <path d="M19.6 23.6 9 31" />
    <ellipse cx="31.5" cy="25.5" rx="6.2" ry="4.6" />
    <ellipse cx="45" cy="20.5" rx="9.5" ry="3.3" transform="rotate(-18 45 20.5)" />
    <path d="M27.5 29 21 39.5l-1.5 9M31.5 30.2v10.3l-1 8M35.4 29l6.6 9.8 1.4 9.7" />
    <path d={boot(19.3, 52.5)} fill="currentColor" />
    <path d={boot(30.3, 52.5)} fill="currentColor" />
    <path d={boot(43.6, 52.5)} fill="currentColor" />
  </Frame>
);

export const Fly = (p: Props) => (
  <Frame {...p}>
    <ellipse cx="20.5" cy="31" rx="10.5" ry="5.6" transform="rotate(-32 20.5 31)" />
    <ellipse cx="43.5" cy="31" rx="10.5" ry="5.6" transform="rotate(32 43.5 31)" />
    <path d="M26 45l-6.5 6M38 45l6.5 6M25.5 39.5l-8 1.5M38.5 39.5l8 1.5" />
    <ellipse cx="32" cy="40" rx="7.2" ry="11.5" />
    <path d="M25.6 37.5h12.8M25.6 43.5h12.8" />
    <circle cx="32" cy="24.5" r="6.4" />
    <circle cx="28.3" cy="22.6" r="3.1" fill="currentColor" stroke="none" />
    <circle cx="35.7" cy="22.6" r="3.1" fill="currentColor" stroke="none" />
  </Frame>
);

export function Creature({ id, ...rest }: Props & { id: Exclude<UniverseId, "fluture"> }) {
  if (id === "buburuza") return <Ladybird {...rest} />;
  if (id === "tantar") return <Mosquito {...rest} />;
  return <Fly {...rest} />;
}
