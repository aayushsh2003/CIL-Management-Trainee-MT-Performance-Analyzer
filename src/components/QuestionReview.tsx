import React, { useState, useMemo } from 'react';
import { QuestionItem, FilterStatus, SectionAnalysis, MarkingScheme } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

interface QuestionReviewProps {
  questions: QuestionItem[];
  sections: SectionAnalysis[];
  activeQuestionNumber: number | null;
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  selectedSectionIndex: number | null;
  onSelectSection: (index: number | null) => void;
  markingScheme: MarkingScheme;
  examSubject?: string;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  questions,
  sections,
  activeQuestionNumber,
  currentFilter,
  onFilterChange,
  selectedSectionIndex,
  onSelectSection,
  markingScheme,
  examSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAiQId, setExpandedAiQId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Section filter
      if (selectedSectionIndex !== null && q.sectionIndex !== selectedSectionIndex) {
        return false;
      }

      // Status filter
      if (currentFilter === 'CORRECT' && !q.isCorrect) return false;
      if (currentFilter === 'INCORRECT' && !q.isWrong) return false;
      if (currentFilter === 'UNATTEMPTED' && q.isAttempted) return false;
      if (currentFilter === 'REVIEW' && !/review/i.test(q.status)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = q.questionText.toLowerCase().includes(query);
        const idMatch = q.qId.includes(query);
        const optMatch = q.options.some((o) => o.text.toLowerCase().includes(query));
        if (!textMatch && !idMatch && !optMatch) return false;
      }

      return true;
    });
  }, [questions, selectedSectionIndex, currentFilter, searchQuery]);

  // Request AI Explanation for a question
  const fetchAiExplanation = async (q: QuestionItem) => {
    if (aiExplanations[q.qId]) {
      setExpandedAiQId(expandedAiQId === q.qId ? null : q.qId);
      return;
    }

    setAiLoading(q.qId);
    setExpandedAiQId(q.qId);

    try {
      const res = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.questionText,
          options: q.options.map((o) => `${o.char}. ${o.text}`),
          rightOption: q.rightOption,
          chosenOption: q.chosenOption,
          subject: `${q.sectionName} - ${examSubject || 'CIL MT'}`,
        }),
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: res.ok ? rawText : `Server returned HTTP ${res.status}` };
      }

      if (data.explanation) {
        setAiExplanations((prev) => ({ ...prev, [q.qId]: data.explanation }));
      } else {
        setAiExplanations((prev) => ({
          ...prev,
          [q.qId]: data.error || 'Detailed explanation not available at this moment.',
        }));
      }
    } catch (e: any) {
      setAiExplanations((prev) => ({
        ...prev,
        [q.qId]: `Failed to retrieve AI explanation: ${e.message}`,
      }));
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header & Controls */}
      <div className="space-y-4 border-b border-slate-100 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Full Question Paper Audit & Review</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredQuestions.length} of {questions.length} total questions
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question text or ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => onSelectSection(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSectionIndex === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Sections ({questions.length})
          </button>
          {sections.map((sec) => (
            <button
              key={sec.sectionIndex}
              onClick={() => onSelectSection(sec.sectionIndex)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedSectionIndex === sec.sectionIndex
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sec.name} ({sec.questionsCount})
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No questions match the selected filter criteria.</p>
            <button
              onClick={() => {
                onFilterChange('ALL');
                onSelectSection(null);
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-amber-600 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isAiExpanded = expandedAiQId === q.qId;
            const isLoadingThisAi = aiLoading === q.qId;

            return (
              <div
                key={q.qNumber}
                id={`question-${q.qNumber}`}
                className={`rounded-2xl border transition p-5 ${
                  activeQuestionNumber === q.qNumber
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10 shadow-md'
                    : q.isCorrect
                    ? 'border-emerald-200 bg-white hover:border-emerald-300'
                    : q.isWrong
                    ? 'border-rose-200 bg-white hover:border-rose-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                      {q.qNumber}
                    </span>
                    <span className="font-semibold text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                      {q.sectionName}
                    </span>
                    <span className="font-mono text-slate-400">ID: {q.qId}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Badge */}
                    {q.isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct (+{markingScheme.positiveMarks})</span>
                      </span>
                    ) : q.isWrong ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>
                          Wrong {markingScheme.negativeMarks > 0 ? `(-${markingScheme.negativeMarks})` : '(0)'}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Unattempted (0)</span>
                      </span>
                    )}

                    {q.status && (
                      <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {q.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Content */}
                <div className="py-4">
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isRightOption = opt.isCorrect || opt.char === q.rightOption;
                    const isCandidateChoice = opt.char === q.chosenOption;

                    let optContainerStyle =
                      'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700';
                    let badgeNode = null;

                    if (isRightOption && isCandidateChoice) {
                      optContainerStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                      badgeNode = (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct Answer & Your Choice</span>
                        </span>
                      );
                    } else if (isRightOption) {
                      optContainerStyle =
                        'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium';
                      badgeNode = (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Official Correct Answer</span>
                        </span>
                      );
                    } else if (isCandidateChoice) {
                      optContainerStyle =
                        'border-rose-400 bg-rose-50 text-rose-950 font-medium ring-1 ring-rose-400';
                      badgeNode = (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          <span>Your Chosen Answer (Incorrect)</span>
                        </span>
                      );
                    }

                    return (
                      <div
                        key={opt.char}
                        className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${optContainerStyle}`}
                      >
                        <div className="flex items-start space-x-3">
                          <span
                            className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                              isRightOption
                                ? 'bg-emerald-600 text-white'
                                : isCandidateChoice
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.char}
                          </span>
                          <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                        </div>
                        {badgeNode && <div className="flex-shrink-0 sm:pl-4">{badgeNode}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Footer metadata & AI Explainer toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-4 text-slate-500">
                    <span>
                      Candidate Choice:{' '}
                      <strong className={q.isCorrect ? 'text-emerald-700' : q.isWrong ? 'text-rose-700' : 'text-slate-700'}>
                        {q.chosenOption ? `Option ${q.chosenOption}` : 'Not Attempted'}
                      </strong>
                    </span>
                    <span>
                      Correct Answer:{' '}
                      <strong className="text-emerald-700">Option {q.rightOption}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => fetchAiExplanation(q)}
                    disabled={isLoadingThisAi}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isLoadingThisAi ? 'Generating Solution...' : isAiExpanded ? 'Hide AI Solution' : 'View AI Concept & Solution'}</span>
                    {isAiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Collapsible AI Solution Box */}
                {isAiExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs leading-relaxed space-y-2 border border-slate-800 animate-in fade-in">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs pb-2 border-b border-slate-800">
                      <Sparkles className="w-4 h-4" />
                      <span>CIL MT Concept & High-Yield Solution Breakdown</span>
                    </div>

                    {isLoadingThisAi ? (
                      <div className="py-4 flex items-center justify-center space-x-2 text-slate-400">
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span>Formulating step-by-step reasoning...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-sans">
                        {aiExplanations[q.qId]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
