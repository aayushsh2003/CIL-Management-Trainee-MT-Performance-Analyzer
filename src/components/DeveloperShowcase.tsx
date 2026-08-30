import React from 'react';
import { ExternalLink, Code2, Sparkles, Globe, Mail, Github, Linkedin, Briefcase, Award, Terminal } from 'lucide-react';

export const DEVELOPER_URL = 'https://aayush-ki-pehchan.vercel.app/';

export const DeveloperShowcase: React.FC = () => {
  return (
    <section id="developer-section" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 lg:p-10 border border-slate-700 shadow-xl">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left info column */}
        <div className="space-y-4 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Spotlight</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Crafted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">Aayush Sharma</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Full-Stack Developer, Competitive Exam Tech Enthusiast & Creator of modern web tools.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Built with a passion for helping competitive exam aspirants analyze their TCS iON / DigiALM response sheets with precision, deep section-level insights, customizable marking schemes, and AI conceptual tutoring.
          </p>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Stack Web & AI</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>DigiALM Parser Engine</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>React 19 & Tailwind</span>
            </span>
          </div>
        </div>

        {/* Right CTA card */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/80 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center space-y-4 shadow-lg max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xl text-amber-300">
                AS
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 text-base">Aayush Sharma</h3>
              <p className="text-xs text-amber-400 font-mono">aayush-ki-pehchan.vercel.app</p>
            </div>

            <p className="text-xs text-slate-400">
              Explore portfolio projects, engineering blogs, resume, and contact channels.
            </p>

            <div className="w-full space-y-2 pt-1">
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition transform hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Developer Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href="mailto:aayushsharma4437@gmail.com"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-600/50 transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact via Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
