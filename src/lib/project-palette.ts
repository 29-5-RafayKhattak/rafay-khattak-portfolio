import type { CSSProperties } from "react";
import type { ProjectPalette } from "@/data/projects";

export const paletteVars = (palette?: ProjectPalette) =>
  palette
    ? ({
        "--p-accent": palette.accent,
        "--p-accent-deep": palette.accentDeep,
        "--p-muted": palette.muted,
        "--p-surface": palette.surface,
        "--p-surface-soft": palette.surfaceSoft ?? palette.surface,
        "--p-surface-alt": palette.surfaceAlt ?? palette.surface,
        "--p-warm": palette.warm,
        "--p-cream": palette.cream,
      } as CSSProperties)
    : undefined;

