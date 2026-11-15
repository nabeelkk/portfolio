import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Muhammed Nabeel KK — Full-Stack Developer & Founder of AISYNX';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#0A0A0B',
          backgroundImage:
            'radial-gradient(circle at 85% 20%, rgba(198,244,50,0.22), transparent 45%), radial-gradient(circle at 10% 110%, rgba(124,92,255,0.22), transparent 45%)',
          color: '#EDEDEC',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, letterSpacing: 4, color: '#8A8A8F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 999,
                border: '2px solid #C6F432',
                color: '#C6F432',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              NK
            </div>
            NABEELKK.STORE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: '#3DDC84' }} />
            AVAILABLE FOR WORK
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95 }}>MUHAMMED</div>
          <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95, color: '#C6F432' }}>NABEEL KK</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>Full-Stack Developer · Founder of AISYNX</div>
            <div style={{ color: '#8A8A8F', fontSize: 24 }}>ERP systems · SaaS · Mobile apps · Real-time apps</div>
          </div>
          <div style={{ color: '#8A8A8F', fontSize: 22, letterSpacing: 3 }}>KERALA, INDIA</div>
        </div>
      </div>
    ),
    size,
  );
}
