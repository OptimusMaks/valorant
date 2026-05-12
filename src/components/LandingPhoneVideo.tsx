import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import {
  DESIGN_PX,
  PHONE_FRAME_DESIGN,
  PHONE_NOTCH_DESIGN,
  PHONE_VIDEO_DESIGN,
} from '../constants/designSizes';

/** Metro-resolved; RN-web's `Image` has no `.resolveAssetSource` — use the library helper. */
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource').default as (
  source: number,
) => { height?: number; uri: string; width?: number } | undefined;

const VIDEO_SOURCE = require('../../assets/video.mp4');
const PHONE_BORDER_ASSET = require('../../assets/images/phone-border.webp');
const FRONT_CAMERA_ASSET = require('../../assets/images/Front-Camera.png');

type Props = {
  maxWidth: number;
  s: (n: number) => number;
};

type PlaybackProps = {
  playsInline: boolean;
  radius: number;
  vidH: number;
  vidLeft: number;
  vidTop: number;
  vidW: number;
};

/** Isolated so `useVideoPlayer` mounts after the first paint (lighter initial open). */
function PhoneVideoPlayback({ playsInline, radius, vidH, vidLeft, vidTop, vidW }: PlaybackProps) {
  const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <VideoView
      contentFit="cover"
      nativeControls={false}
      onFirstFrameRender={() => player.play()}
      player={player}
      playsInline={playsInline}
      style={[
        styles.video,
        {
          backgroundColor: 'transparent',
          borderRadius: radius,
          height: vidH,
          left: vidLeft,
          top: vidTop,
          width: vidW,
        },
      ]}
    />
  );
}

/**
 * Phone frame + video + front camera — all sizes from **393×852** artboard (`PHONE_*_DESIGN`),
 * scaled with `s()` and uniformly shrunk when `maxWidth` is smaller than the scaled phone width.
 *
 * Video playback mounts one frame later so the shell (frame + notch) paints before decoding MP4.
 */
export function LandingPhoneVideo({ maxWidth, s }: Props) {
  const [showPlayback, setShowPlayback] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShowPlayback(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const designPhoneW = s(PHONE_FRAME_DESIGN.width);
  const k = Math.min(1, maxWidth / designPhoneW);

  const phoneW = Math.round(designPhoneW * k);
  const phoneH = Math.round(s(PHONE_FRAME_DESIGN.height) * k);

  const vidW = Math.round(s(PHONE_VIDEO_DESIGN.width) * k);
  const vidH = Math.round(s(PHONE_VIDEO_DESIGN.height) * k);
  const vidLeft = Math.round(s(PHONE_VIDEO_DESIGN.left) * k);
  const vidTop = Math.round(s(PHONE_VIDEO_DESIGN.top) * k);
  const radius = Math.max(4, Math.round(s(PHONE_VIDEO_DESIGN.borderRadius) * k));

  const notchW = Math.round(s(PHONE_NOTCH_DESIGN.width) * k);
  const notchH = Math.round(s(PHONE_NOTCH_DESIGN.height) * k);
  const notchLeft = Math.round(s(PHONE_NOTCH_DESIGN.left) * k);
  const notchTop = Math.round(s(PHONE_NOTCH_DESIGN.top) * k);

  const borderUri = resolveAssetSource(PHONE_BORDER_ASSET)?.uri ?? '';

  const phoneStageShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({ filter: 'drop-shadow(0 11px 11px rgba(0, 0, 0, 0.25))' } as ViewStyle)
      : {
          elevation: 14,
          shadowColor: '#000000',
          shadowOffset: { height: 11, width: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 11,
        };

  const frameWebCss: ViewStyle | null =
    Platform.OS === 'web' && borderUri !== ''
      ? ({
          backgroundImage: `url(${JSON.stringify(borderUri)})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        } as ViewStyle)
      : null;

  return (
    <View
      style={[
        styles.phoneStage,
        phoneStageShadow,
        { marginBottom: s(DESIGN_PX.phoneStageMarginBottom) },
      ]}
    >
      <View style={[styles.phoneRoot, { height: phoneH, width: phoneW }]}>
        {Platform.OS === 'web' ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.frame, { height: phoneH, width: phoneW }, frameWebCss]}
          />
        ) : (
          <Image
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            resizeMode="stretch"
            source={PHONE_BORDER_ASSET}
            style={[styles.frame, { height: phoneH, width: phoneW }]}
          />
        )}
        {showPlayback ? (
          <PhoneVideoPlayback
            playsInline={Platform.OS === 'web'}
            radius={radius}
            vidH={vidH}
            vidLeft={vidLeft}
            vidTop={vidTop}
            vidW={vidW}
          />
        ) : (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[
              styles.videoPlaceholder,
              {
                borderRadius: radius,
                height: vidH,
                left: vidLeft,
                top: vidTop,
                width: vidW,
              },
            ]}
          />
        )}
        <Image
          accessibilityElementsHidden
          accessibilityIgnoresInvertColors
          importantForAccessibility="no-hide-descendants"
          resizeMode="contain"
          source={FRONT_CAMERA_ASSET}
          style={[
            styles.frontCamera,
            {
              height: notchH,
              left: notchLeft,
              top: notchTop,
              width: notchW,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  frontCamera: {
    position: 'absolute',
    zIndex: 3,
  },
  phoneRoot: {
    overflow: 'visible',
    position: 'relative',
  },
  phoneStage: {
    alignSelf: 'center',
    overflow: 'visible',
  },
  video: {
    position: 'absolute',
    zIndex: 2,
  },
  videoPlaceholder: {
    backgroundColor: '#070707',
    position: 'absolute',
    zIndex: 2,
  },
});
