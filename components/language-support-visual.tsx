import type React from "react"

interface LanguageSupportVisualProps {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Language Support Visual - Multi-language health explanations
 * Represents "Multi-language support"
 */
const LanguageSupportVisual: React.FC<LanguageSupportVisualProps> = ({
  width = 400,
  height = 250,
  className = "",
}) => {
  const languages = [
    { name: "English", text: "Your glucose level is normal", flag: "🇬🇧" },
    { name: "हिंदी", text: "आपका ग्लूकोज स्तर सामान्य है", flag: "🇮🇳" },
    { name: "اردو", text: "آپ کی گلوکوز کی سطح نارمل ہے", flag: "🇵🇰" },
    { name: "বাংলা", text: "আপনার গ্লুকোজ স্তর স্বাভাবিক", flag: "🇧🇩" },
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
      <div style={{ position: "relative", width: "280px", height: "200px" }}>
        {/* Language cards */}
        {languages.map((lang, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${10 + (index * 8)}px`,
              top: `${20 + (index * 12)}px`,
              width: "200px",
              background: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(55,50,47,0.12)",
              padding: "12px",
              transform: `rotate(${-2 + index}deg)`,
              zIndex: languages.length - index,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
                paddingBottom: "6px",
                borderBottom: "1px solid rgba(55,50,47,0.08)",
              }}
            >
              <span style={{ fontSize: "16px" }}>{lang.flag}</span>
              <span style={{ fontSize: "10px", color: "#605A57", fontWeight: 600 }}>{lang.name}</span>
            </div>
            {/* Content */}
            <div
              style={{
                fontSize: "9px",
                color: "#37322F",
                lineHeight: "1.4",
              }}
            >
              {lang.text}
            </div>
            {/* Status indicator */}
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />
              <span style={{ fontSize: "7px", color: "#10B981", fontWeight: 600 }}>Normal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguageSupportVisual
