import { type ReactNode } from 'react';
import { Platform, StyleSheet, Text, TextInput, View, type TextStyle } from 'react-native';

import { ACCOUNT_EMAIL_DESIGN } from '../constants/designSizes';
import { colors } from '../styles/colors';
import { fontFamilies } from '../styles/fonts';

type Props = {
  email: string;
  /** Optional slot below disclaimer (e.g. CTA on another layout). */
  footer?: ReactNode;
  /** When true, card stretches to parent width. */
  fullWidth?: boolean;
  maxWidth: number;
  onEmailChange: (value: string) => void;
  s: (n: number) => number;
};

/** iOS Safari auto-zooms inputs with computed font-size below ~16px — clamp on web only. */
const WEB_INPUT_MIN_FONT_PX = 16;
const WEB_INPUT_MIN_LINE_PX = 22;

const COPY = {
  body:
    'To access the game, please enter your email address. This is required to create your account and start playing.',
  disclaimer: 'Your email address will be linked to your account. You can unlink it at any time in your settings.',
  placeholder: 'EMAIL ADDRESS',
  title: 'Valorant Mobile Account',
} as const;

/**
 * Account email card — sizes from Figma `form` + `Frame 2043683105` (393×852 artboard).
 */
export function AccountEmailForm({ email, footer, fullWidth, maxWidth, onEmailChange, s }: Props) {
  const d = ACCOUNT_EMAIL_DESIGN;
  const cardWidth = fullWidth ? undefined : Math.min(s(d.cardMaxWidth), maxWidth);
  const gap = s(d.cardGap);
  const padV = s(d.cardPaddingV);
  const padH = s(d.cardPaddingH);
  const fieldPad = s(d.fieldPadding);
  const designFont = s(d.placeholderFont);
  const designLine = s(d.placeholderLineHeight);
  const inputFontSize =
    Platform.OS === 'web' ? Math.max(WEB_INPUT_MIN_FONT_PX, designFont) : designFont;
  const inputLineHeight =
    Platform.OS === 'web'
      ? Math.max(WEB_INPUT_MIN_LINE_PX, designLine, Math.ceil(inputFontSize * 1.22))
      : designLine;
  const fieldH = Math.max(s(d.fieldHeight), inputLineHeight + 2 * fieldPad);

  const inputStyle: TextStyle[] = [
    styles.input,
    {
      borderRadius: s(d.fieldBorderRadius),
      color: colors.formText,
      fontSize: inputFontSize,
      lineHeight: inputLineHeight,
      height: fieldH,
      paddingHorizontal: fieldPad,
      paddingVertical: fieldPad,
      textAlign: 'center',
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          alignSelf: 'stretch',
          borderRadius: fullWidth ? 0 : s(d.cardBorderRadius),
          gap,
          maxWidth: fullWidth ? maxWidth : undefined,
          minHeight: fullWidth ? undefined : s(d.cardMinHeight),
          paddingHorizontal: padH,
          paddingVertical: padV,
          width: fullWidth ? '100%' : cardWidth,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { fontSize: s(d.titleFont), lineHeight: s(d.titleLineHeight) },
        ]}
      >
        {COPY.title}
      </Text>
      <Text
        style={[
          styles.body,
          { fontSize: s(d.bodyFont), lineHeight: s(d.bodyLineHeight) },
        ]}
      >
        {COPY.body}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={onEmailChange}
        placeholder={COPY.placeholder}
        placeholderTextColor={colors.formPlaceholder}
        style={[
          ...inputStyle,
          Platform.OS === 'android' ? { includeFontPadding: false } : null,
          Platform.OS === 'web' ? { outlineWidth: 0 } : null,
        ]}
        textAlignVertical="center"
        value={email}
      />
      <Text
        style={[
          styles.disclaimer,
          { fontSize: s(d.disclaimerFont), lineHeight: s(d.disclaimerLineHeight) },
        ]}
      >
        {COPY.disclaimer}
      </Text>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.formText,
    fontFamily: fontFamilies.dinRegular,
    fontWeight: '400',
    textAlign: 'center',
  },
  card: {
    alignItems: 'stretch',
    backgroundColor: colors.formSurface,
  },
  disclaimer: {
    color: colors.formDisclaimer,
    fontFamily: fontFamilies.dinRegular,
    fontWeight: '400',
    textAlign: 'center',
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: colors.formFieldBg,
    fontFamily: fontFamilies.dinBold,
    fontWeight: '700',
  },
  title: {
    color: colors.formText,
    fontFamily: fontFamilies.dinBold,
    fontWeight: '700',
    textAlign: 'center',
  },
});
