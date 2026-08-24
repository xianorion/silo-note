const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');

const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'public', 'img', '1024x1024.png');
const outputDir = path.join(root, 'build', 'icons');
const icnsPath = path.join(outputDir, 'icon.icns');
const icoPath = path.join(outputDir, 'icon.ico');

if (!fs.existsSync(inputPath)) {
  console.error(`Icon source not found: ${inputPath}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });
const inputBuffer = fs.readFileSync(inputPath);

const icnsBuffer = png2icons.createICNS(inputBuffer, png2icons.BILINEAR, 0);
if (!icnsBuffer) {
  console.error('Failed to generate ICNS from PNG input.');
  process.exit(1);
}
fs.writeFileSync(icnsPath, icnsBuffer);
console.log(`Generated ${path.relative(root, icnsPath)}`);

const icoBuffer = png2icons.createICO(inputBuffer, png2icons.BILINEAR, 0, true, true);
if (!icoBuffer) {
  console.error('Failed to generate ICO from PNG input.');
  process.exit(1);
}
fs.writeFileSync(icoPath, icoBuffer);
console.log(`Generated ${path.relative(root, icoPath)}`);
