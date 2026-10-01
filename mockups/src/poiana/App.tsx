import { useRef, useState } from "react";
import { SiteShell } from "../site/Layout";
import { Flight } from "./Flight";
import { Hero } from "./Hero";
import { About, Art, Book, Counselling, Paths, Universes } from "./Sections";

export default function App() {
  const [landed, setLanded] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const perchRef = useRef<HTMLDivElement>(null);

  return (
    <SiteShell current="home">
      <main>
        <div ref={zoneRef} className="relative overflow-x-clip">
          <Hero startRef={startRef} />
          <Paths />
          <Universes perchRef={perchRef} landed={landed} />
          <Flight zoneRef={zoneRef} startRef={startRef} endRef={perchRef} onLanded={setLanded} />
        </div>
        <Book />
        <About />
        <Art />
        <Counselling />
      </main>
    </SiteShell>
  );
}
