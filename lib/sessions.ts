/** One counselling session as the page shows it: the length always, the price only when Ramona has set one (0 or empty → no price, never "0 €"). */
export function sessionLabel(s: { minutes: number; priceEur: number | null }) {
  return { minutes: `${s.minutes} min`, price: s.priceEur ? `${s.priceEur} €` : null };
}
