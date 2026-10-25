// The contact form's rules, shared by the server (lib/contact.ts) and the form (components/contact/ContactForm.tsx).
// No dependencies, so the form can import it without pulling zod into the browser.
export const SUBJECTS = ["carte", "arta", "consiliere", "comunitate", "altceva"] as const;
export type Subject = (typeof SUBJECTS)[number];
/** An address with a domain, and none of the characters that could make the reply-to a list */
export const EMAIL = /^[^\s@,;<>"()\\]+@[^\s@,;<>"()\\]+\.[^\s@,;<>"()\\]{2,}$/;
