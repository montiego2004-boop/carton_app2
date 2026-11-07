// Builds ./www : compiled Tailwind CSS + local Vazirmatn font + index.html (fully offline at runtime)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });

fs.copyFileSync(path.join(root, 'src/index.html'), path.join(www, 'index.html'));

execSync(
  `npx tailwindcss -c tailwind.config.js -i src/input.css -o www/app.css --minify`,
  { cwd: root, stdio: 'inherit' }
);

// find the variable woff2 inside the vazirmatn npm package
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}
const files = walk(path.join(root, 'node_modules/vazirmatn'));
const font =
  files.find((f) => /Vazirmatn\[wght\]\.woff2$/.test(f)) ||
  files.find((f) => /Vazirmatn.*\.woff2$/.test(f));
if (!font) throw new Error('Vazirmatn woff2 not found in node_modules/vazirmatn');
fs.copyFileSync(font, path.join(www, 'fonts/Vazirmatn.woff2'));
console.log('Font:', path.relative(root, font));
fs.mkdirSync(path.join(www, 'vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/html2canvas/dist/html2canvas.min.js'), path.join(www, 'vendor/html2canvas.min.js'));
fs.copyFileSync(path.join(root, 'node_modules/jspdf/dist/jspdf.umd.min.js'), path.join(www, 'vendor/jspdf.umd.min.js'));
console.log('www ready');
