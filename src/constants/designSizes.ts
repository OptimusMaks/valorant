/**
 * Intrinsic pixel size of `assets/images/phone-border.png` (do not assume Figma 177×356).
 */
export const PHONE_BORDER_PNG = {
  heightPx: 675,
  widthPx: 1179,
} as const;

/**
 * Phone mockup — **393×852 artboard px** (same space as `DESIGN_WIDTH` / `DESIGN_HEIGHT` in `useLayoutScale`).
 * In `LandingPhoneVideo`: `s(px)` then `k = min(1, maxWidth / scaledPhoneW)` so video + notch scale together
 * when the content column is narrower than the scaled phone width.
 */
export const PHONE_FRAME_DESIGN = {
  height: 212,
  width: 392,
} as const;

/** Video — px relative to phone top-left (DevTools on 393-wide frame). */
export const PHONE_VIDEO_DESIGN = {
  borderRadius: 17,
  height: 154,
  left: 19,
  top: 28,
  width: 344,
} as const;

/** Front camera / Dynamic Island — px relative to phone top-left. */
export const PHONE_NOTCH_DESIGN = {
  height: 51,
  left: 22,
  top: 78,
  width: 11,
} as const;

/**
 * Account email card — Figma **form** (393 artboard): 361×290, padding 24×16, gap 24, field 42px.
 * On **web**, `TextInput` uses at least **16px** font (see `AccountEmailForm`) so iOS Safari does not force zoom.
 */
export const ACCOUNT_EMAIL_DESIGN = {
  bodyFont: 14,
  bodyLineHeight: 20,
  cardBorderRadius: 6,
  cardGap: 24,
  cardMaxWidth: 361,
  cardMinHeight: 290,
  cardPaddingH: 16,
  cardPaddingV: 24,
  disclaimerFont: 10,
  disclaimerLineHeight: 14,
  fieldBorderRadius: 4,
  fieldHeight: 42,
  fieldPadding: 10,
  placeholderFont: 13,
  placeholderLineHeight: 16,
  titleFont: 22,
  titleLineHeight: 26,
} as const;

export const DESIGN_PX = {
  /**
   * Below phone mockup — ref valrnt.mobgam.info `.main__image:not(:last-child) { margin-bottom: 1.875rem }`
   * (1.875 × 16px root ≈ 30 design px; scaled with `s()`).
   */
  phoneStageMarginBottom: 30,
  /** Account step — space below «VALORANT MOBILE» before the card (393×852 artboard px). */
  accountTitleToFormGap: 100,
  /** Outer CTA bottom edge → bottom of main stage (artboard px); `paddingBottom` uses `max(insets.bottom, s(this))`. */
  ctaBottomGap: 100,
  /** Success screen (Figma 1751) — vertical rhythm below «VALORANT MOBILE». */
  successCongratsToLeadGap: 10,
  successLeadToPhoneGap: 20,
  successPhoneToBodyGap: 28,
  successTitleToCongratsGap: 17,
  chevron: { h: 7, w: 12 },
  globe: { h: 32, w: 32 },
  /**
   * Hero — Figma: title «VALORANT MOBILE» 25px; span subtitle 15px; shared line-height 28px; max-width 361.
   */
  heroBlock: { lineHeight: 28, maxWidth: 361, subtitleSize: 15, titleSize: 25 },
  iconRow: { gap: 4, tileH: 40 },
  iconTileIcon: { h: 32, w: 32 },
  menuButton: { h: 48, lineH: 3, lineW: 20, radius: 16, w: 48 },
  /** Extra gap between globe and menu — Figma ~16–20px */
  menuGap: 16,
  riotLogo: { h: 26, w: 92 },
  valorantMark: { h: 58, w: 58 },
} as const;

/** @deprecated Prefer {@link PHONE_FRAME_DESIGN.width} — kept for imports expecting `PHONE_LAYOUT`. */
export const PHONE_LAYOUT = {
  width: PHONE_FRAME_DESIGN.width,
} as const;
