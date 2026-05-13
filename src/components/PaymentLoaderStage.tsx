import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';
import { fontFamilies } from '../styles/fonts';

/** Figma 1753: track 321×12, fill 228×8 */
const TRACK_W = 321;
const TRACK_H = 12;
const FILL_H = 8;
const FILL_W = 228;
const PAD_X = 2;

type Props = {
  bottomInset: number;
  progress: Animated.Value;
  s: (n: number) => number;
};

/**
 * Full-stage loader: transparent root so the parent `ImageBackground` + dim (same as funnel) stay visible.
 */
export function PaymentLoaderStage({ bottomInset, progress, s }: Props) {
  const fillWidth = progress.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 1],
    outputRange: [s(8), s(FILL_W)],
  });

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      accessibilityState={{ busy: true }}
      style={[
        styles.root,
        {
          paddingBottom: bottomInset + s(120),
          paddingHorizontal: s(16),
          paddingTop: s(24),
        },
      ]}
    >
      <View style={styles.block} pointerEvents="none">
        <View
          style={[
            styles.track,
            {
              height: s(TRACK_H),
              paddingHorizontal: s(PAD_X),
              width: s(TRACK_W),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                height: s(FILL_H),
                width: fillWidth,
              },
            ]}
          />
        </View>
        <Text style={[styles.label, { fontSize: s(24), lineHeight: s(26), marginTop: s(12) }]}>LOADING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
  },
  fill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF4755',
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.valorant,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  root: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  track: {
    backgroundColor: '#282828',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
