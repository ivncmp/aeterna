export function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function sleepBarColor(hours: number): string {
  if (hours < 6) return "#F87171";
  if (hours < 7) return "#F8BF24";
  return "#8ADE88";
}

export const MOOD_EMOJIS = [
  "",
  "\u{1F61E}",
  "\u{1F615}",
  "\u{1F610}",
  "\u{1F60A}",
  "\u{1F604}",
];
