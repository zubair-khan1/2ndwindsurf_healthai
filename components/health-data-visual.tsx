import type React from "react"

interface HealthDataVisualProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

/**
 * Health Data Visual - Clean, organized health report cards
 * Represents "Clear. Simple. Understandable."
 */
const HealthDataVisual: React.FC<HealthDataVisualProps> = ({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}) => {
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
      <div style={{ position: "relative", width: "280px", height: "200px" }}>
        {/* Card 1 - Blood Test */}
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "20px",
            width: "120px",
            height: "140px",
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(55,50,47,0.12)",
            padding: "12px",
            transform: "rotate(-3deg)",
          }}
        >
          <div style={{ fontSize: "10px", color: "#605A57", marginBottom: "8px" }}>Blood Test</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>Hemoglobin</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>WBC Count</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>Glucose</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>Platelets</div>
            </div>
          </div>
        </div>

        {/* Card 2 - Lipid Profile */}
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            width: "120px",
            height: "140px",
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(55,50,47,0.12)",
            padding: "12px",
            transform: "rotate(2deg)",
          }}
        >
          <div style={{ fontSize: "10px", color: "#605A57", marginBottom: "8px" }}>Lipid Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>Total Cholesterol</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>LDL</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>HDL</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10B981" }} />
              <div style={{ fontSize: "8px", color: "#37322F" }}>Triglycerides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthDataVisual
