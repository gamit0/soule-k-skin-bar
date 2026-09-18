import { mockShots } from "@/mock-data/shots";
import { Shot } from "@/types";

export async function getActiveShots(): Promise<Shot[]> {
  return mockShots.filter((s) => s.active);
}

export async function getShotBySlug(slug: string): Promise<Shot | null> {
  return mockShots.find((s) => (s.slug === slug || s.id === slug) && s.active) ?? null;
}
