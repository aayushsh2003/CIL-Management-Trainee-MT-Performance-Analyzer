import React from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, Target, TrendingUp, User, Calendar, MapPin, BookOpen, Layers } from 'lucide-react';
import { AssessmentResult, MarkingScheme } from '../types';

interface ScoreOverviewProps {
  data: AssessmentResult;
  markingScheme: MarkingScheme;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ data, markingScheme }) => {
  const {
    candidateInfo,
    totalMarksObtained,
    totalMaxMarks,
    percentage,
    overallAccuracy,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalAttempted,
    totalQuestions,
    paper1Score,
    paper2Score,
  } = data;

  // Score qualification assessment
  const getPerformanceBadge = () => {
    if (percentage >= 70) return { label: 'Outstanding (Tier 1)', color: 'bg-emerald-500 text-white', desc: 'High probability of clearing CIL MT cutoff' };
    if (percentage >= 60) return { label: 'Very Good (Competitive)', color: 'bg-teal-600 text-white', desc: 'Strong contender for shortlisting' };
    if (percentage >= 50) return { label: 'Moderate Score', color: 'bg-amber-500 text-slate-950', desc: 'Near boundary for general cutoff' };
    return { label: 'Below Target', color: 'bg-rose-500 text-white', desc: 'Requires further domain & aptitude preparation' };
  };

  const badge = getPerformanceBadge();

  return (
    <div className="space-y-6">
      {/* 1. Candidate Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {candidateInfo.participantName || 'Candidate Performance Report'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                  {candidateInfo.subject || 'CIL MT'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Roll / Participant ID: <span className="font-semibold text-slate-700">{candidateInfo.participantId || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${badge.color} shadow-sm`}>
              {badge.label}
            </span>
            <div className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              Scheme: <span className="font-semibold text-slate-800">{markingScheme.name}</span>
            </div>
          </div>
        </div>

        {/* Detailed Candidate Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Exam Venue</span>
              <span className="font-medium text-slate-800 line-clamp-1" title={candidateInfo.testCenterName}>
                {candidateInfo.testCenterName || 'TCS iON Digital Zone'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Exam Date & Time</span>
              <span className="font-medium text-slate-800">
                {candidateInfo.testDate ? `${candidateInfo.testDate} (${candidateInfo.testTime || ''})` : 'August 2026'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Discipline / Post</span>
              <span className="font-medium text-slate-800">{candidateInfo.subject || 'Management Trainee'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Layers className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Question Distribution</span>
              <span className="font-medium text-slate-800">{totalQuestions} Total Questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main High-Contrast Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Total Score Obtained
            </span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {totalMarksObtained}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              / {totalMaxMarks} Marks
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
            <span className="text-slate-300">Score Percentage</span>
            <span className="font-bold text-amber-300 text-sm">{percentage}%</span>
          </div>
        </div>

        {/* Correct Answers Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Correct Answers
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600">
              {totalCorrect}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              (+{(totalCorrect * markingScheme.positiveMarks).toFixed(1)} pts)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-semibold text-slate-700">
              {totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Incorrect Attempts Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Incorrect Attempts
            </span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-600">
              {totalIncorrect}
            </span>
            <span className="text-xs text-rose-700 font-medium">
              {markingScheme.negativeMarks > 0 ? `(-${(totalIncorrect * markingScheme.negativeMarks).toFixed(2)} pts)` : '(0 negative)'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Error Rate</span>
            <span className="font-semibold text-slate-700">
              {totalAttempted > 0 ? ((totalIncorrect / totalAttempted) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Overall Accuracy Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Overall Accuracy
            </span>
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {overallAccuracy}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalAttempted} attempted)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Unattempted / Skipped</span>
            <span className="font-semibold text-slate-700">{totalUnattempted} Qs</span>
          </div>
        </div>
      </div>

      {/* 3. Paper 1 (Non-Tech) vs Paper 2 (Technical Domain) Breakdown */}
      {paper1Score && paper2Score && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Paper 1 Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Paper - I (General Aptitude)
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  GK, Quant, Reasoning & English
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {paper1Score.marks}
                </span>
                <span className="text-xs text-slate-500 block">/ {paper1Score.maxMarks} Marks</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-emerald-600 font-semibold block">Correct</span>
                <span className="text-lg font-bold text-emerald-700">{paper1Score.correct}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-rose-600 font-semibold block">Incorrect</span>
                <span className="text-lg font-bold text-rose-700">{paper1Score.wrong}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block">Skipped</span>
                <span className="text-lg font-bold text-slate-700">{paper1Score.unattempted}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>Paper 1 Accuracy</span>
              <span className="font-bold text-slate-800">
                {paper1Score.correct + paper1Score.wrong > 0
                  ? ((paper1Score.correct / (paper1Score.correct + paper1Score.wrong)) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>

          {/* Paper 2 Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Paper - II (Technical Domain)
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {candidateInfo.subject || 'Domain Knowledge'} Discipline
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {paper2Score.marks}
                </span>
                <span className="text-xs text-slate-500 block">/ {paper2Score.maxMarks} Marks</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-emerald-600 font-semibold block">Correct</span>
                <span className="text-lg font-bold text-emerald-700">{paper2Score.correct}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-rose-600 font-semibold block">Incorrect</span>
                <span className="text-lg font-bold text-rose-700">{paper2Score.wrong}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block">Skipped</span>
                <span className="text-lg font-bold text-slate-700">{paper2Score.unattempted}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>Paper 2 Accuracy</span>
              <span className="font-bold text-slate-800">
                {paper2Score.correct + paper2Score.wrong > 0
                  ? ((paper2Score.correct / (paper2Score.correct + paper2Score.wrong)) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
