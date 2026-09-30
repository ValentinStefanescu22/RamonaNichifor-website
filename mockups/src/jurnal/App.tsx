import { useCallback, useState } from "react";
import { ConceptStrip } from "../shared/ConceptStrip";
import { ContentsSheet, Header, IndexTabs, Ribbon, useCurrentChapter } from "./Chrome";
import { ArtPage, BooksPage, CounsellingPage, FirstPage, InkDefs, LastPage, UniversesPage } from "./Pages";

export default function App() {
  const [open, setOpen] = useState(false);
  const current = useCurrentChapter();
  const openContents = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="grain relative overflow-x-clip">
      <InkDefs />
      <ConceptStrip concept="jurnal" />
      <Header onContents={openContents} />
      <Ribbon current={current} onOpen={openContents} />
      <IndexTabs current={current} />
      <ContentsSheet open={open} onClose={close} />
      <main>
        <FirstPage />
        <BooksPage />
        <UniversesPage />
        <ArtPage />
        <CounsellingPage />
      </main>
      <LastPage />
    </div>
  );
}
