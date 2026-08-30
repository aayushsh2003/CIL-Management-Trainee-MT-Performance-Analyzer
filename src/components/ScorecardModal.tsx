import React from 'react';
import { AssessmentResult, MarkingScheme } from '../types';
import { X, Printer, Award, CheckCircle, XCircle, HelpCircle, Download, ExternalLink, FileText } from 'lucide-react';
import { DEVELOPER_URL } from './DeveloperShowcase';

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

  // Direct browser print
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error('Print error:', e);
      handleOpenPrintWindow();
    }
  };

  // Generate self-contained standalone printable HTML (bulletproof for iframes)
  const generateStandaloneHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scorecard - ${data.candidateInfo.participantName || 'Candidate'} (${data.candidateInfo.participantId || 'CIL-MT'})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #fff; color: #0f172a; padding: 24px; font-size: 13px; line-height: 1.5; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { display: inline-block; background: #0f172a; color: #f59e0b; font-weight: 900; font-size: 20px; padding: 6px 14px; border-radius: 8px; margin-bottom: 8px; }
    h1 { font-size: 20px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 4px; }
    .subtitle { font-size: 12px; font-weight: 600; color: #475569; }
    
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .label { font-size: 11px; color: #64748b; display: block; text-transform: uppercase; font-weight: 600; }
    .val { font-size: 13px; font-weight: 700; color: #0f172a; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .stat-box { padding: 12px; border-radius: 8px; text-align: center; }
    .stat-total { background: #0f172a; color: #fff; }
    .stat-total .val { color: #f59e0b; font-size: 22px; font-weight: 900; }
    .stat-correct { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
    .stat-correct .val { color: #047857; font-size: 22px; font-weight: 900; }
    .stat-wrong { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; }
    .stat-wrong .val { color: #be123c; font-size: 22px; font-weight: 900; }
    .stat-acc { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; }
    .stat-acc .val { color: #1e293b; font-size: 22px; font-weight: 900; }
    
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 10px; border: 1px solid #cbd5e1; }
    td { padding: 10px; border: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .badge-correct { color: #047857; font-weight: 700; }
    .badge-wrong { color: #be123c; font-weight: 700; }
    
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
    .btn-print { background: #f59e0b; color: #000; font-weight: bold; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 16px; }
    
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="no-print" style="margin-bottom: 16px; text-align: right;">
      <button class="btn-print" onclick="window.print()">🖨️ Print this Scorecard</button>
    </div>

    <div class="header">
      <div class="logo">CIL</div>
      <h1>Coal India Limited (CIL) - Management Trainee</h1>
      <div class="subtitle">Computer Based Test (CBT) Assessment Scorecard & Performance Audit</div>
    </div>

    <div class="card grid-2">
      <div>
        <span class="label">Candidate Name</span>
        <div class="val">${data.candidateInfo.participantName || 'N/A'}</div>
      </div>
      <div>
        <span class="label">Participant / Roll ID</span>
        <div class="val">${data.candidateInfo.participantId || 'N/A'}</div>
      </div>
      <div>
        <span class="label">Exam Date & Time</span>
        <div class="val">${data.candidateInfo.testDate} (${data.candidateInfo.testTime})</div>
      </div>
      <div>
        <span class="label">Subject / Discipline</span>
        <div class="val">${data.candidateInfo.subject || 'CIL MT'}</div>
      </div>
      <div style="grid-column: span 2;">
        <span class="label">Test Center Venue</span>
        <div class="val">${data.candidateInfo.testCenterName || 'TCS iON Test Center'}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-box stat-total">
        <span class="label" style="color: #f59e0b;">Total Marks</span>
        <div class="val">${data.totalMarksObtained}</div>
        <span style="font-size: 10px; color: #94a3b8;">Out of ${data.totalMaxMarks}</span>
      </div>
      <div class="stat-box stat-correct">
        <span class="label" style="color: #065f46;">Correct</span>
        <div class="val">${data.totalCorrect}</div>
        <span style="font-size: 10px; color: #047857;">Questions</span>
      </div>
      <div class="stat-box stat-wrong">
        <span class="label" style="color: #9f1239;">Incorrect</span>
        <div class="val">${data.totalIncorrect}</div>
        <span style="font-size: 10px; color: #be123c;">Questions</span>
      </div>
      <div class="stat-box stat-acc">
        <span class="label">Accuracy</span>
        <div class="val">${data.overallAccuracy}%</div>
        <span style="font-size: 10px; color: #64748b;">Attempt: ${((data.totalAttempted / data.totalQuestions) * 100).toFixed(1)}%</span>
      </div>
    </div>

    <div style="margin-top: 16px;">
      <strong style="font-size: 13px; text-transform: uppercase; color: #1e293b;">Section-wise Detailed Performance</strong>
      <table>
        <thead>
          <tr>
            <th>Section Name</th>
            <th class="text-center">Total Qs</th>
            <th class="text-center" style="color: #047857;">Correct</th>
            <th class="text-center" style="color: #be123c;">Wrong</th>
            <th class="text-center">Skipped</th>
            <th class="text-center">Accuracy</th>
            <th class="text-right">Marks</th>
          </tr>
        </thead>
        <tbody>
          ${data.sections
            .map(
              (sec) => `
            <tr>
              <td><strong>${sec.name}</strong></td>
              <td class="text-center">${sec.questionsCount}</td>
              <td class="text-center badge-correct">${sec.correct}</td>
              <td class="text-center badge-wrong">${sec.incorrect}</td>
              <td class="text-center" style="color: #64748b;">${sec.unattempted}</td>
              <td class="text-center"><strong>${sec.accuracy}%</strong></td>
              <td class="text-right"><strong>${sec.marksObtained}</strong> / ${sec.maxMarks}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Marking Scheme: ${markingScheme.name} (+${markingScheme.correctMarks} / -${markingScheme.negativeMarks})</span>
      <span>Evaluated via DigiALM Analyzer • ${new Date().toLocaleDateString()}</span>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto-trigger print on new window load
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
  };

  // Open standalone print tab (perfect for iframe setups)
  const handleOpenPrintWindow = () => {
    const html = generateStandaloneHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      // Fallback to data URI download
      handleDownloadHtml();
    }
  };

  // Download printable HTML report directly
  const handleDownloadHtml = () => {
    const html = generateStandaloneHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Scorecard_${data.candidateInfo.participantName || 'CIL'}_${data.candidateInfo.participantId || 'Roll'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="scorecard-modal-backdrop fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="scorecard-modal-container bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top action header (hidden during print) */}
        <div className="print:hidden bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Official Assessment Scorecard & Performance Audit</span>
            <span className="sm:hidden">Official Scorecard</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-sm"
              title="Print directly or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleOpenPrintWindow}
              className="hidden sm:inline-flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition items-center space-x-1.5"
              title="Open standalone printable sheet in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Open in Tab</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="Download HTML Scorecard File"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Content (Scrollable on small screens) */}
        <div className="scorecard-printable-area p-4 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-white print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-black text-xl mx-auto flex items-center justify-center mb-2 shadow-sm">
              CIL
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
              Coal India Limited (CIL) - Management Trainee
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Computer Based Test (CBT) Assessment Scorecard & Performance Audit
            </p>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Candidate Name:</span>
              <strong className="text-slate-900 text-sm font-bold">{data.candidateInfo.participantName || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Participant / Roll ID:</span>
              <strong className="text-slate-900 text-sm font-mono font-bold">{data.candidateInfo.participantId || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Exam Date & Time:</span>
              <span className="text-slate-800 font-semibold">{data.candidateInfo.testDate} ({data.candidateInfo.testTime})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Subject / Discipline:</span>
              <span className="text-slate-800 font-semibold">{data.candidateInfo.subject || 'CIL MT'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-medium block">Test Venue:</span>
              <span className="text-slate-800 font-semibold">{data.candidateInfo.testCenterName || 'TCS iON Test Center'}</span>
            </div>
          </div>

          {/* Overall Marks Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Total Marks</span>
              <strong className="text-2xl font-black text-white">{data.totalMarksObtained}</strong>
              <span className="text-[10px] text-slate-400 block">Out of {data.totalMaxMarks}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider block">Correct</span>
              <strong className="text-2xl font-black text-emerald-700">{data.totalCorrect}</strong>
              <span className="text-[10px] text-emerald-600 block">Questions</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-rose-700 uppercase font-bold tracking-wider block">Incorrect</span>
              <strong className="text-2xl font-black text-rose-700">{data.totalIncorrect}</strong>
              <span className="text-[10px] text-rose-600 block">Questions</span>
            </div>
            <div className="bg-slate-100 border border-slate-200 text-slate-900 p-3.5 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">Accuracy</span>
              <strong className="text-2xl font-black text-slate-800">{data.overallAccuracy}%</strong>
              <span className="text-[10px] text-slate-500 block">Attempt: {((data.totalAttempted / data.totalQuestions) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Sectional Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Section-wise Detailed Performance
              </h3>
              <span className="text-[11px] text-slate-500">200 Total Questions</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5 sm:p-3">Section Name</th>
                    <th className="p-2.5 sm:p-3 text-center">Total Qs</th>
                    <th className="p-2.5 sm:p-3 text-center text-emerald-700">Correct</th>
                    <th className="p-2.5 sm:p-3 text-center text-rose-700">Wrong</th>
                    <th className="p-2.5 sm:p-3 text-center text-slate-600">Skipped</th>
                    <th className="p-2.5 sm:p-3 text-center">Accuracy</th>
                    <th className="p-2.5 sm:p-3 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {data.sections.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 sm:p-3 font-semibold text-slate-800">{sec.name}</td>
                      <td className="p-2.5 sm:p-3 text-center">{sec.questionsCount}</td>
                      <td className="p-2.5 sm:p-3 text-center font-bold text-emerald-700">{sec.correct}</td>
                      <td className="p-2.5 sm:p-3 text-center font-bold text-rose-700">{sec.incorrect}</td>
                      <td className="p-2.5 sm:p-3 text-center text-slate-500">{sec.unattempted}</td>
                      <td className="p-2.5 sm:p-3 text-center font-bold text-slate-800">{sec.accuracy}%</td>
                      <td className="p-2.5 sm:p-3 text-right font-black text-slate-900">{sec.marksObtained} / {sec.maxMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluation Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>Marking Scheme Applied: <strong className="text-slate-700">{markingScheme.name} (+{markingScheme.correctMarks} / -{markingScheme.negativeMarks})</strong></span>
            <span>Evaluated via DigiALM Analyzer • {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Modal bottom bar on mobile / desktop */}
        <div className="print:hidden bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
          <span>Tip: Use "Print / PDF" to save or print on standard A4 paper.</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenPrintWindow}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 transition flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Tab</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition shadow-xs flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scorecard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
