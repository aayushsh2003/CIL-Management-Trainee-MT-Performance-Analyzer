import React, { useState } from 'react';
import { Search, Link as LinkIcon, Upload, FileCode, CheckCircle, AlertCircle, Settings, Play, Sparkles } from 'lucide-react';
import { MarkingScheme } from '../types';
import { DEFAULT_MARKING_SCHEMES } from '../utils/parser';

interface UrlInputSectionProps {
  onAnalyzeUrl: (url: string, scheme: MarkingScheme) => void;
  onAnalyzeHtml: (html: string, scheme: MarkingScheme, sourceName?: string) => void;
  loading: boolean;
  error: string | null;
  selectedScheme: MarkingScheme;
  onSchemeChange: (scheme: MarkingScheme) => void;
}

export const TARGET_CIL_URL = 'https://cdn.digialm.com//per/g01/pub/1258/touchstone/AssessmentQPHTMLMode1//1258O26309/1258O26309S2D3410/17878278188496965/1602581400042_1258O26309S2D3410E5.html#';

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  onAnalyzeUrl,
  onAnalyzeHtml,
  loading,
  error,
  selectedScheme,
  onSchemeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'paste'>('url');
  const [urlInput, setUrlInput] = useState(TARGET_CIL_URL);
  const [rawHtml, setRawHtml] = useState('');
  const [isCustomScheme, setIsCustomScheme] = useState(false);
  const [customPos, setCustomPos] = useState('1');
  const [customNeg, setCustomNeg] = useState('0');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAnalyzeUrl(urlInput.trim(), getActiveScheme());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        onAnalyzeHtml(text, getActiveScheme(), file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        onAnalyzeHtml(text, getActiveScheme(), file.name);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawHtml.trim()) return;
    onAnalyzeHtml(rawHtml.trim(), getActiveScheme(), 'Pasted HTML Source');
  };

  const getActiveScheme = (): MarkingScheme => {
    if (isCustomScheme) {
      return {
        id: 'custom',
        name: `Custom (+${customPos} / -${customNeg})`,
        positiveMarks: parseFloat(customPos) || 1,
        negativeMarks: parseFloat(customNeg) || 0,
        description: 'User configured marking scheme'
      };
    }
    return selectedScheme;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DigiALM / TCS iON Response Evaluator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              CIL Management Trainee (MT) Performance Analyzer
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Calculate total marks, accuracy percentage, Paper 1 vs Paper 2 split, and review all 200 questions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setUrlInput(TARGET_CIL_URL);
              onAnalyzeUrl(TARGET_CIL_URL, getActiveScheme());
            }}
            disabled={loading}
            className="flex-shrink-0 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Load Sample CIL Key</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'url'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>DigiALM Answer Key URL</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'file'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload HTML File</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'paste'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Paste HTML Source</span>
          </button>
        </div>

        {/* Tab 1: URL Input */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                DigiALM / TCS iON Assessment URL
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://cdn.digialm.com/.../1602581400042_1258O26309S2D3410E5.html"
                  className="w-full pl-4 pr-32 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono"
                />
                <div className="absolute right-2 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setUrlInput(TARGET_CIL_URL)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    title="Paste original target URL"
                  >
                    Paste Target
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Supports DigiALM Touchstone assessment response sheets from Coal India, SSC, RRB, and GATE exams.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700">Marking Scheme:</span>
                <select
                  value={isCustomScheme ? 'custom' : selectedScheme.id}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomScheme(true);
                    } else {
                      setIsCustomScheme(false);
                      const found = DEFAULT_MARKING_SCHEMES.find(s => s.id === e.target.value);
                      if (found) onSchemeChange(found);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500"
                >
                  {DEFAULT_MARKING_SCHEMES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                  <option value="custom">Custom (+Pos / -Neg)</option>
                </select>

                {isCustomScheme && (
                  <div className="flex items-center space-x-1.5 pl-2">
                    <span className="text-xs text-emerald-700 font-bold">+</span>
                    <input
                      type="number"
                      step="0.25"
                      value={customPos}
                      onChange={(e) => setCustomPos(e.target.value)}
                      className="w-14 px-1.5 py-1 text-xs border border-slate-300 rounded font-mono"
                      title="Positive marks per correct answer"
                    />
                    <span className="text-xs text-rose-700 font-bold">-</span>
                    <input
                      type="number"
                      step="0.05"
                      value={customNeg}
                      onChange={(e) => setCustomNeg(e.target.value)}
                      className="w-14 px-1.5 py-1 text-xs border border-slate-300 rounded font-mono"
                      title="Negative deduction per wrong answer"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition shadow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Fetching & Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Answer Key</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: File Upload */}
        {activeTab === 'file' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-amber-50/20 transition cursor-pointer"
          >
            <input
              type="file"
              accept=".html,.htm"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">
                Drag and drop your saved response sheet HTML here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                or click to browse your computer (.html / .htm file)
              </p>
            </label>
          </div>
        )}

        {/* Tab 3: Paste Source */}
        {activeTab === 'paste' && (
          <form onSubmit={handlePasteSubmit} className="space-y-4">
            <textarea
              rows={6}
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              placeholder="Paste the full HTML source code of the DigiALM response page here (Ctrl+U -> Ctrl+A -> Ctrl+C on the official answer key page)..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !rawHtml.trim()}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition shadow disabled:opacity-50"
              >
                Parse Pasted Source
              </button>
            </div>
          </form>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-rose-800 text-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Unable to analyze answer key</p>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
                {activeTab === 'url' && (
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    💡 Tip: If the direct URL link is blocked or protected by TCS iON login session, open the link in your browser, press <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">Ctrl+S</kbd> to save the webpage, and upload it below.
                  </p>
                )}
              </div>
            </div>
            {activeTab === 'url' && (
              <div className="flex sm:flex-col gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100/50 border border-rose-300 text-rose-900 text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  Upload File Instead
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  Paste Source
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
