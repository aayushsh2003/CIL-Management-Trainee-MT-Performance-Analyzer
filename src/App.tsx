import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { UrlInputSection, TARGET_CIL_URL } from './components/UrlInputSection';
import { ScoreOverview } from './components/ScoreOverview';
import { SectionPerformance } from './components/SectionPerformance';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { QuestionGrid } from './components/QuestionGrid';
import { QuestionReview } from './components/QuestionReview';
import { ScorecardModal } from './components/ScorecardModal';
import { AssessmentResult, FilterStatus, MarkingScheme } from './types';
import { parseDigiALMHtml, DEFAULT_MARKING_SCHEMES, reCalculateWithScheme } from './utils/parser';
import { fetchDigiALMResponseHtml } from './utils/fetcher';
import { CheckCircle2, Award, AlertCircle, RefreshCw, Upload, ArrowUp } from 'lucide-react';

export default function App() {
  const [assessmentData, setAssessmentData] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [markingScheme, setMarkingScheme] = useState<MarkingScheme>(DEFAULT_MARKING_SCHEMES[0]);
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState<boolean>(false);
  const [rawHtmlStored, setRawHtmlStored] = useState<string | null>(null);

  // Auto-load the user's requested CIL MT answer key URL on initial mount
  useEffect(() => {
    handleAnalyzeUrl(TARGET_CIL_URL, DEFAULT_MARKING_SCHEMES[0]);
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1'],
      });
    } catch {
      // benign fallback
    }
  };

  const handleAnalyzeUrl = async (url: string, scheme: MarkingScheme) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchDigiALMResponseHtml(url);
      setRawHtmlStored(result.html);
      const parsed = parseDigiALMHtml(result.html, scheme);
      setAssessmentData(parsed);
      setMarkingScheme(scheme);
      setIsInputModalOpen(false);
      triggerCelebration();
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while fetching the answer key.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeHtml = (html: string, scheme: MarkingScheme) => {
    setLoading(true);
    setError(null);

    try {
      setRawHtmlStored(html);
      const parsed = parseDigiALMHtml(html, scheme);
      setAssessmentData(parsed);
      setMarkingScheme(scheme);
      setIsInputModalOpen(false);
      triggerCelebration();
    } catch (err: any) {
      console.error('HTML parsing error:', err);
      setError('Failed to parse the provided HTML source. Ensure it is a valid DigiALM response sheet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeChange = (newScheme: MarkingScheme) => {
    setMarkingScheme(newScheme);
    if (assessmentData) {
      if (rawHtmlStored) {
        const recalculated = parseDigiALMHtml(rawHtmlStored, newScheme);
        setAssessmentData(recalculated);
      } else {
        const recalculated = reCalculateWithScheme(assessmentData, newScheme);
        setAssessmentData(recalculated);
      }
    }
  };

  const handleJumpToQuestion = (qNumber: number) => {
    setActiveQuestionNumber(qNumber);
    // Find if this question belongs to a specific section and select that section if needed
    const q = assessmentData?.questions.find((item) => item.qNumber === qNumber);
    if (q && selectedSectionIndex !== null && q.sectionIndex !== selectedSectionIndex) {
      setSelectedSectionIndex(null);
    }
    // Smooth scroll to question element
    setTimeout(() => {
      const el = document.getElementById(`question-${qNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleReset = () => {
    setIsInputModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar
        data={assessmentData}
        onReset={handleReset}
        onOpenUpload={() => setIsInputModalOpen(true)}
        onPrint={() => setIsScorecardOpen(true)}
        loading={loading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* URL Input & Controls Banner (shown if modal is open or when no data is loaded) */}
        {(!assessmentData || isInputModalOpen) && (
          <UrlInputSection
            onAnalyzeUrl={handleAnalyzeUrl}
            onAnalyzeHtml={handleAnalyzeHtml}
            loading={loading}
            error={error}
            selectedScheme={markingScheme}
            onSchemeChange={handleSchemeChange}
          />
        )}

        {/* Loading Spinner State */}
        {loading && !assessmentData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              Fetching & Analyzing Coal India Limited (CIL MT) Answer Key...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Connecting to DigiALM Touchstone CDN, parsing 200 questions across Paper 1 and Paper 2, and calculating your score.
            </p>
          </div>
        )}

        {/* Dashboard Content */}
        {assessmentData && (
          <div className="space-y-6">
            {/* 1. Score Overview & Candidate Info */}
            <ScoreOverview data={assessmentData} markingScheme={markingScheme} />

            {/* 2. Section-wise Performance Cards */}
            <SectionPerformance
              sections={assessmentData.sections}
              selectedSectionIndex={selectedSectionIndex}
              onSelectSection={(idx) => {
                setSelectedSectionIndex(selectedSectionIndex === idx ? null : idx);
                // Scroll down to review section
                const reviewEl = document.getElementById('question-review-section');
                if (reviewEl) reviewEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. Analytics & Visual Charts */}
            <AnalyticsCharts data={assessmentData} />

            {/* 4. Question Palette Grid Matrix */}
            <QuestionGrid
              questions={assessmentData.questions}
              activeQuestionNumber={activeQuestionNumber}
              onSelectQuestion={handleJumpToQuestion}
              currentFilter={filterStatus}
              onFilterChange={setFilterStatus}
              selectedSectionIndex={selectedSectionIndex}
            />

            {/* 5. Detailed Question-by-Question Review */}
            <div id="question-review-section">
              <QuestionReview
                questions={assessmentData.questions}
                sections={assessmentData.sections}
                activeQuestionNumber={activeQuestionNumber}
                currentFilter={filterStatus}
                onFilterChange={setFilterStatus}
                selectedSectionIndex={selectedSectionIndex}
                onSelectSection={setSelectedSectionIndex}
                markingScheme={markingScheme}
                examSubject={assessmentData.candidateInfo.subject}
              />
            </div>
          </div>
        )}
      </main>

      {/* Printable Scorecard Modal */}
      {assessmentData && (
        <ScorecardModal
          isOpen={isScorecardOpen}
          onClose={() => setIsScorecardOpen(false)}
          data={assessmentData}
          markingScheme={markingScheme}
        />
      )}

      {/* Floating Back to Top Button */}
      {assessmentData && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 transition transform hover:scale-105 z-30"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Coal India Limited (CIL MT) & DigiALM Answer Key Evaluator</span>
          <span>Designed for official TCS iON Touchstone response sheets</span>
        </div>
      </footer>
    </div>
  );
}
