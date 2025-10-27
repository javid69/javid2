'use client';

import { gsap as coreGsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export const ensureScrollTrigger = () => {
  if (registered || typeof window === "undefined") {
    return;
  }

  coreGsap.registerPlugin(ScrollTrigger);
  registered = true;
};

export const gsap = coreGsap;
export { ScrollTrigger };
