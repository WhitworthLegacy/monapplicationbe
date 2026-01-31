import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '32px',
        }}
      >
        {/* Row 1 */}
        <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#1e3a8a', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#b8860b', borderRadius: '6px' }} />
        {/* Row 2 */}
        <div style={{ width: '40px', height: '40px', backgroundColor: '#1e3a8a', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#b8860b', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '6px' }} />
        {/* Row 3 */}
        <div style={{ width: '40px', height: '40px', backgroundColor: '#b8860b', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '6px' }} />
        <div style={{ width: '40px', height: '40px', backgroundColor: '#1e3a8a', borderRadius: '6px' }} />
      </div>
    ),
    { ...size }
  );
}
