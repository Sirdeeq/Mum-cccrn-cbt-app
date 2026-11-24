import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { organizationInfo, roleStudyGuides } from '../data/studyResources';
import { glossaryItems, GlossaryItem } from '../data/glossaryData';
import { examTraps, interviewQuestions } from '../data/examTrapsData';
import {
  BookOpen,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Database,
  FlaskConical,
  Activity,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Bookmark,
  Search,
  Printer,
  FileText,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Glossary search & filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedGuide = roleStudyGuides.find((g) => g.id === activeTab);

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'data_assistant':
        return <Database className="w-5 h-5 text-primary-700" />;
      case 'lab_optimizer':
        return <FlaskConical className="w-5 h-5 text-emerald-700" />;
      case 'testing_assistant':
        return <Activity className="w-5 h-5 text-sky-700" />;
      case 'health_qi_optimizer':
        return <TrendingUp className="w-5 h-5 text-indigo-700" />;
      case 'client_navigator':
      default:
        return <HeartHandshake className="w-5 h-5 text-rose-700" />;
    }
  };

  // Filter glossary
  const categories = ['All', 'HIV/AIDS', 'Tuberculosis', 'Malaria', 'MNCH', 'Data & M&E', 'Laboratory', 'Quality Improvement', 'General Public Health'];
  const filteredGlossary = glossaryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      item.term.toLowerCase().includes(query) ||
      (item.fullName && item.fullName.toLowerCase().includes(query)) ||
      item.definition.toLowerCase().includes(query) ||
      item.practicalRelevance.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:p-0 print:max-w-none">
      {/* Top Banner Header (Hidden when printing) */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-xs sm:text-sm font-semibold border border-secondary-500/30">
              <BookOpen className="w-4 h-4" />
              Complete CCCRN BRIDGE-N Learning & Examination Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Study Guides & Preparation Notes
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Equip yourself with comprehensive knowledge about CCCRN, public health acronyms, role standard operating procedures, tricky exam traps, and interview strategies.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-700 text-slate-200 hover:text-white border border-primary-600 transition-colors text-sm font-semibold shadow-sm"
            title="Print or Save this study guide as PDF"
          >
            <Printer className="w-4 h-4 text-secondary-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Tab Navigation Sections */}
        <div className="pt-6 mt-6 border-t border-primary-700/60 space-y-3">
          {/* Main Resource Categories */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            General Preparation Resources
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => handleSelectTab('about')}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === 'about'
                  ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                  : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
              }`}
            >
              About CCCRN & BRIDGE-N
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('glossary')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === 'glossary'
                  ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                  : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Acronyms & Glossary ({glossaryItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('exam_traps')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === 'exam_traps'
                  ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                  : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>10 CBT Exam Traps</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('interview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === 'interview'
                  ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                  : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Interview & Oral Prep</span>
            </button>
          </div>

          {/* Role Guides */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
            Role-Specific Study Notes
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {roleStudyGuides.map((guide) => {
              const isCurrent = activeTab === guide.id;
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => handleSelectTab(guide.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                    isCurrent
                      ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                      : 'bg-primary-800/70 text-slate-300 border-primary-700/80 hover:text-white hover:bg-primary-700'
                  }`}
                >
                  <span>{guide.roleTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: About CCCRN & BRIDGE-N */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-fade-in">
          {/* Org Profile Card */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200">
                  Implementing Organization
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900 mt-2">
                  {organizationInfo.fullName} ({organizationInfo.acronym})
                </h2>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <strong className="text-slate-900 font-bold">Mission: </strong>
              {organizationInfo.mission}
            </p>

            {/* BRIDGE-N Acronym Highlight */}
            <div className="p-6 rounded-2xl bg-secondary-50 border-2 border-secondary-300/80 text-secondary-950 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-secondary-800">
                <ShieldCheck className="w-5 h-5 text-secondary-600" />
                What does BRIDGE-N stand for?
              </div>
              <div className="text-xl sm:text-2xl font-black text-secondary-950 leading-snug">
                {organizationInfo.bridgeNMeaning}
              </div>
              <p className="text-xs sm:text-sm text-secondary-800 pt-1">
                This acronym and its four health pillars are frequently asked in recruitment examinations.
              </p>
            </div>

            {/* 4 Health Pillars Grid */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xl font-bold text-slate-900">
                The Four Core Health Intervention Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizationInfo.corePillars.map((pillar, idx) => (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-900 font-extrabold text-xs flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{pillar.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Exam Strategy & Format Card */}
          <Card className="p-6 sm:p-8 space-y-6 border-2 border-primary-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-primary-100 text-primary-900">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Official CBT Examination Strategy & Pacing
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Based on the CCCRN recruitment invitation notice
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">Duration</div>
                <div className="text-2xl font-black text-primary-900">30 Minutes</div>
                <div className="text-xs text-slate-500 mt-1">Strict automatic countdown</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">Question Target</div>
                <div className="text-2xl font-black text-secondary-600">30 Questions</div>
                <div className="text-xs text-slate-500 mt-1">1 minute per question pacing</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">Scoring Rule</div>
                <div className="text-2xl font-black text-slate-900">No Negative Marking</div>
                <div className="text-xs text-slate-500 mt-1">Always guess if unsure</div>
              </div>
            </div>

            {/* Strategic Advice List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-base">Recommended 30-Minute Examination Plan:</h4>
              <div className="space-y-2.5">
                {organizationInfo.examFormatInfo.recommendedStrategy.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center print:hidden">
              <Link to="/roles">
                <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5 ml-2" />} className="flex-row-reverse">
                  Select a Position & Start Practicing
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* TAB: Acronyms & Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200">
                  Quick Reference Dictionary
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900 mt-2">
                  Public Health Terms & Acronyms
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Master the essential abbreviations and terms used across all CCCRN CBT examination questions.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search acronym or term..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Glossary Items List */}
            <div className="space-y-3 pt-2">
              {filteredGlossary.length > 0 ? (
                filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-secondary-400 transition-colors shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-primary-900">{item.term}</span>
                        {item.fullName && (
                          <span className="text-sm font-semibold text-slate-600">
                            — {item.fullName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.definition}
                    </p>

                    <div className="p-3 rounded-xl bg-secondary-50/70 border border-secondary-200/80 text-xs text-secondary-950 font-medium flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-secondary-900">Why it matters in CBT & Interviews: </strong>
                        {item.practicalRelevance}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700">No matching terms found</p>
                  <p className="text-xs">Try searching with a different word or clearing the filter.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB: 10 CBT Exam Traps */}
      {activeTab === 'exam_traps' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Examination Strategy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900 mt-2">
                Top 10 High-Yield CBT Exam Traps
              </h2>
              <p className="text-sm text-slate-600">
                Learn the common question patterns, trick questions, and distractor traps designed to confuse unprepared candidates.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {examTraps.map((trap) => (
                <div
                  key={trap.number}
                  className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 space-y-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center shrink-0">
                      #{trap.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{trap.title}</h3>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {trap.trapDescription}
                      </p>
                    </div>
                  </div>

                  {/* Sample Question Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Model Examination Question:
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-slate-900">
                      {trap.exampleQuestion.question}
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {trap.exampleQuestion.options.map((opt) => {
                        const isCorrect = opt.key === trap.exampleQuestion.correctAnswer;
                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-lg text-xs sm:text-sm font-medium border flex items-start gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                      <strong className="text-emerald-900 font-bold">Explanation: </strong>
                      {trap.exampleQuestion.explanation}
                    </div>
                  </div>

                  {/* Key Takeaway */}
                  <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-200 text-xs sm:text-sm text-primary-950 font-medium flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-primary-900 font-bold">Key Rule to Remember: </strong>
                      {trap.keyTakeaway}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB: Interview & Oral Prep */}
      {activeTab === 'interview' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Oral & Competency Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900 mt-2">
                Recruitment Interview & Oral Exam Guide
              </h2>
              <p className="text-sm text-slate-600">
                Prepare for the interview panel using the proven STAR framework (Situation, Task, Action, Result) tailored specifically to CCCRN healthcare projects.
              </p>
            </div>

            {/* The STAR Method Explainer */}
            <div className="p-5 rounded-2xl bg-secondary-50 border border-secondary-200 text-secondary-950 space-y-3">
              <h3 className="font-bold text-base text-secondary-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary-600" />
                How to Answer Competency Questions Using STAR:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-white border border-secondary-200">
                  <div className="font-black text-secondary-700 text-base mb-1">S - Situation</div>
                  <p className="text-slate-600">Briefly set the context and describe the workplace challenge or client scenario.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-secondary-200">
                  <div className="font-black text-secondary-700 text-base mb-1">T - Task</div>
                  <p className="text-slate-600">Explain your specific responsibility and what needed to be achieved.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-secondary-200">
                  <div className="font-black text-secondary-700 text-base mb-1">A - Action</div>
                  <p className="text-slate-600">Detail the practical, ethical, client-centered steps you personally took.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-secondary-200">
                  <div className="font-black text-secondary-700 text-base mb-1">R - Result</div>
                  <p className="text-slate-600">Share the positive clinical or operational outcome and what was learned.</p>
                </div>
              </div>
            </div>

            {/* Model Interview Questions */}
            <div className="space-y-6 pt-2">
              {interviewQuestions.map((iq, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 space-y-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                      Competency: {iq.competency}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 pt-1">
                      "{iq.question}"
                    </h3>
                    <p className="text-xs text-slate-500 italic">
                      <strong>What the panel looks for: </strong>{iq.whatPanelLooksFor}
                    </p>
                  </div>

                  {/* STAR Answer Breakdown */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs uppercase font-bold text-secondary-700 tracking-wider">
                      Model STAR Response:
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <div>
                        <strong className="text-slate-900">Situation: </strong>
                        {iq.starModelAnswer.situation}
                      </div>
                      <div>
                        <strong className="text-slate-900">Task: </strong>
                        {iq.starModelAnswer.task}
                      </div>
                      <div>
                        <strong className="text-slate-900">Action: </strong>
                        {iq.starModelAnswer.action}
                      </div>
                      <div>
                        <strong className="text-slate-900">Result: </strong>
                        {iq.starModelAnswer.result}
                      </div>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 font-bold">Interview Tip: </strong>
                      {iq.proTip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2 to 6: Role Specific Study Guide */}
      {selectedGuide && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
                  {getRoleIcon(selectedGuide.id)}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role Study Guide
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {selectedGuide.roleTitle}
                  </h2>
                </div>
              </div>

              <Link to={`/practice?role=${selectedGuide.id}`} className="print:hidden">
                <Button variant="secondary" size="md" icon={<ArrowRight className="w-4 h-4 ml-1" />} className="flex-row-reverse">
                  Practice {selectedGuide.roleTitle}
                </Button>
              </Link>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {selectedGuide.overview}
            </p>

            {/* Key Responsibilities */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">Key Responsibilities & Scope of Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {selectedGuide.keyResponsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Core Topics Cards */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-primary-900">
              Core Study Topics & Standard Operating Procedures
            </h3>

            <div className="space-y-4">
              {selectedGuide.coreTopics.map((topic, idx) => (
                <Card key={idx} className="p-6 sm:p-7 space-y-4 border-2 border-slate-200">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary-600" />
                      {topic.title}
                    </h4>
                    <p className="text-sm text-slate-500">{topic.summary}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {topic.keyPoints.map((point, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-sm sm:text-base text-slate-700 leading-relaxed flex items-start gap-3"
                      >
                        <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-1" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {topic.practicalTip && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-medium flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-emerald-900">Practical Field Tip: </strong>
                        {topic.practicalTip}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Examination Tips Card */}
          <Card className="p-6 sm:p-8 space-y-4 bg-primary-900 text-white rounded-3xl">
            <div className="flex items-center gap-2.5 text-secondary-300 font-bold text-sm uppercase tracking-wider">
              <Award className="w-5 h-5 text-secondary-400" />
              Examination Success Strategy for {selectedGuide.roleTitle}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              High-Yield Revision Points
            </h3>
            <div className="space-y-2.5 pt-2">
              {selectedGuide.examTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-primary-800/80 border border-primary-700 text-sm text-slate-200 leading-relaxed flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 print:hidden">
              <Link to={`/practice?role=${selectedGuide.id}`} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth icon={<ArrowRight className="w-5 h-5 ml-2" />} className="flex-row-reverse">
                  Take a 30-Minute Mock Test Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
