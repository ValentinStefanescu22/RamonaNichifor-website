"use client";
import { useState, type ReactNode } from "react";
import { AgeTabs, type AgeId, type AgeTab } from "./AgeTabs";

/**
 * The shelf: the age choice is client state over lists the server has already rendered, so every book is in the HTML and the
 * choice only shows one list (the others are `hidden`). A list fades up when it is chosen; the first one does not animate.
 */
export function Shelf({ ages, panels, label }: { ages: AgeTab[]; panels: Record<AgeId, ReactNode>; label: string }) {
  const [age, setAge] = useState<AgeId>("copii");
  const [chosen, setChosen] = useState(false);
  return (
    <>
      <AgeTabs
        ages={ages}
        value={age}
        label={label}
        onChange={(id) => {
          setAge(id);
          setChosen(true);
        }}
      />
      {ages.map((a) => (
        <div key={a.id} data-shelf={a.id} role="group" aria-label={a.label} hidden={a.id !== age} className={`mt-8 ${chosen ? "tab-in" : ""}`}>
          {panels[a.id]}
        </div>
      ))}
    </>
  );
}
