"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during SSR. Scroll choreography must run before paint
 * on the client, so we swap in useEffect on the server and useLayoutEffect in
 * the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
