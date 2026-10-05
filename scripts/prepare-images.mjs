/**
 * Image pipeline.
 *
 *   raw/  →  optimised JPEG in /public/images  +  src/data/image-meta.ts
 *
 * What it does, per image:
 *   1. resizes to the target width for its layout role (never upscales),
 *   2. writes a progressive, chroma-subsampled JPEG at quality 82,
 *   3. records the real intrinsic dimensions,
 *   4. generates a 24px-wide base64 blur placeholder for next/image.
 *
 * The generated `image-meta.ts` is what keeps Cumulative Layout Shift at zero:
 * every <Image> gets explicit width/height and a blur-up transition.
 *
 * Run: npm run prepare:images
 */

import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const rawDir = path.join(root, 'public', 'images', 'raw');
const outDir = path.join(root, 'public', 'images');
const metaFile = path.join(root, 'src', 'data', 'image-meta.ts');

/** Target width per layout role. Keyed by file name without extension. */
const TARGETS = {
  'hero-exterior': 2560,
  'night-facade': 2560,
  'interior-living': 1920,
  'aerial': 1920,
  'courtyard': 1920,
  // Exact social-share canvas — cropped, not merely resized.
  'og-cover': { width: 1200, height: 630 },
};

const DEFAULT_WIDTH = 1536;
const JPEG_QUALITY = 82;
const BLUR_WIDTH = 24;

async function main() {
  if (!existsSync(rawDir)) {
    console.error(`✗ raw image folder not found: ${rawDir}`);
    process.exit(1);
  }
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(rawDir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  if (files.length === 0) {
    console.error('✗ no source images found in', rawDir);
    process.exit(1);
  }

  const meta = {};
  const report = [];

  for (const file of files.sort()) {
    const name = path.basename(file, path.extname(file));
    const source = path.join(rawDir, file);
    const target = path.join(outDir, `${name}.jpg`);

    const input = sharp(source, { failOn: 'none' }).rotate();
    const sourceMeta = await input.metadata();

    const spec = TARGETS[name] ?? { width: DEFAULT_WIDTH };
    const wantsExact = typeof spec === 'object';

    let pipeline = sharp(source, { failOn: 'none' }).rotate();
    if (wantsExact) {
      pipeline = pipeline.resize({
        width: spec.width,
        height: spec.height,
        fit: 'cover',
        position: 'attention',
        withoutEnlargement: true,
      });
    } else {
      pipeline = pipeline.resize({
        width: spec,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const info = await pipeline
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toFile(target);

    const blurBuffer = await sharp(target)
      .resize({ width: BLUR_WIDTH })
      .jpeg({ quality: 40 })
      .toBuffer();

    meta[`/images/${name}.jpg`] = {
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`,
    };

    const sizeKb = Math.round((await stat(target)).size / 1024);
    report.push(
      `  ✓ ${name}.jpg  ${info.width}×${info.height}  ${sizeKb} KB  (source ${sourceMeta.width}×${sourceMeta.height})`,
    );
  }

  const banner = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run prepare:images\` after adding or replacing files in
 * /public/images. The script writes intrinsic dimensions and a base64 blur
 * placeholder for every registered image, which keeps CLS at zero and gives
 * every <Image> a real blur-up transition.
 *
 * Generated: ${new Date().toISOString()}
 * Images: ${Object.keys(meta).length}
 */

export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL?: string;
}

export const IMAGE_META: Record<string, ImageMeta> = ${JSON.stringify(meta, null, 2)};
`;

  await writeFile(metaFile, banner, 'utf8');

  console.log(`Processed ${Object.keys(meta).length} images:`);
  console.log(report.join('\n'));
  console.log(`\n✓ wrote ${path.relative(root, metaFile)}`);
}

main().catch((error) => {
  console.error('✗ image preparation failed:', error);
  process.exit(1);
});
