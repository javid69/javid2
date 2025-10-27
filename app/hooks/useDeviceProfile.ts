"use client";

import { useEffect, useState } from "react";

type Profile = {
  isMobile: boolean;
  lowPower: boolean;
  mode: "enhanced" | "fallback";
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

const DEFAULT_PROFILE: Profile = {
  isMobile: false,
  lowPower: false,
  mode: "enhanced",
};

export function useDeviceProfile(): Profile {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: {
        saveData?: boolean;
      };
    };

    const ua = nav.userAgent || "";
    const isMobile = /Android|Mobi|iPhone|iPad|iPod/i.test(ua);
    const hardwareConcurrency = nav.hardwareConcurrency ?? undefined;
    const deviceMemory = nav.deviceMemory ?? undefined;
    const saveData = Boolean(nav.connection?.saveData);

    let prefersReducedMotion = false;
    if (typeof window !== "undefined" && "matchMedia" in window) {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const lowPower =
      saveData ||
      prefersReducedMotion ||
      (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4) ||
      (typeof deviceMemory === "number" && deviceMemory <= 4) ||
      isMobile;

    setProfile({
      isMobile,
      lowPower,
      mode: lowPower ? "fallback" : "enhanced",
      hardwareConcurrency,
      deviceMemory,
    });
  }, []);

  return profile;
}
