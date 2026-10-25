/** Her name in her own hand: the stroke is revealed left to right as it scrolls in (CSS `.sign`; written already without motion). */
export function Signature({ name }: { name: string }) {
  return <p className="sign font-script mt-10 inline-block -rotate-3 pr-4 text-[clamp(3.2rem,11vw,4.4rem)] leading-none text-violet">{name}</p>;
}
