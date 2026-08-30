import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UrlInputSection, TARGET_CIL_URL } from './components/UrlInputSection';
import { ScoreOverview } from './components/ScoreOverview';
import { SectionPerformance } from './components/SectionPerformance';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { QuestionGrid } from './components/QuestionGrid';
import { QuestionReview } from './components/QuestionReview';
import { ScorecardModal } from './components/ScorecardModal';
import { DEVELOPER_URL } from './components/DeveloperShowcase';
import { AssessmentResult, FilterStatus, MarkingScheme } from './types';
import { parseDigiALMHtml, DEFAULT_MARKING_SCHEMES, reCalculateWithScheme } from './utils/parser';
import { fetchDigiALMResponseHtml } from './utils/fetcher';
import { CheckCircle2, Award, AlertCircle, RefreshCw, Upload, ArrowUp, ExternalLink, Heart, Globe, User } from 'lucide-react';

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
  const [currentView, setCurrentView] = useState<'home' | 'assessment'>('home');

  // Pre-load the user's requested CIL MT answer key URL in background
  useEffect(() => {
    handleAnalyzeUrl(TARGET_CIL_URL, DEFAULT_MARKING_SCHEMES[0], false);
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

  const handleAnalyzeUrl = async (url: string, scheme: MarkingScheme, switchView: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchDigiALMResponseHtml(url);
      setRawHtmlStored(result.html);
      const parsed = parseDigiALMHtml(result.html, scheme);
      setAssessmentData(parsed);
      setMarkingScheme(scheme);
      setIsInputModalOpen(false);
      if (switchView) {
        setCurrentView('assessment');
        triggerCelebration();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      setCurrentView('assessment');
      triggerCelebration();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const q = assessmentData?.questions.find((item) => item.qNumber === qNumber);
    if (q && selectedSectionIndex !== null && q.sectionIndex !== selectedSectionIndex) {
      setSelectedSectionIndex(null);
    }
    setTimeout(() => {
      const el = document.getElementById(`question-${qNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar
        data={assessmentData}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReset={() => {
          setIsInputModalOpen(true);
        }}
        onOpenUpload={() => setIsInputModalOpen(true)}
        onPrint={() => setIsScorecardOpen(true)}
        loading={loading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* URL Input Modal / Overlay when triggered */}
        {isInputModalOpen && (
          <div className="mb-6">
            <UrlInputSection
              onAnalyzeUrl={(url, scheme) => handleAnalyzeUrl(url, scheme, true)}
              onAnalyzeHtml={handleAnalyzeHtml}
              loading={loading}
              error={error}
              selectedScheme={markingScheme}
              onSchemeChange={handleSchemeChange}
            />
          </div>
        )}

        {/* View 1: Beautiful Home Page */}
        {currentView === 'home' && (
          <HomePage
            onAnalyzeSample={() => {
              if (assessmentData) {
                setCurrentView('assessment');
                triggerCelebration();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                handleAnalyzeUrl(TARGET_CIL_URL, markingScheme, true);
              }
            }}
            onOpenUpload={() => {
              setIsInputModalOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            hasLoadedData={!!assessmentData}
            onViewLoadedData={() => {
              setCurrentView('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* View 2: Full Assessment Scorecard & Analytics Dashboard */}
        {currentView === 'assessment' && assessmentData && (
          <div className="space-y-6">
            {/* Quick Breadcrumb Back to Home */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-slate-600 hover:text-amber-600 flex items-center space-x-1.5 transition"
              >
                <span>← Back to Home Page</span>
              </button>

              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={() => setIsScorecardOpen(true)}
                  className="font-medium text-slate-700 hover:text-amber-600 transition"
                >
                  Print Scorecard
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setIsInputModalOpen(true)}
                  className="font-semibold text-amber-600 hover:text-amber-700 transition"
                >
                  Change URL / Scheme
                </button>
              </div>
            </div>

            {/* 1. Score Overview & Candidate Info */}
            <ScoreOverview data={assessmentData} markingScheme={markingScheme} />

            {/* 2. Section-wise Performance Cards */}
            <SectionPerformance
              sections={assessmentData.sections}
              selectedSectionIndex={selectedSectionIndex}
              onSelectSection={(idx) => {
                setSelectedSectionIndex(selectedSectionIndex === idx ? null : idx);
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
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 transition transform hover:scale-105 z-30"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Rich Footer with Developer Profile Link */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-sm">
                CIL
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">DigiALM Assessment Analyzer</p>
                <p className="text-[11px] text-slate-500">TCS iON Response Sheet Evaluation Suite</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
              <button
                onClick={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition"
              >
                Home
              </button>
              <span>•</span>
              {assessmentData && (
                <>
                  <button
                    onClick={() => {
                      setCurrentView('assessment');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition"
                  >
                    Assessment Report
                  </button>
                  <span>•</span>
                </>
              )}
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                <span>Aayush Sharma Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              Built with care by{' '}
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 underline font-medium"
              >
                Aayush Sharma
              </a>{' '}
              ({DEVELOPER_URL})
            </p>
            <p>Designed for official TCS iON Touchstone response sheets</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
