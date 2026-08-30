import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AssessmentResult } from '../types';
import { BarChart3, PieChart as PieIcon, TrendingDown, Target, Lightbulb } from 'lucide-react';

interface AnalyticsChartsProps {
  data: AssessmentResult;
}

const PIE_COLORS = ['#10B981', '#F43F5E', '#94A3B8'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // Chart 1 data: Section Marks & Accuracy
  const sectionBarData = data.sections.map((sec) => ({
    name: sec.name.replace(/^Part\s*\d+\s*/i, '').slice(0, 16),
    fullName: sec.name,
    Marks: sec.marksObtained,
    MaxMarks: sec.maxMarks,
    Accuracy: sec.accuracy,
    Correct: sec.correct,
    Wrong: sec.incorrect,
    Skipped: sec.unattempted,
  }));

  // Chart 2 data: Overall Attempts Pie
  const pieData = [
    { name: 'Correct Answers', value: data.totalCorrect },
    { name: 'Incorrect Attempts', value: data.totalIncorrect },
    { name: 'Unattempted / Skipped', value: data.totalUnattempted },
  ];

  // Key Insights calculation
  const sortedByAccuracy = [...data.sections].sort((a, b) => b.accuracy - a.accuracy);
  const strongestSection = sortedByAccuracy[0];
  const weakestSection = sortedByAccuracy[sortedByAccuracy.length - 1];

  return (
    <div className="space-y-6">
      {/* 1. Quick Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Strongest Subject Area
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {strongestSection?.name || 'N/A'}
            </p>
            <p className="text-xs text-emerald-800 mt-0.5 font-medium">
              {strongestSection?.accuracy}% Accuracy ({strongestSection?.correct}/{strongestSection?.questionsCount} correct)
            </p>
          </div>
        </div>

        <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-800 flex-shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
              Area Requiring Revision
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {weakestSection?.name || 'N/A'}
            </p>
            <p className="text-xs text-rose-800 mt-0.5 font-medium">
              {weakestSection?.incorrect} incorrect answers ({weakestSection?.accuracy}% Accuracy)
            </p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Attempt Efficiency
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {((data.totalAttempted / data.totalQuestions) * 100).toFixed(1)}% Attempt Rate
            </p>
            <p className="text-xs text-amber-800 mt-0.5 font-medium">
              {data.totalAttempted} / {data.totalQuestions} Questions Attempted
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Section Marks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">
                Section-wise Marks & Question Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Scores Obtained</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectionBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value: any, name: any) => [value, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Correct" fill="#10B981" radius={[4, 4, 0, 0]} name="Correct Qs" />
                <Bar dataKey="Wrong" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Incorrect Qs" />
                <Bar dataKey="Skipped" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Unattempted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Question Outcome Share */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <PieIcon className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">
              Overall Response Share
            </h3>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{data.overallAccuracy}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Correct ({data.totalCorrect})</span>
              </div>
              <span className="font-bold text-slate-900">
                {((data.totalCorrect / data.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600">Incorrect ({data.totalIncorrect})</span>
              </div>
              <span className="font-bold text-slate-900">
                {((data.totalIncorrect / data.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-slate-600">Unattempted ({data.totalUnattempted})</span>
              </div>
              <span className="font-bold text-slate-900">
                {((data.totalUnattempted / data.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
