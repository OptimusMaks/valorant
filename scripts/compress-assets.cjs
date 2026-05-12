/**
 * One-shot asset pipeline: large PNG → WebP, small PNG → optimized PNG, video → H.264 + scale + CRF.
 * Run: `npm run compress:assets`
 *
 * Video: keeps `assets/video.source.mp4` as original; re-encode always reads from that file when present.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');

async function pngToWebp(rel, quality) {
  const input = path.join(assetsDir, rel);
  const outPath = input.replace(/\.png$/i, '.webp');
  if (!fs.existsSync(input)) {
    if (fs.existsSync(outPath)) {
      console.log('skip (already webp)', rel);
      return;
    }
    console.warn('skip missing', rel);
    return;
  }
  const before = fs.statSync(input).size;
  await sharp(input).webp({ quality, effort: 6 }).toFile(outPath);
  const after = fs.statSync(outPath).size;
  fs.unlinkSync(input);
  console.log(`WEBP ${rel}: ${(before / 1024).toFixed(1)} KB -> ${path.basename(outPath)} ${(after / 1024).toFixed(1)} KB`);
}

async function smallPngOptimize(rel) {
  const input = path.join(assetsDir, rel);
  if (!fs.existsSync(input)) return;
  const before = fs.statSync(input).size;
  const tmp = input + '.opt.tmp.png';
  await sharp(input).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(tmp);
  fs.renameSync(tmp, input);
  const after = fs.statSync(input).size;
  console.log(`PNG  ${rel}: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`);
}

function compressVideo() {
  const input = path.join(assetsDir, 'video.mp4');
  const backup = path.join(assetsDir, 'video.source.mp4');
  const outTmp = path.join(assetsDir, 'video.tmp.mp4');

  if (!fs.existsSync(input)) {
    console.warn('skip: no video.mp4');
    return;
  }
  if (!ffmpegPath) {
    console.warn('skip video: ffmpeg-static unavailable');
    return;
  }

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(input, backup);
    console.log('Backup: video.source.mp4 (original upload)');
  }

  const src = backup;
  const before = fs.statSync(src).size;
  const args = [
    '-y',
    '-i',
    src,
    '-vf',
    "scale='min(960,iw)':-2",
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '26',
    '-preset',
    'medium',
    '-movflags',
    '+faststart',
    '-an',
    outTmp,
  ];
  const r = spawnSync(ffmpegPath, args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) {
    console.error('ffmpeg stderr:', r.stderr);
    process.exit(1);
  }
  fs.renameSync(outTmp, input);
  const after = fs.statSync(input).size;
  console.log(`MP4  video.mp4: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB (from video.source.mp4)`);
}

async function main() {
  await pngToWebp('images/bg.png', 82);
  await pngToWebp('images/phone-border.png', 85);
  const smallPngs = [
    'images/Front-Camera.png',
    'images/globus.png',
    'images/icon-1.png',
    'images/icon-2.png',
    'images/icon-3.png',
    'images/logo-riot.png',
    'images/logo-valorant.png',
  ];
  for (const p of smallPngs) {
    await smallPngOptimize(p);
  }
  compressVideo();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
