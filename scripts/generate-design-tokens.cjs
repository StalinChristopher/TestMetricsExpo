'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const inputPath = path.join(projectRoot, 'tokens', 'design.tokens');
const outputDir = path.join(projectRoot, 'src', 'designSystem', 'generated');

const fileContent = fs.readFileSync(inputPath, 'utf-8');

function extractThemeBlock(theme) {
  const needle = `Theme ${theme}`;
  const index = fileContent.indexOf(needle);
  if (index === -1) throw new Error(`${theme} theme not found`);

  const braceStart = fileContent.indexOf('{', index);
  let depth = 0;

  for (let i = braceStart; i < fileContent.length; i++) {
    if (fileContent[i] === '{') depth++;
    if (fileContent[i] === '}') {
      depth--;
      if (depth === 0) return fileContent.substring(braceStart + 1, i);
    }
  }
  throw new Error('Unclosed brace');
}

function parseSection(block, name) {
  const sectionRegex = new RegExp(`${name}\\s*:\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const match = sectionRegex.exec(block);
  if (!match) return {};

  const entries = {};
  const tokenRegex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;

  let m;
  while ((m = tokenRegex.exec(match[1]))) {
    entries[m[1]] = m[2];
  }
  return entries;
}

function remToDp(value) {
  return parseFloat(value.replace('rem', '').replace(',', '.')) * 16;
}

function normalizeKey(raw, group) {
  let cleaned = raw.toLowerCase().replace(/,/g, '_').replace(/\./g, '_').replace(/-/g, '_');

  if (cleaned.match(/^\d+xl$/)) {
    cleaned = `xl_${cleaned.replace('xl', '')}`;
  } else if (/^\d/.test(cleaned)) {
    cleaned = `value_${cleaned}`;
  }

  return group === 'spacing' ? `spacing_${cleaned}` : cleaned;
}

function resolveColor(raw, colors, visited = new Set()) {
  if (raw == null || raw === '') throw new Error('Missing color value');
  if (raw.startsWith('#')) return raw;
  if (raw.startsWith('var(')) {
    const ref = raw.replace('var(--', '').replace(')', '');
    if (visited.has(ref)) throw new Error('Circular color reference');
    return resolveColor(colors[ref], colors, new Set([...visited, ref]));
  }
  throw new Error(`Unsupported color: ${raw}`);
}

const dark = {
  color: parseSection(extractThemeBlock('Dark'), 'color'),
  number: parseSection(extractThemeBlock('Dark'), 'number'),
  string: parseSection(extractThemeBlock('Dark'), 'string'),
};
const light = { color: parseSection(extractThemeBlock('Light'), 'color') };

fs.mkdirSync(outputDir, { recursive: true });

const colorKeys = [...new Set([...Object.keys(dark.color), ...Object.keys(light.color)])];
const colorFile = `export const ColorToken = {
${colorKeys
  .map(k => {
    const darkRaw = dark.color[k] ?? light.color[k];
    const lightRaw = light.color[k] ?? dark.color[k];
    return `  '${k}': (isDark: boolean) => isDark ? '${resolveColor(darkRaw, dark.color)}' : '${resolveColor(lightRaw, light.color)}'`;
  })
  .join(',\n')}
} as const;
export type ColorTokenKey = keyof typeof ColorToken;`;
fs.writeFileSync(path.join(outputDir, 'colors.ts'), colorFile);

const semanticPath = path.join(projectRoot, 'tokens', 'semantic-colors.json');
const TRANSPARENT_SENTINEL = '__transparent__';
if (fs.existsSync(semanticPath)) {
  const semanticMap = JSON.parse(fs.readFileSync(semanticPath, 'utf-8'));
  const semanticErrors = [];
  for (const [semanticKey, tokenKey] of Object.entries(semanticMap)) {
    if (semanticKey.startsWith('_')) continue;
    if (tokenKey === TRANSPARENT_SENTINEL) continue;
    if (!colorKeys.includes(tokenKey)) {
      semanticErrors.push(
        `semantic-colors.json: "${semanticKey}" → "${tokenKey}" is not in ColorToken`,
      );
    }
  }
  if (semanticErrors.length > 0) {
    console.error('Semantic color mapping validation failed:\n' + semanticErrors.join('\n'));
    process.exit(1);
  }
  console.log('Semantic color mappings validated.');
}

const numberGroups = [
  { prefix: 'border-radius-', fileName: 'borderRadius', tokenName: 'BorderRadiusToken' },
  { prefix: 'border-width-', fileName: 'borderWidth', tokenName: 'BorderWidthToken' },
  { prefix: 'font-size-', fileName: 'fontSize', tokenName: 'FontSizeToken' },
  { prefix: 'letter-spacing-', fileName: 'letterSpacing', tokenName: 'LetterSpacingToken' },
  { prefix: 'line-height-', fileName: 'lineHeight', tokenName: 'LineHeightToken' },
  { prefix: 'size-button-height-', fileName: 'buttonHeight', tokenName: 'ButtonHeightToken' },
  { prefix: 'size-icon-', fileName: 'iconSize', tokenName: 'IconSizeToken' },
  { prefix: 'spacing-', fileName: 'spacing', tokenName: 'SpacingToken' },
];

numberGroups.forEach(({ prefix, fileName, tokenName }) => {
  const isSpacing = prefix === 'spacing-';
  const tokens = Object.entries(dark.number).filter(([k]) => k.startsWith(prefix));

  const out = `export const ${tokenName} = {
${tokens
  .map(([k, v]) => {
    return `  '${normalizeKey(k.replace(prefix, ''), isSpacing ? 'spacing' : undefined)}': ${remToDp(v)}`;
  })
  .join(',\n')}
} as const;
export type ${tokenName}Key = keyof typeof ${tokenName};`;
  fs.writeFileSync(path.join(outputDir, `${fileName}.ts`), out);
});

const fontMap = { 'font-family-': 'FontFamilyToken', 'font-weight-': 'FontWeightToken' };
Object.entries(fontMap).forEach(([prefix, tokenName]) => {
  const tokens = Object.entries(dark.string).filter(([k]) => k.startsWith(prefix));
  const isWeight = prefix === 'font-weight-';

  const out = `export const ${tokenName} = {
${tokens
  .map(([k, v]) => {
    const key = k.replace(prefix, '');
    const val = isWeight ? (v === 'Bold' ? '700' : v === 'Regular' ? '400' : '500') : `"${v}"`;
    return `  '${key}': ${val}`;
  })
  .join(',\n')}
} as const;
export type ${tokenName}Key = keyof typeof ${tokenName};`;
  fs.writeFileSync(path.join(outputDir, isWeight ? 'fontWeight.ts' : 'fontFamily.ts'), out);
});

console.log('Done! Generated 11 type-safe design token files.');
