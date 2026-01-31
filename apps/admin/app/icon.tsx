import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          padding: '4px',
          backgroundColor: 'white',
          borderRadius: '6px',
        }}
      >
        {/* Row 1 */}
        <div style={{ width: '8px', height: '8px', backgroundColor: '#0f172a', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#1e3a8a', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#b8860b', borderRadius: '1px' }} />
        {/* Row 2 */}
        <div style={{ width: '8px', height: '8px', backgroundColor: '#1e3a8a', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#b8860b', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#0f172a', borderRadius: '1px' }} />
        {/* Row 3 */}
        <div style={{ width: '8px', height: '8px', backgroundColor: '#b8860b', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#0f172a', borderRadius: '1px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: '#1e3a8a', borderRadius: '1px' }} />
      </div>
    ),
    { ...size }
  );
}
