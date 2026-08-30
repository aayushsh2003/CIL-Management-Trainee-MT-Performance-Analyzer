import React from 'react';
import { QuestionItem, FilterStatus } from '../types';
import { LayoutGrid } from 'lucide-react';

interface QuestionGridProps {
  questions: QuestionItem[];
  activeQuestionNumber: number | null;
  onSelectQuestion: (qNumber: number) => void;
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  selectedSectionIndex: number | null;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  questions,
  activeQuestionNumber,
  onSelectQuestion,
  currentFilter,
  onFilterChange,
  selectedSectionIndex,
}) => {
  const filteredQuestions = questions.filter((q) => {
    if (selectedSectionIndex !== null && q.sectionIndex !== selectedSectionIndex) {
      return false;
    }
    if (currentFilter === 'CORRECT') return q.isCorrect;
    if (currentFilter === 'INCORRECT') return q.isWrong;
    if (currentFilter === 'UNATTEMPTED') return !q.isAttempted;
    if (currentFilter === 'REVIEW') return /review/i.test(q.status);
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Question Palette Matrix ({filteredQuestions.length} / {questions.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any question number to jump directly to its detailed review.
            </p>
          </div>
        </div>

        {/* Quick status filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              currentFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => onFilterChange('CORRECT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              currentFilter === 'CORRECT'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Correct ({questions.filter((q) => q.isCorrect).length})
          </button>
          <button
            onClick={() => onFilterChange('INCORRECT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              currentFilter === 'INCORRECT'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Wrong ({questions.filter((q) => q.isWrong).length})
          </button>
          <button
            onClick={() => onFilterChange('UNATTEMPTED')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              currentFilter === 'UNATTEMPTED'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Skipped ({questions.filter((q) => !q.isAttempted).length})
          </button>
        </div>
      </div>

      {/* Grid of buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-20 gap-1.5 max-h-64 overflow-y-auto p-1">
        {filteredQuestions.map((q) => {
          let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';
          if (q.isCorrect) {
            btnClass = 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600';
          } else if (q.isWrong) {
            btnClass = 'bg-rose-500 text-white hover:bg-rose-600 border-rose-600';
          }

          const isActive = activeQuestionNumber === q.qNumber;

          return (
            <button
              key={q.qNumber}
              onClick={() => onSelectQuestion(q.qNumber)}
              title={`Q.${q.qNumber} (${q.sectionName}) - ${
                q.isCorrect ? 'Correct' : q.isWrong ? 'Wrong' : 'Skipped'
              } | Chosen: ${q.chosenOption || 'None'} | Right: ${q.rightOption}`}
              className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center border ${btnClass} ${
                isActive ? 'ring-2 ring-amber-500 ring-offset-2 scale-105 z-10 shadow' : ''
              }`}
            >
              {q.qNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};
