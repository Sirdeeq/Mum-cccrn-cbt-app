import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { organizationInfo, roleStudyGuides, RoleStudyGuide } from '../data/studyResources';
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
  Bookmark
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-xs sm:text-sm font-semibold border border-secondary-500/30">
            <BookOpen className="w-4 h-4" />
            Official Study Materials & Guidelines Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Preparation Notes & Role Guides
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Read comprehensive notes about CCCRN, the BRIDGE-N health pillars, core role standard operating procedures, and 30-minute CBT examination strategies.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-4 border-t border-primary-700/60 no-scrollbar">
          <button
            type="button"
            onClick={() => handleSelectTab('about')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
              activeTab === 'about'
                ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
            }`}
          >
            About CCCRN & BRIDGE-N
          </button>

          {roleStudyGuides.map((guide) => {
            const isCurrent = activeTab === guide.id;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => handleSelectTab(guide.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                  isCurrent
                    ? 'bg-secondary-500 text-white border-secondary-400 shadow-md'
                    : 'bg-primary-800/80 text-slate-300 border-primary-700 hover:text-white hover:bg-primary-700'
                }`}
              >
                <span>{guide.roleTitle}</span>
              </button>
            );
          })}
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
                This acronym and its four pillar components are frequently asked in recruitment examinations.
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

            {/* Bottom CTA to practice */}
            <div className="pt-4 flex justify-center">
              <Link to="/roles">
                <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5 ml-2" />} className="flex-row-reverse">
                  Select a Position & Start Practicing
                </Button>
              </Link>
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

              <Link to={`/practice?role=${selectedGuide.id}`}>
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

          {/* Core Topics Accordion / Cards */}
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

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
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
