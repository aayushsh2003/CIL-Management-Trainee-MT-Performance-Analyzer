import React from 'react';
import { AssessmentResult, MarkingScheme } from '../types';
import { X, Printer, Award, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AssessmentResult;
  markingScheme: MarkingScheme;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  isOpen,
  onClose,
  data,
  markingScheme,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top action header (hidden during print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Candidate Official Performance Scorecard</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Content */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xl mx-auto flex items-center justify-center mb-2">
              CIL
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
              Coal India Limited (CIL) - Management Trainee
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Computer Based Test (CBT) Assessment Scorecard & Performance Summary
            </p>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block">Candidate Name:</span>
              <strong className="text-slate-900 text-sm">{data.candidateInfo.participantName || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Participant / Roll ID:</span>
              <strong className="text-slate-900 text-sm font-mono">{data.candidateInfo.participantId || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Exam Date & Time:</span>
              <span className="text-slate-800 font-medium">{data.candidateInfo.testDate} ({data.candidateInfo.testTime})</span>
            </div>
            <div>
              <span className="text-slate-400 block">Subject / Discipline:</span>
              <span className="text-slate-800 font-medium">{data.candidateInfo.subject || 'CIL MT'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Test Venue:</span>
              <span className="text-slate-800 font-medium">{data.candidateInfo.testCenterName || 'TCS iON Test Center'}</span>
            </div>
          </div>

          {/* Overall Marks Summary */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-900 text-white p-3 rounded-xl">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Total Marks</span>
              <strong className="text-xl font-black">{data.totalMarksObtained}</strong>
              <span className="text-[10px] text-slate-400 block">/ {data.totalMaxMarks}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Correct</span>
              <strong className="text-xl font-black text-emerald-700">{data.totalCorrect}</strong>
              <span className="text-[10px] text-emerald-600 block">Questions</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl">
              <span className="text-[10px] text-rose-700 uppercase font-bold block">Incorrect</span>
              <strong className="text-xl font-black text-rose-700">{data.totalIncorrect}</strong>
              <span className="text-[10px] text-rose-600 block">Questions</span>
            </div>
            <div className="bg-slate-100 border border-slate-200 text-slate-900 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
              <strong className="text-xl font-black text-slate-800">{data.overallAccuracy}%</strong>
              <span className="text-[10px] text-slate-500 block">Attempt Rate: {((data.totalAttempted/data.totalQuestions)*100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Sectional Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Section-wise Detailed Performance
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Section Name</th>
                  <th className="p-2.5 text-center">Total Qs</th>
                  <th className="p-2.5 text-center text-emerald-700">Correct</th>
                  <th className="p-2.5 text-center text-rose-700">Wrong</th>
                  <th className="p-2.5 text-center">Skipped</th>
                  <th className="p-2.5 text-center">Accuracy</th>
                  <th className="p-2.5 text-right">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.sections.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-800">{sec.name}</td>
                    <td className="p-2.5 text-center">{sec.questionsCount}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">{sec.correct}</td>
                    <td className="p-2.5 text-center font-bold text-rose-700">{sec.incorrect}</td>
                    <td className="p-2.5 text-center text-slate-500">{sec.unattempted}</td>
                    <td className="p-2.5 text-center font-bold">{sec.accuracy}%</td>
                    <td className="p-2.5 text-right font-black text-slate-900">{sec.marksObtained} / {sec.maxMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Evaluation Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Marking Scheme Applied: {markingScheme.name}</span>
            <span>Generated on: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
