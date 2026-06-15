export type Profile = "his" | "hers";

export const PROFILES: Profile[] = ["his", "hers"];

export function getStorageKey(base: string, profile: Profile) {
  return `${base}_${profile}`;
}

export function getActiveProfile(): Profile {
  if (typeof window === "undefined") return "his";
  return (localStorage.getItem("wardrobe_active_profile") as Profile) ?? "his";
}

export function setActiveProfile(profile: Profile) {
  localStorage.setItem("wardrobe_active_profile", profile);
}
