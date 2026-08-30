import React from 'react';
import { SectionAnalysis } from '../types';
import { CheckCircle, XCircle, MinusCircle, Zap, ShieldCheck } from 'lucide-react';

interface SectionPerformanceProps {
  sections: SectionAnalysis[];
  onSelectSection?: (sectionIndex: number) => void;
  selectedSectionIndex?: number | null;
}

export const SectionPerformance: React.FC<SectionPerformanceProps> = ({
  sections,
  onSelectSection,
  selectedSectionIndex,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Section-wise Performance Breakdown</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed evaluation of all sections: General Awareness, Quant, Reasoning, English, and Domain.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1 text-emerald-600">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Correct</span>
          </div>
          <div className="flex items-center space-x-1 text-rose-600">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Incorrect</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span>Unattempted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const isSelected = selectedSectionIndex === sec.sectionIndex;
          const correctPct = sec.questionsCount > 0 ? (sec.correct / sec.questionsCount) * 100 : 0;
          const wrongPct = sec.questionsCount > 0 ? (sec.incorrect / sec.questionsCount) * 100 : 0;
          const skippedPct = sec.questionsCount > 0 ? (sec.unattempted / sec.questionsCount) * 100 : 0;

          // Rating
          let ratingBadge = { text: 'Solid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
          if (sec.accuracy >= 75) {
            ratingBadge = { text: 'High Accuracy', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
          } else if (sec.accuracy >= 55) {
            ratingBadge = { text: 'Moderate', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
          } else {
            ratingBadge = { text: 'Needs Focus', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
          }

          return (
            <div
              key={sec.sectionIndex}
              onClick={() => onSelectSection && onSelectSection(sec.sectionIndex)}
              className={`p-5 rounded-2xl border transition cursor-pointer relative ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Section {sec.sectionIndex + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={sec.name}>
                    {sec.name}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${ratingBadge.bg}`}>
                  {ratingBadge.text}
                </span>
              </div>

              {/* Marks & Accuracy Summary */}
              <div className="my-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">{sec.marksObtained}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1">/ {sec.maxMarks} Marks</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800">{sec.accuracy}%</span>
                  <span className="text-[11px] text-slate-400 block">Accuracy</span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex mb-3">
                <div
                  style={{ width: `${correctPct}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Correct: ${sec.correct} (${correctPct.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${wrongPct}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`Incorrect: ${sec.incorrect} (${wrongPct.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${skippedPct}%` }}
                  className="bg-slate-300 h-full transition-all"
                  title={`Unattempted: ${sec.unattempted} (${skippedPct.toFixed(1)}%)`}
                />
              </div>

              {/* Count badges */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-center">
                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                  <span className="text-[10px] font-semibold text-emerald-700 block">Correct</span>
                  <span className="text-xs font-bold text-emerald-800">{sec.correct}</span>
                </div>
                <div className="bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
                  <span className="text-[10px] font-semibold text-rose-700 block">Wrong</span>
                  <span className="text-xs font-bold text-rose-800">{sec.incorrect}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block">Skipped</span>
                  <span className="text-xs font-bold text-slate-800">{sec.unattempted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
