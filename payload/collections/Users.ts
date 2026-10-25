import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Utilizator", plural: "Utilizatori" },
  admin: { useAsTitle: "email", group: "Administrare" },
  // against password guessing: 5 tries, then 15 minutes locked
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  fields: [{ name: "name", label: "Nume", type: "text" }],
};
