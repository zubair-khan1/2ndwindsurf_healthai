import type React from "react"

interface HealthTrackingVisualProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

/**
 * Health Tracking Visual - Timeline of health reports
 * Represents "Your health, tracked"
 */
const HealthTrackingVisual: React.FC<HealthTrackingVisualProps> = ({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}) => {
  const reports = [
    { date: "Jan 2024", status: "normal", color: "#10B981" },
    { date: "Mar 2024", status: "normal", color: "#10B981" },
    { date: "Jun 2024", status: "attention", color: "#F59E0B" },
    { date: "Sep 2024", status: "normal", color: "#10B981" },
  ]

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div style={{ position: "relative", width: "300px", height: "180px" }}>
        {/* Timeline line */}
        <div
          style={{
            position: "absolute",
            left: "30px",
            top: "40px",
            width: "240px",
            height: "2px",
            background: "rgba(55,50,47,0.15)",
          }}
        />

        {/* Report points */}
        {reports.map((report, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${30 + (index * 80)}px`,
              top: "20px",
            }}
          >
            {/* Point */}
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: report.color,
                border: "3px solid #ffffff",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                top: "20px",
              }}
            />
            {/* Label */}
            <div
              style={{
                position: "absolute",
                top: "45px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "9px",
                color: "#605A57",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {report.date}
            </div>
            {/* Report card */}
            <div
              style={{
                position: "absolute",
                top: "65px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "40px",
                background: "#ffffff",
                borderRadius: "4px",
                boxShadow: "0px 1px 3px rgba(55,50,47,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke={report.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14 2 14 8 20 8"
                  stroke={report.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: "7px", color: "#605A57" }}>Report</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthTrackingVisual
