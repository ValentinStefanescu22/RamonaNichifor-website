import type { SVGProps } from "react";

// One hand-authored icon family: 24px grid, 1.5 stroke, round joins.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />
  </Icon>
);

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Icon>
);

export const ArrowDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.5V19M6.5 13.5 12 19l5.5-5.5" />
  </Icon>
);

export const Instagram = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.1" cy="6.9" r="0.6" fill="currentColor" />
  </Icon>
);

export const Facebook = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15.5 4.5h-2A3.5 3.5 0 0 0 10 8v12.5M7 11.5h7.5" />
  </Icon>
);

export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </Icon>
);

export const WhatsApp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.3 19.7 5.5 16A8 8 0 1 1 8.2 18.5Z" />
    <path d="M9.4 8.9c.2 2.6 2.6 5.1 5.3 5.5l1-1.4-1.9-1-1 .8c-.9-.4-1.7-1.2-2-2.1l.8-1-1-1.9Z" />
  </Icon>
);

export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
    <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
  </Icon>
);

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const Video = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="6.5" width="12" height="11" rx="2.5" />
    <path d="m15.5 10.5 5-3v9l-5-3" />
  </Icon>
);

export const Armchair = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
    <path d="M4 12a2 2 0 0 1 4 0v2h8v-2a2 2 0 0 1 4 0v4.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5Z" />
    <path d="M6.5 18v1.5M17.5 18v1.5" />
  </Icon>
);

export const Brush = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.5 4.5c-3.5 1.6-7.4 5.3-9 8.3l1.2 1.2c3-1.6 6.7-5.5 7.8-9.5Z" />
    <path d="M10.3 13.1c-2.2-.3-4 1.4-4 3.6 0 1.2-.8 2.1-1.8 2.3 3.3 1.3 7.7-.3 7.2-4.5" />
  </Icon>
);

export const OpenBook = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 7.5C10.2 5.9 7.6 5.2 4 5.5v12c3.6-.3 6.2.4 8 2 1.8-1.6 4.4-2.3 8-2v-12c-3.6-.3-6.2.4-8 2Z" />
    <path d="M12 7.5v12" />
  </Icon>
);

export const Sprout = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20v-8" />
    <path d="M12 12c0-3.5-2.4-6-6.5-6 0 3.6 2.5 6 6.5 6Z" />
    <path d="M12 14.5c0-3 2.2-5.5 6.5-5.5 0 3.3-2.4 5.5-6.5 5.5Z" />
  </Icon>
);
