import React from 'react';
import { Award, FileText, RefreshCw, Upload, Sparkles, Printer } from 'lucide-react';
import { AssessmentResult } from '../types';

interface NavbarProps {
  data: AssessmentResult | null;
  onReset: () => void;
  onOpenUpload: () => void;
  onPrint: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  onReset,
  onOpenUpload,
  onPrint,
  loading,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-inner text-white font-black text-xl tracking-tight">
              CIL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  DigiALM Assessment Analyzer
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  CIL MT Edition
                </span>
              </div>
              <p className="text-xs text-slate-400">
                TCS iON / Coal India MT & Government Exam Answer Key Evaluator
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {data && (
              <>
                <button
                  onClick={onPrint}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  title="Print or Export Scorecard"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Scorecard</span>
                </button>

                <button
                  onClick={onReset}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  title="Analyze another answer key"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New URL</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{data ? 'Load Another Key' : 'Analyze Answer Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
