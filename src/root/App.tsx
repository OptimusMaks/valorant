import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Platform, StatusBar, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { colors } from '../styles/colors';
import { customFonts } from '../styles/fonts';

/** Mobile Chrome resizes the layout viewport with the keyboard unless this hint is set — content then jumps. */
function useWebViewportKeyboardBehavior() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const el = document.querySelector('meta[name="viewport"]');
    if (!el || !(el instanceof HTMLMetaElement)) return;
    const prev = el.getAttribute('content') ?? '';
    const next =
      'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, interactive-widget=overlays-content';
    el.setAttribute('content', next);
    return () => {
      if (prev) el.setAttribute('content', prev);
    };
  }, []);
}

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);
  const { height } = useWindowDimensions();

  useWebViewportKeyboardBehavior();

  /**
   * Native: wait for custom fonts (otherwise titles fall back badly).
   * Web: paint the shell immediately — waiting on all .otf/.ttf blocks first paint and feels “staggered”.
   * Fonts still load via `useFonts`; UI re-renders when ready.
   */
  if (Platform.OS !== 'web' && !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ backgroundColor: colors.headerBg, flex: 1, width: '100%' }} />
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View
        style={[
          { flex: 1, width: '100%' },
          Platform.OS === 'web'
            ? ({ minHeight: '100dvh' } as unknown as ViewStyle)
            : { minHeight: height },
        ]}
      >
        <HomeScreen />
      </View>
      <StatusBar barStyle="light-content" />
    </SafeAreaProvider>
  );
}
