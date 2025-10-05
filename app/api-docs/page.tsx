"use client"

import { useState } from "react"
import { Copy, Check, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"

const navSections = [
  {
    title: "Get started",
    items: ["Overview", "Quickstart", "Models"],
  },
  {
    title: "Core concepts",
    items: ["Authentication", "Rate limits", "Error handling"],
  },
  {
    title: "API Endpoints",
    items: ["Analyze Report", "Generate Video", "Get Reports", "Save Report"],
  },
]

export default function ApiDocsPage() {
  const [activeItem, setActiveItem] = useState("Overview")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F] pt-16">
        <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-[#F7F5F3] border-r border-[#37322F]/10 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 bg-white border border-[#37322F]/10 rounded-lg text-sm text-[#37322F] placeholder-[#605A57] focus:outline-none focus:border-[#37322F]/30"
              />
            </div>

            {navSections.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold text-[#605A57] uppercase mb-2">{section.title}</h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => setActiveItem(item)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          activeItem === item
                            ? "bg-[#37322F] text-white font-medium"
                            : "text-[#605A57] hover:text-[#37322F] hover:bg-white"
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 mr-80">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {activeItem === "Overview" && <OverviewSection copyCode={copyCode} copiedCode={copiedCode} />}
            {activeItem === "Quickstart" && <QuickstartSection copyCode={copyCode} copiedCode={copiedCode} />}
            {activeItem === "Authentication" && <AuthenticationSection copyCode={copyCode} copiedCode={copiedCode} />}
            {activeItem === "Analyze Report" && <AnalyzeReportSection copyCode={copyCode} copiedCode={copiedCode} />}
            {activeItem === "Generate Video" && <GenerateVideoSection copyCode={copyCode} copiedCode={copiedCode} />}
            {activeItem === "Get Reports" && <GetReportsSection copyCode={copyCode} copiedCode={copiedCode} />}
          </div>
        </main>

        {/* Right Sidebar - On this page */}
        <aside className="w-80 fixed right-0 top-16 bottom-0 bg-[#F7F5F3] border-l border-[#37322F]/10 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-[#605A57] mb-4">On this page</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#intro" className="text-[#605A57] hover:text-[#37322F] transition">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#setup" className="text-[#605A57] hover:text-[#37322F] transition">
                  Setup
                </a>
              </li>
              <li>
                <a href="#examples" className="text-[#605A57] hover:text-[#37322F] transition">
                  Examples
                </a>
              </li>
            </ul>
          </div>
        </aside>
        </div>
      </div>
    </>
  )
}

function CodeBlock({ code, language, id, copyCode, copiedCode }: any) {
  return (
    <div className="relative group">
      <div className="absolute right-3 top-3 z-10">
        <button
          onClick={() => copyCode(code, id)}
          className="p-2 bg-white hover:bg-[#F7F5F3] border border-[#37322F]/10 rounded-lg transition flex items-center gap-2"
        >
          {copiedCode === id ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#605A57]" />
              <span className="text-xs text-[#605A57]">{language}</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#37322F] border border-[#37322F] rounded-xl p-6 overflow-x-auto">
        <code className="text-sm text-gray-100">{code}</code>
      </pre>
    </div>
  )
}

function OverviewSection({ copyCode, copiedCode }: any) {
  const exampleCode = `import { TabeerAI } from '@tabeer/sdk';

const client = new TabeerAI({
  apiKey: process.env.TABEER_API_KEY
});

const response = await client.analyzeReport({
  file: healthReport,
  familyMember: 'Father'
});

console.log(response.analysis);`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Health Report Analysis API</h1>
        <p className="text-xl text-[#605A57]">
          Learn how to use AI to analyze health reports and generate insights.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-[#605A57] leading-relaxed">
          With the Tabeer AI API, you can use advanced AI models to analyze health reports, generate video scripts,
          and manage health records for your entire family.
        </p>
        <p className="text-[#605A57] leading-relaxed">
          Our API can process PDF, JPG, and PNG health reports, extract medical data, and provide detailed,
          patient-friendly explanations with emojis and visual indicators.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Example</h2>
        <p className="text-[#605A57] mb-4">Here's a simple example using our API:</p>
        <CodeBlock code={exampleCode} language="javascript" id="overview-1" copyCode={copyCode} copiedCode={copiedCode} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Base URL</h3>
        <code className="text-blue-600">https://your-domain.com/api</code>
      </div>
    </div>
  )
}

function QuickstartSection({ copyCode, copiedCode }: any) {
  const installCode = `npm install @tabeer/sdk`
  const setupCode = `import { TabeerAI } from '@tabeer/sdk';

const client = new TabeerAI({
  apiKey: process.env.TABEER_API_KEY
});`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Quickstart</h1>
        <p className="text-xl text-[#605A57]">Get started with Tabeer AI in minutes.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Install the SDK</h2>
          <CodeBlock code={installCode} language="bash" id="quickstart-1" copyCode={copyCode} copiedCode={copiedCode} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">2. Initialize the client</h2>
          <CodeBlock code={setupCode} language="javascript" id="quickstart-2" copyCode={copyCode} copiedCode={copiedCode} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">3. Make your first request</h2>
          <p className="text-[#605A57] mb-4">Upload and analyze a health report:</p>
          <CodeBlock
            code={`const response = await client.analyzeReport({
  file: healthReportFile,
  familyMember: 'Self'
});

console.log(response.analysis);`}
            language="javascript"
            id="quickstart-3"
            copyCode={copyCode}
            copiedCode={copiedCode}
          />
        </div>
      </div>
    </div>
  )
}

function AuthenticationSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Authentication</h1>
        <p className="text-xl text-[#605A57]">Secure your API requests with Clerk authentication.</p>
      </div>

      <div className="space-y-4">
        <p className="text-[#605A57] leading-relaxed">
          Tabeer AI uses Clerk for authentication. All API requests must include a valid authentication token in the
          Authorization header.
        </p>
      </div>

      <CodeBlock
        code={`const { getToken } = useAuth();
const token = await getToken();

fetch('/api/analyze-report', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});`}
        language="javascript"
        id="auth-1"
        copyCode={copyCode}
        copiedCode={copiedCode}
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">⚠️ Security Note</h3>
        <p className="text-[#605A57]">
          Never expose your authentication tokens in client-side code. Always use environment variables and server-side
          requests.
        </p>
      </div>
    </div>
  )
}

function AnalyzeReportSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Analyze Report</h1>
        <p className="text-xl text-[#605A57]">Upload and analyze health reports with AI.</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <code className="text-green-700 font-mono">POST /api/analyze-report</code>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Request</h2>
        <CodeBlock
          code={`const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('familyMemberName', 'John');
formData.append('relationship', 'Father');

const response = await fetch('/api/analyze-report', {
  method: 'POST',
  body: formData
});

const data = await response.json();`}
          language="javascript"
          id="analyze-1"
          copyCode={copyCode}
          copiedCode={copiedCode}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Response</h2>
        <CodeBlock
          code={`{
  "analysis": "## 📋 Report Overview\\n...",
  "fileName": "health_report.pdf",
  "fileSize": 450000,
  "timestamp": "2025-10-05T03:00:00.000Z"
}`}
          language="json"
          id="analyze-2"
          copyCode={copyCode}
          copiedCode={copiedCode}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Parameters</h2>
        <div className="bg-white border border-[#37322F]/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F7F5F3]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#37322F]">Parameter</th>
                <th className="text-left p-4 text-sm font-semibold text-[#37322F]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[#37322F]">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#37322F]/10">
                <td className="p-4 text-sm text-[#37322F]">file</td>
                <td className="p-4 text-sm text-[#605A57]">File</td>
                <td className="p-4 text-sm text-[#605A57]">PDF, JPG, or PNG (max 10MB)</td>
              </tr>
              <tr className="border-t border-[#37322F]/10">
                <td className="p-4 text-sm text-[#37322F]">familyMemberName</td>
                <td className="p-4 text-sm text-[#605A57]">string</td>
                <td className="p-4 text-sm text-[#605A57]">Name of family member (optional)</td>
              </tr>
              <tr className="border-t border-[#37322F]/10">
                <td className="p-4 text-sm text-[#37322F]">relationship</td>
                <td className="p-4 text-sm text-[#605A57]">string</td>
                <td className="p-4 text-sm text-[#605A57]">Self, Father, Mother, etc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GenerateVideoSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Generate Video Script</h1>
        <p className="text-xl text-[#605A57]">Create multi-language video scripts from health analysis.</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <code className="text-purple-700 font-mono">POST /api/generate-video-script</code>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Request</h2>
        <CodeBlock
          code={`const response = await fetch('/api/generate-video-script', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    analysis: "Your health report analysis...",
    language: "Hindi"
  })
});

const data = await response.json();`}
          language="javascript"
          id="video-1"
          copyCode={copyCode}
          copiedCode={copiedCode}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Supported Languages</h2>
        <div className="grid grid-cols-3 gap-3">
          {["English", "Hindi", "Spanish", "Arabic", "Bengali", "Portuguese", "Urdu", "Tamil", "Telugu"].map((lang) => (
            <div key={lang} className="bg-white border border-[#37322F]/10 px-4 py-2 rounded-lg text-sm text-[#37322F]">
              {lang}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GetReportsSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Get Reports</h1>
        <p className="text-xl text-[#605A57]">Retrieve user's saved health reports.</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <code className="text-blue-700 font-mono">GET /api/get-reports</code>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Request</h2>
        <CodeBlock
          code={`const response = await fetch('/api/get-reports');
const { reports } = await response.json();`}
          language="javascript"
          id="get-1"
          copyCode={copyCode}
          copiedCode={copiedCode}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Response</h2>
        <CodeBlock
          code={`{
  "reports": [
    {
      "id": "uuid",
      "user_id": "user_123",
      "file_name": "report.pdf",
      "family_member_name": "Father",
      "relationship": "Father",
      "analysis": "...",
      "created_at": "2025-10-05T03:00:00.000Z"
    }
  ]
}`}
          language="json"
          id="get-2"
          copyCode={copyCode}
          copiedCode={copiedCode}
        />
      </div>
    </div>
  )
}
