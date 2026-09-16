import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../public");

await Promise.all([
  ...["monero", "web3"].map((name) =>
    sharp(path.join(root, "images", `${name}.png`))
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(path.join(root, "images", `${name}.webp`)),
  ),
  ...["behance", "linkedin"].map((name) =>
    sharp(path.join(root, "icons", `${name}.png`))
      .resize(96, 96, { fit: "inside" })
      .webp({ quality: 90 })
      .toFile(path.join(root, "icons", `${name}.webp`)),
  ),
  // The SVG includes Figma filter overflow; crop to the original 1920px frame.
  sharp(path.join(root, "images/hero-background.svg"))
    .extract({ left: 1431, top: 1149, width: 1920, height: 2354 })
    .webp({ quality: 90 })
    .toFile(path.join(root, "images/hero-background.webp")),
]);

console.log("Optimized portfolio assets are ready.");
