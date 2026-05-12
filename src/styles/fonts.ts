/** Loaded via expo-font keys → use same string as `fontFamily`. */
export const fontFamilies = {
  valorant: 'Valorant',
  /** DIN Pro (files under `assets/fonts/DIN Pro/`). Alias kept as dinNext for UI body copy. */
  dinRegular: 'DINPro-Regular',
  dinMedium: 'DINPro-Medium',
  dinBold: 'DINPro-Bold',
  dinNext: 'DINPro-Regular',
  system: 'Arial',
};

export const customFonts = {
  [fontFamilies.valorant]: require('../../assets/fonts/Valorant.ttf'),
  [fontFamilies.dinRegular]: require('../../assets/fonts/DIN Pro/dinpro.otf'),
  [fontFamilies.dinMedium]: require('../../assets/fonts/DIN Pro/dinpro_medium.otf'),
  [fontFamilies.dinBold]: require('../../assets/fonts/DIN Pro/dinpro_bold.otf'),
};
