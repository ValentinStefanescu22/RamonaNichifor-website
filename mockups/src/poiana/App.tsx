import { useCallback, useRef, useState } from "react";
import { ConceptStrip } from "../shared/ConceptStrip";
import { Flight } from "./Flight";
import { Hero, PaintDefs } from "./Hero";
import { FloatingBar, MenuSheet, TopBar } from "./Nav";
import { About, Art, Book, Counselling, Footer, Paths, Universes } from "./Sections";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [landed, setLanded] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const perchRef = useRef<HTMLDivElement>(null);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <PaintDefs />
      <ConceptStrip concept="poiana" />
      <FloatingBar menuOpen={menuOpen} onMenu={toggleMenu} />
      <MenuSheet open={menuOpen} onClose={closeMenu} />
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-40">
          <TopBar menuOpen={menuOpen} onMenu={toggleMenu} />
        </div>
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
      </div>
      <Footer />
    </>
  );
}
