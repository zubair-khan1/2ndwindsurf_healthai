import type React from "react"

interface TestResultsVisualProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

/**
 * Test Results Visual - Health metrics with indicators
 * Represents "Results that make sense"
 */
const TestResultsVisual: React.FC<TestResultsVisualProps> = ({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}) => {
  const results = [
    { name: "Hemoglobin", value: "14.2", unit: "g/dL", status: "normal", color: "#10B981", percentage: 85 },
    { name: "Glucose", value: "105", unit: "mg/dL", status: "attention", color: "#F59E0B", percentage: 65 },
    { name: "Cholesterol", value: "180", unit: "mg/dL", status: "normal", color: "#10B981", percentage: 75 },
    { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal", color: "#10B981", percentage: 90 },
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
      <div
        style={{
          width: "300px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 2px 12px rgba(55,50,47,0.1)",
          padding: "16px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#37322F", marginBottom: "4px" }}>
            Health Metrics
          </div>
          <div style={{ fontSize: "9px", color: "#605A57" }}>Latest test results</div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {results.map((result, index) => (
            <div key={index}>
              {/* Result row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ fontSize: "10px", color: "#37322F", fontWeight: 500 }}>{result.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#37322F" }}>
                    {result.value}
                  </span>
                  <span style={{ fontSize: "8px", color: "#605A57" }}>{result.unit}</span>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: result.color,
                    }}
                  />
                </div>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "rgba(55,50,47,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${result.percentage}%`,
                    height: "100%",
                    background: result.color,
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(55,50,47,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "8px", color: "#605A57" }}>Last updated: Today</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: "7px", color: "#605A57" }}>Normal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F59E0B" }} />
              <span style={{ fontSize: "7px", color: "#605A57" }}>Attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestResultsVisual
