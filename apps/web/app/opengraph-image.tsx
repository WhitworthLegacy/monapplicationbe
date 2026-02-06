import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "monapplication.be - Votre Secrétaire Digitale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          padding: "60px",
        }}
      >
        {/* Logo grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            width: "90px",
            marginBottom: "40px",
          }}
        >
          <div style={{ width: "24px", height: "24px", backgroundColor: "#0f172a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#1e3a8a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#b8860b", borderRadius: "4px" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#1e3a8a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#b8860b", borderRadius: "4px" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#0f172a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#b8860b", borderRadius: "4px" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#0f172a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ width: "24px", height: "24px", backgroundColor: "#1e3a8a", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }} />
        </div>

        {/* Brand name */}
        <div style={{ display: "flex", marginBottom: "24px" }}>
          <span style={{ fontSize: "48px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            mon
          </span>
          <span style={{ fontSize: "48px", color: "white", fontWeight: 700 }}>
            application
          </span>
          <span style={{ fontSize: "48px", color: "#b8860b", fontWeight: 700 }}>
            .be
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          Votre Secrétaire Digitale
        </div>

        {/* Features pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Booking", "Devis", "CRM", "Site web", "SEO"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "999px",
                  padding: "8px 20px",
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
