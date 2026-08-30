import React from 'react';
import { Award, FileText, RefreshCw, Upload, Sparkles, Printer, Globe, ExternalLink, Home, LayoutDashboard, User } from 'lucide-react';
import { AssessmentResult } from '../types';
import { DEVELOPER_URL } from './DeveloperShowcase';

interface NavbarProps {
  data: AssessmentResult | null;
  currentView: 'home' | 'assessment';
  onNavigate: (view: 'home' | 'assessment') => void;
  onReset: () => void;
  onOpenUpload: () => void;
  onPrint: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  currentView,
  onNavigate,
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-inner text-white font-black text-xl tracking-tight">
              CIL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  DigiALM Analyzer
                </span>
                <span className="hidden xs:inline-block bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  CIL MT Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                TCS iON Answer Key Evaluator
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('home')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'home'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {data && (
              <button
                onClick={() => onNavigate('assessment')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentView === 'assessment'
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Assessment Report</span>
              </button>
            )}

            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-800/50 transition group"
              title="Visit Aayush Sharma's Portfolio"
            >
              <User className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Developer</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {data && (
              <button
                onClick={onPrint}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                title="Print or Export Scorecard"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Scorecard</span>
              </button>
            )}

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{data ? 'Load Key' : 'Analyze Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
