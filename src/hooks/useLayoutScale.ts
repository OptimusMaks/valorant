import { useEffect, useMemo, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

/**
 * Figma reference frame — scaling uses both dimensions (see `useLayoutScale`).
 */
export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

type Options = {
  /** Cap content width on large desktop web (does not affect height ratio). */
  maxLayoutWidth?: number;
};

/**
 * Uniform scale so the 393×852 artboard fits the viewport like CSS `object-fit: contain`:
 * `scale = min(layoutWidth / DESIGN_WIDTH, windowHeight / DESIGN_HEIGHT)`.
 *
 * **Web:** `window.innerHeight` often shrinks when the virtual keyboard opens. Feeding that into
 * `scale` makes every `s()` jump. We keep a **peak** layout height (`max` seen) for the Y ratio so
 * typography/spacing stay stable while the keyboard is open (scroll handles visibility).
 *
 * All `s(px)` values from the layout are multiplied by this single scale — spacing, fonts, PNG boxes.
 */
export function useLayoutScale(options?: Options) {
  const { height, width } = useWindowDimensions();
  const maxLayoutWidth = options?.maxLayoutWidth ?? 520;

  const layoutWidth = Math.min(width, maxLayoutWidth);

  const [peakLayoutHeight, setPeakLayoutHeight] = useState(height);

  useEffect(() => {
    setPeakLayoutHeight((prev) => Math.max(prev, height));
  }, [height]);

  const scale = useMemo(() => {
    const sx = layoutWidth / DESIGN_WIDTH;
    const h = Platform.OS === 'web' ? peakLayoutHeight : height;
    const sy = h / DESIGN_HEIGHT;
    return Math.min(sx, sy);
  }, [height, layoutWidth, peakLayoutHeight]);

  const s = useMemo(
    () =>
      (value: number, optionsRound?: { round?: boolean }) =>
        optionsRound?.round === false ? value * scale : Math.round(value * scale),
    [scale],
  );

  return {
    layoutWidth,
    s,
    scale,
    windowHeight: height,
    windowWidth: width,
  };
}
