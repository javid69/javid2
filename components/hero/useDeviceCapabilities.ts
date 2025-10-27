"use client";

import { useEffect, useMemo, useState } from "react";

type DeviceCapabilities = {
  allowMotion: boolean;
  showFallback: boolean;
  allowPostprocessing: boolean;
  isMobile: boolean;
};

const initialCapabilities: DeviceCapabilities = {
  allowMotion: false,
  showFallback: true,
  allowPostprocessing: false,
  isMobile: false,
};

const MOBILE_USER_AGENT_REGEX = /android|iphone|ipad|ipod|windows phone|mobile/i;

function evaluateCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return initialCapabilities;
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = motionQuery.matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.innerWidth <= 768;
  const ua = window.navigator.userAgent || "";
  const isMobile = coarsePointer || narrowViewport || MOBILE_USER_AGENT_REGEX.test(ua);

  const navAny = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
      downlink?: number;
    };
  };

  const saveData = Boolean(navAny.connection?.saveData);
  const deviceMemory = navAny.deviceMemory ?? 4;
  const downlink = navAny.connection?.downlink ?? 5;
  const hardwareConcurrency = window.navigator.hardwareConcurrency ?? 8;

  const lowBandwidth = downlink > 0 && downlink < 1.5;
  const lowCompute = deviceMemory <= 2 || hardwareConcurrency <= 4;
  const prefersLowPower = saveData || lowBandwidth || lowCompute;

  const allowMotion = !prefersReducedMotion && !prefersLowPower;
  const showFallback = !allowMotion;
  const allowPostprocessing = allowMotion && !isMobile && !prefersLowPower;

  return {
    allowMotion,
    showFallback,
    allowPostprocessing,
    isMobile,
  };
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState(initialCapabilities);

  useEffect(() => {
    setCapabilities(evaluateCapabilities());

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setCapabilities(evaluateCapabilities());
    };

    motionQuery.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);

    const connection = (navigator as Navigator & { connection?: any }).connection;
    if (connection && typeof connection.addEventListener === "function") {
      connection.addEventListener("change", onChange);
    }

    return () => {
      motionQuery.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
      if (connection && typeof connection.removeEventListener === "function") {
        connection.removeEventListener("change", onChange);
      }
    };
  }, []);

  return useMemo(() => capabilities, [capabilities]);
}
