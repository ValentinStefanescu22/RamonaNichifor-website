import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { stampIllustration } from "../hooks/stampIllustration";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Imagine", plural: "Imagini" },
  admin: { group: "Conținut", description: "Toate imaginile site-ului. Textul alternativ e obligatoriu, în ambele limbi." },
  access: { read: () => true },
  // her illustrations: © stamp + 1800px cap before Payload makes the sizes
  hooks: { ...revalidateCollection(), beforeOperation: [stampIllustration] },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    focalPoint: true,
    adminThumbnail: "sm",
    // widths only: every size keeps the image's own ratio (artwork is never cropped)
    imageSizes: [
      { name: "sm", width: 384, withoutEnlargement: true },
      { name: "md", width: 768, withoutEnlargement: true },
      { name: "lg", width: 1280, withoutEnlargement: true },
    ],
  },
  fields: [
    { name: "alt", label: "Text alternativ", type: "text", localized: true, required: true },
    {
      name: "illustration",
      label: "Ilustrație a mea (copertă, pagină, pictură, carte de joc)",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Bifat: primește automat „© Ramona Nichifor” și e micșorată la mărimea de ecran. Nebifat: decor (fluturi decupați, poiana)." },
    },
  ],
};
