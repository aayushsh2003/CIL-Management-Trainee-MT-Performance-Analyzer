import React from 'react';
import {
  Sparkles,
  Zap,
  Award,
  BarChart3,
  CheckCircle2,
  FileText,
  Sliders,
  BrainCircuit,
  Printer,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Layers,
  Search,
  Upload,
  Globe
} from 'lucide-react';
import { DeveloperShowcase, DEVELOPER_URL } from './DeveloperShowcase';
import { TARGET_CIL_URL } from './UrlInputSection';

interface HomePageProps {
  onAnalyzeSample: () => void;
  onOpenUpload: () => void;
  hasLoadedData: boolean;
  onViewLoadedData: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAnalyzeSample,
  onOpenUpload,
  hasLoadedData,
  onViewLoadedData,
}) => {
  const supportedExams = [
    {
      name: 'Coal India MT (CIL)',
      badge: 'CIL MT Special',
      description: 'Paper 1 (Aptitude/GK/English/Reasoning - 100 Qs) + Paper 2 (Technical Domain - 100 Qs).',
      pattern: '200 Marks / No Negative',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-900 border-amber-300',
    },
    {
      name: 'SSC CGL / CHSL / JE',
      badge: 'Staff Selection Commission',
      description: 'General Intelligence, Quantitative, English Comprehension, and General Awareness.',
      pattern: '+2 Correct / -0.5 Negative',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-900 border-blue-300',
    },
    {
      name: 'RRB NTPC / Group D',
      badge: 'Railway Recruitment Board',
      description: 'General Science, Mathematics, General Intelligence & Reasoning, General Awareness.',
      pattern: '+1 Correct / -0.33 Negative',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-900 border-emerald-300',
    },
    {
      name: 'TCS iON Touchstone Tests',
      badge: 'All DigiALM Assessment URLs',
      description: 'Generic TCS iON DigiALM QP HTML sheets with custom positive and negative marking support.',
      pattern: 'Custom Marking Calculator',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-900 border-purple-300',
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Automated Response Key Parsing',
      description: 'Directly ingest DigiALM Touchstone URLs without CORS roadblocks, or upload your saved response HTML file in seconds.',
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      title: 'Paper 1 & Paper 2 Granular Breakdown',
      description: 'Isolate Non-Tech Aptitude from Technical Domain performance with dedicated scorecards, accuracy rates, and percentile metrics.',
    },
    {
      icon: <Sliders className="w-6 h-6 text-emerald-500" />,
      title: 'Dynamic Marking Scheme Engine',
      description: 'Toggle between standard CIL (+1/0), negative marking (+1/-0.25), SSC (+2/-0.5), or custom values with instantaneous recalculation.',
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-rose-500" />,
      title: 'Gemini AI Question Tutoring',
      description: 'Receive step-by-step conceptual explanations, memory tricks, and error diagnostics for any question in your response sheet.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-sky-500" />,
      title: 'Visual Analytics & Strength Heatmaps',
      description: 'Interactive distribution charts comparing your accuracy and time efficiency across sections to pinpoint high-yield revision topics.',
    },
    {
      icon: <Printer className="w-6 h-6 text-purple-500" />,
      title: 'Printable & PDF-Ready Scorecards',
      description: 'Export an official candidate performance scorecard complete with roll number, test center, and verified sectional table.',
    },
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Glow circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official TCS iON & DigiALM Answer Key Evaluator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Analyze Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">CIL MT & DigiALM</span> Answer Key
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Effortlessly calculate your total score, view section-wise accuracy across 200 questions, inspect Paper 1 vs Paper 2 metrics, and explore AI-powered conceptual explanations.
          </p>

          {/* Quick CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onAnalyzeSample}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              <span>Load CIL MT Sample Key</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 shadow-md transition"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Input Custom URL or File</span>
            </button>

            {hasLoadedData && (
              <button
                onClick={onViewLoadedData}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Current Scorecard</span>
              </button>
            )}
          </div>

          {/* Key metadata badges */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant 200-Question Audit</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>CIL MT / SSC / RRB Supported</span>
            </span>
          </div>
        </div>
      </div>

      {/* Developer Spotlight Card */}
      <DeveloperShowcase />

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Assessment Evaluation Tools
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to evaluate, audit, and learn from your computer-based exam response sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Exams Matrix */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Supported Exam Formats</h2>
            <p className="text-xs text-slate-500">
              Compatible with all official TCS iON DigiALM Touchstone assessment portals.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            <span>Analyze Your Response Key</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedExams.map((exam, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border bg-gradient-to-b ${exam.color} flex flex-col justify-between space-y-3`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 shadow-xs">
                  {exam.badge}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{exam.name}</h3>
                <p className="text-xs text-slate-700 mt-1 leading-snug">{exam.description}</p>
              </div>
              <div className="text-[11px] font-semibold text-slate-800 bg-white/60 px-2 py-1 rounded">
                Scheme: {exam.pattern}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How to use */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Step-by-Step Guide</span>
          </div>

          <h3 className="text-lg font-bold text-white">How to Analyze Your Response Sheet</h3>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside">
            <li className="leading-relaxed">
              <strong className="text-slate-100">Copy the URL:</strong> Open your official DigiALM response sheet page and copy the browser address bar link.
            </li>
            <li className="leading-relaxed">
              <strong className="text-slate-100">Paste or Upload:</strong> Click "Input Answer Key URL" above or upload the saved HTML file (<kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono">Ctrl+S</kbd>).
            </li>
            <li className="leading-relaxed">
              <strong className="text-slate-100">Select Marking Pattern:</strong> Choose CIL MT (+1/0), SSC (+2/-0.5), RRB (+1/-0.33), or enter custom values.
            </li>
            <li className="leading-relaxed">
              <strong className="text-slate-100">Instant Score & AI Walkthrough:</strong> View your overall score, paper split, 200-question matrix, and click "AI Explain" on any question.
            </li>
          </ol>
        </div>

        {/* Quick FAQs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 text-sm font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">Important Details</h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-800">Is there negative marking in Coal India (CIL MT)?</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Standard CIL MT exams do not have negative marking (1 mark per correct answer). You can also simulate with -0.25 deduction using the scheme selector.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-800">What if the DigiALM URL fails to load?</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Some links require an active session login. Simply save the answer key page as an HTML file in your browser and upload it directly.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-800">Where can I see the developer's other projects?</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Check out Aayush Sharma's portfolio at{' '}
                <a
                  href={DEVELOPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold underline inline-flex items-center"
                >
                  aayush-ki-pehchan.vercel.app <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
