"use client";

import { useEffect, useState } from "react";
import { type Profile, getActiveProfile, setActiveProfile } from "./profiles";

export function useProfile(): [Profile, (p: Profile) => void] {
  const [profile, setProfile] = useState<Profile>(getActiveProfile);

  useEffect(() => {

    function onSwitch(e: Event) {
      setProfile((e as CustomEvent<Profile>).detail);
    }
    window.addEventListener("wardrobe:profile", onSwitch);
    return () => window.removeEventListener("wardrobe:profile", onSwitch);
  }, []);

  function switchProfile(p: Profile) {
    setActiveProfile(p);
    setProfile(p);
    window.dispatchEvent(new CustomEvent("wardrobe:profile", { detail: p }));
  }

  return [profile, switchProfile];
}
