export type HSL = { h: number; s: number; l: number };

export function hexToHSL(hex: string): HSL {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex({ h, s, l }: HSL): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function getRandomHex(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export type GradientData = {
  id: string;
  colors: [string, string];
  name: string;
};

export type CategoryData = {
  categoryName: string;
  gradients: GradientData[];
};

// Cute Japanese naming
const adjectives = ['ぷにぷに', 'エレクトリック', 'ねむたい', 'きらきら', 'ふわふわ', 'とろける', 'サイバー', 'まぼろしの', 'ピュアな'];
const nouns = ['メロン', 'ミント', 'ピーチ', 'ソーダ', 'レモン', 'ベリー', 'グレープ', 'ミルク', 'キャンディ'];

function generateCuteName(h: number): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  let noun = nouns[0];
  if (h >= 0 && h < 30) noun = 'ピーチ';
  else if (h >= 30 && h < 60) noun = 'レモン';
  else if (h >= 60 && h < 150) noun = 'メロン';
  else if (h >= 150 && h < 200) noun = 'ミント';
  else if (h >= 200 && h < 250) noun = 'ソーダ';
  else if (h >= 250 && h < 300) noun = 'グレープ';
  else if (h >= 300 && h < 340) noun = 'ベリー';
  else noun = 'キャンディ';

  return `${adj}・${noun}`;
}

export function generatePalettes(baseHex: string): CategoryData[] {
  const baseHSL = hexToHSL(baseHex);

  // Vivid (鮮やかポップ): Keep saturation high (>70%). Shift Hue slightly.
  const vividGradients: GradientData[] = Array.from({ length: 3 }).map((_, i) => {
    const h1 = (baseHSL.h + i * 20) % 360;
    const h2 = (baseHSL.h + 40 + i * 20) % 360;
    const s = Math.max(80, baseHSL.s);
    const l1 = Math.max(40, Math.min(60, baseHSL.l));
    const l2 = Math.max(50, Math.min(70, baseHSL.l + 10));

    return {
      id: `vivid-${i}`,
      colors: [hslToHex({ h: h1, s, l: l1 }), hslToHex({ h: h2, s, l: l2 })],
      name: generateCuteName(h1)
    };
  });

  // Vivid Cool (鮮やかクール): Force Hue into cool spectrum (160 - 260). Keep sat high.
  const vividCoolGradients: GradientData[] = Array.from({ length: 3 }).map((_, i) => {
    const h1 = 160 + (Math.random() * 100); // 160-260
    const h2 = (h1 + 30 + Math.random() * 40) % 360; // Keep within cool ideally, but let it shift
    const s = 90;
    const l1 = 45;
    const l2 = 65;

    return {
      id: `cool-${i}`,
      colors: [hslToHex({ h: h1, s, l: l1 }), hslToHex({ h: h2, s, l: l2 })],
      name: generateCuteName(h1)
    };
  });

  // Earth Color (アースカラー): Drop sat to 20-40%. Lightness mid-tones ~50%.
  const earthGradients: GradientData[] = Array.from({ length: 3 }).map((_, i) => {
    const h1 = (baseHSL.h + i * 15) % 360;
    const h2 = (baseHSL.h + 30 + i * 15) % 360;
    const s1 = 20 + Math.random() * 20; // 20-40
    const s2 = 20 + Math.random() * 20;
    const l1 = 45 + Math.random() * 10; // ~45-55
    const l2 = 45 + Math.random() * 10;

    return {
      id: `earth-${i}`,
      colors: [hslToHex({ h: h1, s: s1, l: l1 }), hslToHex({ h: h2, s: s2, l: l2 })],
      name: generateCuteName(h1)
    };
  });

  return [
    { categoryName: '鮮やかポップ', gradients: vividGradients },
    { categoryName: '鮮やかクール', gradients: vividCoolGradients },
    { categoryName: 'アースカラー', gradients: earthGradients },
  ];
}
