import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const fontsDir = path.join(process.cwd(), 'node_modules', '@fontsource', 'onest', 'files');
const readFont = (file: string) => fs.readFileSync(path.join(fontsDir, file));

/** Satori (the OG renderer) needs font files; Onest covers both Latin and Cyrillic. */
function loadFonts() {
  return (['cyrillic', 'latin'] as const).map((subset) => ({
    name: 'Onest',
    data: readFont(`onest-${subset}-800-normal.woff`),
    weight: 800 as const,
    style: 'normal' as const,
  }));
}

/** Branded social card. `tag` is a small label such as "Concept" or the section name. */
export function renderOg({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle?: string;
  tag?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: 'linear-gradient(135deg, #0a0a0b 0%, #141416 60%, #1d2a05 100%)',
        color: '#f5f5f2',
        fontFamily: 'Onest',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: '#c8ff2e',
            color: '#0a0a0b',
            fontSize: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          NW
        </div>
        <div style={{ fontSize: 30, display: 'flex' }}>{siteConfig.name}</div>
        {tag && (
          <div
            style={{
              marginLeft: 'auto',
              padding: '8px 20px',
              borderRadius: 999,
              background: '#c8ff2e',
              color: '#0a0a0b',
              fontSize: 24,
              display: 'flex',
            }}
          >
            {tag}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -2, display: 'flex' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 34, color: '#a1a1aa', display: 'flex', maxWidth: 980 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>,
    { ...ogSize, fonts: loadFonts() },
  );
}
