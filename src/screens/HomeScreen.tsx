import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountEmailForm } from '../components/AccountEmailForm';
import { LandingPhoneVideo } from '../components/LandingPhoneVideo';
import { DESIGN_PX } from '../constants/designSizes';
import { useLayoutScale } from '../hooks/useLayoutScale';
import { colors } from '../styles/colors';
import { fontFamilies } from '../styles/fonts';

const assets = {
  background: require('../../assets/images/bg.webp'),
  globe: require('../../assets/images/globus.png'),
  icons: [
    require('../../assets/images/icon-1.png'),
    require('../../assets/images/icon-2.png'),
    require('../../assets/images/icon-3.png'),
  ],
  riotLogo: require('../../assets/images/logo-riot.png'),
  valorantLogo: require('../../assets/images/logo-valorant.png'),
};

const BODY_LINES = [
  '5v5 tactical action, agents, maps — the real Valorant, now on mobile.',
  'Join us now — early access won’t last long!',
  'Real players only. $1 card hold, auto-released. Not a charge.',
];

const SUCCESS_LEAD =
  'Your early access to VALORANT Mobile has been unlocked.' as const;

const SUCCESS_BODY_LINES = [
  'Enjoy your favorite tactical shooter now in a mobile format — fast, competitive, and ready to play anywhere.',
  'Your access is reserved. No additional steps are required.',
  'Tap the button below to launch the game and start playing.',
] as const;

type HomeStep = 'landing' | 'account' | 'success';

export function HomeScreen() {
  const { s, layoutWidth } = useLayoutScale();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const horizontalPad = s(16);
  const contentMax = layoutWidth - horizontalPad * 2;
  const ctaOuterW = Math.min(s(345), contentMax);
  const ctaInnerW = Math.max(0, ctaOuterW - s(10));

  const scrollBottomPad =
    Math.max(insets.bottom, s(DESIGN_PX.ctaBottomGap)) +
    (Platform.OS === 'web' &&
    typeof navigator !== 'undefined' &&
    /iP(ad|hone|od)/i.test(navigator.userAgent)
      ? s(40)
      : 0);

  const stageScrollContentStyle: ViewStyle[] = [
    styles.scrollContent,
    { paddingBottom: scrollBottomPad, paddingHorizontal: horizontalPad },
  ];

  const [step, setStep] = useState<HomeStep>('landing');
  const [accountEmail, setAccountEmail] = useState('');

  /** Web (esp. iOS Safari): blur + scroll reset when leaving the email step so stuck zoom/scroll does not carry over. */
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
    window.scrollTo(0, 0);
  }, [step]);

  const ctaPressScale = useRef(new Animated.Value(1)).current;

  const ctaPressIn = () => {
    Animated.spring(ctaPressScale, {
      friction: 6,
      tension: 220,
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const ctaPressOut = () => {
    Animated.spring(ctaPressScale, {
      friction: 5,
      tension: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const bgMinHeightStyle: ViewStyle =
    Platform.OS === 'web'
      ? ({ minHeight: '100lvh' } as unknown as ViewStyle)
      : { minHeight: windowHeight };

  /** Web: inner `Image` gets explicit w/h from flattened style — tie min height to dynamic viewport so tall phones (e.g. 14 Pro Max) don’t show a black band. */
  /** Web: anchor bg art so bottom gradient/shadow is not cropped when `cover` trims vertically. */
  const bgImageStyle: ImageStyle | undefined =
    Platform.OS === 'web'
      ? ({
          minHeight: '100dvh',
          objectPosition: 'center bottom',
          width: '100%',
        } as unknown as ImageStyle)
      : undefined;

  return (
    <ImageBackground
      imageStyle={bgImageStyle}
      resizeMode="cover"
      source={assets.background}
      style={[styles.bgRoot, bgMinHeightStyle]}
    >
      <View style={styles.dimOverlay} />

      <View style={[styles.column, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.headerBar,
            {
              minHeight: Math.max(s(DESIGN_PX.valorantMark.h), s(DESIGN_PX.menuButton.h)) + s(20),
              paddingHorizontal: horizontalPad,
              paddingVertical: s(10),
            },
          ]}
        >
          <View style={[styles.headerLeft, { flex: 1 }]}>
            <Image
              resizeMode="contain"
              source={assets.riotLogo}
              style={{ height: s(DESIGN_PX.riotLogo.h), width: s(DESIGN_PX.riotLogo.w) }}
            />
            <Text style={[styles.chevron, { fontSize: s(8), marginLeft: s(6), width: s(DESIGN_PX.chevron.w) }]}>
              ▼
            </Text>
          </View>

          <View style={styles.headerCenter}>
            <Image
              resizeMode="contain"
              source={assets.valorantLogo}
              style={{ height: s(DESIGN_PX.valorantMark.h), width: s(DESIGN_PX.valorantMark.w) }}
            />
          </View>

          <View style={[styles.headerRight, { flex: 1, gap: s(DESIGN_PX.menuGap) }]}>
            <Pressable accessibilityRole="button" hitSlop={s(8)} onPress={() => undefined}>
              <Image
                resizeMode="contain"
                source={assets.globe}
                style={{ height: s(DESIGN_PX.globe.h), width: s(DESIGN_PX.globe.w) }}
              />
            </Pressable>
            <Pressable accessibilityRole="button" hitSlop={s(8)} onPress={() => undefined}>
              <View
                style={[
                  styles.menuSquare,
                  {
                    borderRadius: s(DESIGN_PX.menuButton.radius),
                    height: s(DESIGN_PX.menuButton.h),
                    width: s(DESIGN_PX.menuButton.w),
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuLine,
                    {
                      height: Math.max(2, s(DESIGN_PX.menuButton.lineH)),
                      marginBottom: s(3),
                      width: s(DESIGN_PX.menuButton.lineW),
                    },
                  ]}
                />
                <View
                  style={[
                    styles.menuLine,
                    {
                      height: Math.max(2, s(DESIGN_PX.menuButton.lineH)),
                      marginBottom: s(3),
                      width: s(DESIGN_PX.menuButton.lineW),
                    },
                  ]}
                />
                <View
                  style={[
                    styles.menuLine,
                    {
                      height: Math.max(2, s(DESIGN_PX.menuButton.lineH)),
                      width: s(DESIGN_PX.menuButton.lineW),
                    },
                  ]}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.mainStage}>
          {step === 'landing' ? (
            <View style={styles.mainStageInner}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={stageScrollContentStyle}
              >
                  <View style={[styles.heroBlock, { marginTop: s(24), maxWidth: s(DESIGN_PX.heroBlock.maxWidth), width: contentMax, zIndex: 2 }]}>
                    <Text style={styles.heroRoot}>
                      <Text
                        style={[
                          styles.heroTitleLine,
                          {
                            fontSize: s(DESIGN_PX.heroBlock.titleSize),
                            lineHeight: s(DESIGN_PX.heroBlock.lineHeight),
                          },
                        ]}
                      >
                        VALORANT MOBILE
                      </Text>
                      {'\n'}
                      <Text
                        style={[
                          styles.heroSubtitleLine,
                          {
                            fontSize: s(DESIGN_PX.heroBlock.subtitleSize),
                            lineHeight: s(DESIGN_PX.heroBlock.lineHeight),
                          },
                        ]}
                      >
                        A 5V5 TACTICAL SHOOTER FEATURING AGENTS WITH UNIQUE ABILITIES
                      </Text>
                    </Text>
                  </View>

                  <View style={{ marginTop: s(20), zIndex: 1 }}>
                    <LandingPhoneVideo maxWidth={contentMax} s={s} />
                  </View>

                  <View style={[styles.iconRow, { gap: s(4), marginTop: s(28), maxWidth: s(315), width: contentMax }]}>
                    {assets.icons.map((src, index) => (
                      <View key={index} style={[styles.iconTile, { height: s(40) }]}>
                        <Image resizeMode="contain" source={src} style={{ height: s(32), width: s(32) }} />
                      </View>
                    ))}
                  </View>

                  <View style={[styles.copyStack, { gap: s(16), marginTop: s(28), maxWidth: s(315), width: contentMax }]}>
                    {BODY_LINES.map((line) => (
                      <Text key={line} style={[styles.bodyLine, { fontSize: s(15), lineHeight: s(18) }]}>
                        {line}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.ctaPushSpacer} />

                  <Animated.View style={{ alignSelf: 'center', transform: [{ scale: ctaPressScale }] }}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setStep('account')}
                      onPressIn={ctaPressIn}
                      onPressOut={ctaPressOut}
                      style={[
                        styles.ctaOuter,
                        {
                          height: s(62),
                          marginTop: s(32),
                          width: ctaOuterW,
                        },
                      ]}
                    >
                      <View style={[styles.ctaInner, { height: s(52), width: ctaInnerW }]}>
                        <Text style={[styles.ctaLabel, { fontSize: s(24), lineHeight: s(26) }]}>PLAY NOW</Text>
                      </View>
                    </Pressable>
                  </Animated.View>
              </ScrollView>
            </View>
          ) : step === 'account' ? (
            <View style={styles.mainStageInner}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={stageScrollContentStyle}
              >
                  <Text
                    style={[
                      styles.accountHeroTitle,
                      {
                        fontSize: s(25),
                        lineHeight: s(28),
                        marginTop: s(24),
                        maxWidth: Math.min(s(361), contentMax),
                      },
                    ]}
                  >
                    VALORANT MOBILE
                  </Text>

                  {/* Explicit gap: RN Web can collapse margin between Text and the next View. */}
                  <View
                    style={{
                      alignSelf: 'stretch',
                      flexShrink: 0,
                      height: s(DESIGN_PX.accountTitleToFormGap),
                    }}
                  />

                  <View style={styles.accountFormSlot}>
                    <AccountEmailForm
                      email={accountEmail}
                      maxWidth={contentMax}
                      onEmailChange={setAccountEmail}
                      s={s}
                    />
                  </View>

                  <View style={styles.ctaPushSpacer} />

                  <Animated.View style={{ alignSelf: 'center', transform: [{ scale: ctaPressScale }] }}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={accountEmail.trim().length === 0}
                      onPress={() => {
                        if (accountEmail.trim().length > 0) setStep('success');
                      }}
                      onPressIn={ctaPressIn}
                      onPressOut={ctaPressOut}
                      style={[
                        styles.ctaOuter,
                        {
                          height: s(62),
                          marginTop: s(32),
                          opacity: accountEmail.trim().length === 0 ? 0.45 : 1,
                          width: ctaOuterW,
                        },
                      ]}
                    >
                      <View style={[styles.ctaInner, { height: s(52), width: ctaInnerW }]}>
                        <Text style={[styles.ctaLabel, { fontSize: s(24), lineHeight: s(26) }]}>CONTINUE</Text>
                      </View>
                    </Pressable>
                  </Animated.View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.mainStageInner}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={stageScrollContentStyle}
              >
                  <Text
                    style={[
                      styles.accountHeroTitle,
                      {
                        fontSize: s(25),
                        lineHeight: s(28),
                        marginTop: s(24),
                        maxWidth: Math.min(s(361), contentMax),
                      },
                    ]}
                  >
                    VALORANT MOBILE
                  </Text>

                  <Text
                    style={[
                      styles.successCongrats,
                      {
                        fontSize: s(22),
                        lineHeight: s(26),
                        marginTop: s(DESIGN_PX.successTitleToCongratsGap),
                        maxWidth: Math.min(s(393), contentMax),
                      },
                    ]}
                  >
                    🎉 CONGRATULATIONS!
                  </Text>

                  <Text
                    style={[
                      styles.successLead,
                      {
                        fontSize: s(18),
                        lineHeight: s(22),
                        marginTop: s(DESIGN_PX.successCongratsToLeadGap),
                        maxWidth: Math.min(s(364), contentMax),
                      },
                    ]}
                  >
                    {SUCCESS_LEAD}
                  </Text>

                  <View style={{ marginTop: s(DESIGN_PX.successLeadToPhoneGap), zIndex: 1 }}>
                    <LandingPhoneVideo maxWidth={contentMax} s={s} />
                  </View>

                  <View style={[styles.successCopyStack, { gap: s(12), marginTop: s(DESIGN_PX.successPhoneToBodyGap), maxWidth: Math.min(s(364), contentMax) }]}>
                    {SUCCESS_BODY_LINES.map((line) => (
                      <Text key={line} style={[styles.successBodyLine, { fontSize: s(14), lineHeight: s(17) }]}>
                        {line}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.ctaPushSpacer} />

                  <Animated.View style={{ alignSelf: 'center', transform: [{ scale: ctaPressScale }] }}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => undefined}
                      onPressIn={ctaPressIn}
                      onPressOut={ctaPressOut}
                      style={[
                        styles.ctaOuter,
                        {
                          height: s(62),
                          marginTop: s(32),
                          width: ctaOuterW,
                        },
                      ]}
                    >
                      <View style={[styles.ctaInner, { height: s(52), width: ctaInnerW }]}>
                        <Text style={[styles.ctaLabel, { fontSize: s(24), lineHeight: s(26) }]}>LAUNCH GAME</Text>
                      </View>
                    </Pressable>
                  </Animated.View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgRoot: {
    backgroundColor: colors.background,
    flex: 1,
    width: '100%',
  },
  bodyLine: {
    color: colors.text,
    fontFamily: fontFamilies.dinBold,
    textAlign: 'left',
  },
  chevron: {
    color: colors.triangleMuted,
  },
  column: {
    flex: 1,
  },
  copyStack: {
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  /** Fills space above CTA so the button sits on `paddingBottom` (see `DESIGN_PX.ctaBottomGap`). */
  ctaPushSpacer: {
    alignSelf: 'stretch',
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
    minWidth: 0,
  },
  ctaInner: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    justifyContent: 'center',
  },
  ctaLabel: {
    color: colors.buttonLabel,
    fontFamily: fontFamilies.valorant,
    textAlign: 'center',
  },
  ctaOuter: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.ctaFrame,
    borderWidth: 1,
    justifyContent: 'center',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
    pointerEvents: 'none',
  },
  headerBar: {
    alignItems: 'center',
    backgroundColor: colors.headerBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroBlock: {
    alignSelf: 'center',
  },
  heroRoot: {
    color: colors.text,
    fontFamily: fontFamilies.valorant,
    fontWeight: '400',
    textAlign: 'center',
  },
  heroSubtitleLine: {
    color: colors.text,
    fontFamily: fontFamilies.valorant,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  heroTitleLine: {
    color: colors.text,
    fontFamily: fontFamilies.valorant,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  iconRow: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: colors.iconTile,
    flex: 1,
    justifyContent: 'center',
  },
  mainStage: {
    flex: 1,
    minHeight: 0,
  },
  mainStageInner: {
    flex: 1,
  },
  menuLine: {
    backgroundColor: colors.menuIcon,
    borderRadius: 1,
    height: 3,
  },
  menuSquare: {
    alignItems: 'center',
    backgroundColor: colors.menuButtonBg,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  successBodyLine: {
    color: colors.text,
    fontFamily: fontFamilies.dinRegular,
    textAlign: 'center',
  },
  successCongrats: {
    alignSelf: 'center',
    color: colors.text,
    fontFamily: fontFamilies.dinBold,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  successCopyStack: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  successLead: {
    alignSelf: 'center',
    color: colors.text,
    fontFamily: fontFamilies.dinRegular,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  accountFormSlot: {
    alignItems: 'center',
  },
  accountHeroTitle: {
    alignSelf: 'center',
    color: colors.text,
    fontFamily: fontFamilies.valorant,
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});