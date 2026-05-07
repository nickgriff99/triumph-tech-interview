/**
 * Writes a .webp next to each .png / .jpg / .jpeg under assets/images.
 * The site serves .webp only; keep lossless masters elsewhere and copy
 * rasters here before re-running. Usage: npm install && npm run webp
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "assets", "images");

const files = await readdir(imagesDir);
const rasters = files.filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const file of rasters) {
  const input = path.join(imagesDir, file);
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const output = path.join(imagesDir, `${base}.webp`);
  await sharp(input).webp({ quality: 82, effort: 6 }).toFile(output);
  console.log(`${file} -> ${path.basename(output)}`);
}

console.log(`Done: ${rasters.length} file(s).`);
