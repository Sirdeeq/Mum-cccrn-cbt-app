import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { Role, PracticeMode, Question, ExamAttempt } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { shuffleArray } from '../utils/shuffle';
import {
  BookOpen,
  Clock,
  Zap,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Briefcase
} from 'lucide-react';

export const PracticeModePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { candidate } = useCandidate();

  const roleIdParam = searchParams.get('role') || localStorage.getItem('cccrn_selected_role') || 'client_navigator';
  const [role, setRole] = useState<Role | null>(null);
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('mock');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [includeSupplementary, setIncludeSupplementary] = useState<boolean>(true);
  const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0);
  const [practicedQuestionsCount, setPracticedQuestionsCount] = useState<number>(0);
  const [unpracticedQuestionsCount, setUnpracticedQuestionsCount] = useState<number>(0);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    if (!candidate) {
      navigate('/');
      return;
    }

    const loadRoleAndStats = async () => {
      const foundRole = await db.roles.get(roleIdParam);
      if (foundRole) setRole(foundRole);

      // Check how many questions this candidate has already practiced in study or quick modes
      const attempts = await db.examAttempts
        .where('candidateId')
        .equals(candidate.id!)
        .filter((a) => a.roleId === roleIdParam)
        .toArray();

      const practicedQIds = new Set<string>();
      attempts.forEach((att) => {
        att.questionIds.forEach((qid) => practicedQIds.add(qid));
        Object.keys(att.answers || {}).forEach((qid) => practicedQIds.add(qid));
      });

      // Calculate total questions available for role
      const allQ = await db.questions.where('roleId').equals(roleIdParam).toArray();
      const unpracticedCount = allQ.filter((q) => !practicedQIds.has(q.id)).length;

      setPracticedQuestionsCount(practicedQIds.size);
      setUnpracticedQuestionsCount(unpracticedCount);

      // Check wrong answers
      const qMap = new Map(allQ.map((q) => [q.id, q.correctAnswer]));
      const missedQIds = new Set<string>();

      attempts
        .filter((a) => a.status === 'completed')
        .forEach((att) => {
          Object.entries(att.answers || {}).forEach(([qid, ans]) => {
            const correct = qMap.get(qid);
            if (correct && ans !== correct) {
              missedQIds.add(qid);
            }
          });
        });

      setWrongAnswersCount(missedQIds.size);
    };

    loadRoleAndStats();
  }, [candidate, roleIdParam, navigate]);

  const handleStartSession = async () => {
    if (!candidate || !role || isCreating) return;
    setIsCreating(true);

    try {
      // 1. Fetch questions for this role
      let query = db.questions.where('roleId').equals(role.id);
      let allQuestions = await query.toArray();

      if (!includeSupplementary) {
        allQuestions = allQuestions.filter((q) => q.source !== 'bridge_supplementary');
      }

      let selectedQuestions: Question[] = [];

      if (selectedMode === 'wrong_answers') {
        // Collect wrong questions
        const attempts = await db.examAttempts
          .where('candidateId')
          .equals(candidate.id!)
          .filter((a) => a.roleId === role.id && a.status === 'completed')
          .toArray();

        const wrongFreqMap: Record<string, number> = {};
        const qMap = new Map(allQuestions.map((q) => [q.id, q.correctAnswer]));

        attempts.forEach((att) => {
          Object.entries(att.answers || {}).forEach(([qid, ans]) => {
            const correct = qMap.get(qid);
            if (correct && ans !== correct) {
              wrongFreqMap[qid] = (wrongFreqMap[qid] || 0) + 1;
            }
          });
        });

        // Sort by frequency of error (most missed first)
        const sortedWrongIds = Object.keys(wrongFreqMap).sort(
          (a, b) => wrongFreqMap[b] - wrongFreqMap[a]
        );

        const questionDict = new Map(allQuestions.map((q) => [q.id, q]));
        selectedQuestions = sortedWrongIds
          .map((id) => questionDict.get(id))
          .filter((q): q is Question => !!q);

        if (selectedQuestions.length === 0) {
          alert('You have no incorrect answers saved yet! Try a Mock Exam or Quick Practice first.');
          setIsCreating(false);
          return;
        }
      } else if (selectedMode === 'quick') {
        // Quick practice: 10 random questions
        const shuffled = shuffleArray(allQuestions);
        selectedQuestions = shuffled.slice(0, 10);
      } else if (selectedMode === 'mock') {
        // ---------------------------------------------------------------------
        // REAL RECRUITMENT CBT MOCK EXAMINATION ALGORITHM:
        // 1. Give DIFFERENT questions from the ones used in Study Mode or Quick Practice.
        // 2. Emphasize real interview scenario and problem-solving questions.
        // 3. 30 Minutes countdown.
        // ---------------------------------------------------------------------
        const pastAttempts = await db.examAttempts
          .where('candidateId')
          .equals(candidate.id!)
          .filter((a) => a.roleId === role.id)
          .toArray();

        const practicedQIds = new Set<string>();
        pastAttempts.forEach((att) => {
          if (att.mode === 'study' || att.mode === 'quick' || att.mode === 'wrong_answers') {
            att.questionIds.forEach((qid) => practicedQIds.add(qid));
            Object.keys(att.answers || {}).forEach((qid) => practicedQIds.add(qid));
          }
        });

        const unpracticedQuestions = allQuestions.filter((q) => !practicedQIds.has(q.id));
        const practicedQuestions = allQuestions.filter((q) => practicedQIds.has(q.id));

        // Helper to identify real workplace scenario / interview questions
        const isInterviewScenario = (q: Question) => {
          const text = q.questionText.toLowerCase();
          const top = (q.topic || '').toLowerCase();
          return (
            text.includes('worker encounters') ||
            text.includes('which action') ||
            text.includes('what should') ||
            text.includes('how should') ||
            text.includes('first response') ||
            text.includes('client complains') ||
            text.includes('client tells you') ||
            text.includes('referred') ||
            top.includes('scenario') ||
            q.source === 'bridge_supplementary'
          );
        };

        const targetCount = Math.min(questionCount, allQuestions.length);
        let mockPool: Question[] = [];

        if (unpracticedQuestions.length >= targetCount) {
          // We have enough 100% fresh, different questions!
          const unpracticedScenarios = shuffleArray(unpracticedQuestions.filter(isInterviewScenario));
          const unpracticedOthers = shuffleArray(unpracticedQuestions.filter((q) => !isInterviewScenario(q)));

          // Real interview weighting: prioritize realistic workplace scenarios (up to 60%)
          const scenarioQuota = Math.min(Math.floor(targetCount * 0.6), unpracticedScenarios.length);
          const otherQuota = targetCount - scenarioQuota;

          mockPool = [
            ...unpracticedScenarios.slice(0, scenarioQuota),
            ...unpracticedOthers.slice(0, otherQuota)
          ];

          if (mockPool.length < targetCount) {
            const extra = unpracticedScenarios.slice(scenarioQuota);
            mockPool = [...mockPool, ...extra.slice(0, targetCount - mockPool.length)];
          }
        } else {
          // If fewer unpracticed questions remain, use ALL unpracticed questions first
          mockPool = [...unpracticedQuestions];
          // Fill remaining from practiced questions (shuffled)
          const remainingCount = targetCount - mockPool.length;
          const shuffledPracticed = shuffleArray(practicedQuestions);
          mockPool = [...mockPool, ...shuffledPracticed.slice(0, remainingCount)];
        }

        selectedQuestions = shuffleArray(mockPool);
      } else {
        // Study mode: one question at a time in order or shuffled
        selectedQuestions = allQuestions.slice(0, Math.min(questionCount, allQuestions.length));
      }

      // 2. Set deadline: Real recruitment CBT mock is 30 minutes!
      let deadlineAt: number | undefined;
      const now = Date.now();
      if (selectedMode === 'mock') {
        // Official CCCRN format: exactly 30 minutes for 30 questions
        const durationMinutes = questionCount === 30 ? 30 : Math.max(10, questionCount);
        deadlineAt = now + durationMinutes * 60 * 1000;
      }

      // 3. Create exam attempt in Dexie
      const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAttempt: ExamAttempt = {
        id: attemptId,
        candidateId: candidate.id!,
        roleId: role.id,
        mode: selectedMode,
        questionIds: selectedQuestions.map((q) => q.id),
        answers: {},
        markedQuestions: [],
        startedAt: now,
        deadlineAt,
        status: 'in_progress',
        timeSpentSeconds: 0
      };

      await db.examAttempts.add(newAttempt);
      navigate(`/exam/${attemptId}`);
    } catch (err) {
      console.error('Failed to create practice session:', err);
      alert('Could not start practice session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!role) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200">
          Target Position: {role.title}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
          Choose Your Practice Mode
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Use Study Mode and Quick Practice for learning. When you take the Mock Examination, you get fresh questions set up just like the real 30-minute recruitment test.
        </p>
      </div>

      {/* 4 Practice Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mock Exam - Real Interview Simulation */}
        <Card
          hoverable
          selected={selectedMode === 'mock'}
          onClick={() => setSelectedMode('mock')}
          className="p-6 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-primary-900 text-white shadow-sm">
              <Briefcase className="w-6 h-6 text-secondary-400" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">Mock Examination</h3>
                <span className="text-xs font-extrabold px-2.5 py-0.5 bg-secondary-100 text-secondary-900 rounded-full border border-secondary-200">
                  Real 30-Min Test
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Realistic 30-minute CBT recruitment assessment. <strong>Guaranteed different questions:</strong> automatically selects fresh questions you haven't seen in Study Mode, emphasizing workplace scenarios and interview situations.
              </p>
              {unpracticedQuestionsCount > 0 && (
                <div className="text-xs font-semibold text-secondary-700 bg-secondary-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1 border border-secondary-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {unpracticedQuestionsCount} fresh, unseen questions ready for your mock test
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Study Mode */}
        <Card
          hoverable
          selected={selectedMode === 'study'}
          onClick={() => setSelectedMode('study')}
          className="p-6 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Study Mode</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Learning & Guidelines
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Untimed practice with immediate feedback and answer explanations. Answered questions are tracked so your Mock Exam remains fresh with different questions.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Practice */}
        <Card
          hoverable
          selected={selectedMode === 'quick'}
          onClick={() => setSelectedMode('quick')}
          className="p-6 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-900">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Quick Practice</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  10 Questions
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                10 randomly selected questions for quick 10-minute daily revision before the examination. Perfect for short morning or evening practice sessions.
              </p>
            </div>
          </div>
        </Card>

        {/* Revise Mistakes */}
        <Card
          hoverable
          selected={selectedMode === 'wrong_answers'}
          onClick={() => setSelectedMode('wrong_answers')}
          className="p-6 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-900">
              <RotateCcw className="w-6 h-6 text-rose-600" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Revise Mistakes</h3>
                {wrongAnswersCount > 0 && (
                  <span className="text-xs font-extrabold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                    {wrongAnswersCount} saved
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Retest questions you previously got wrong across any study or mock session. Prioritizes the questions you have missed repeatedly.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Options Configuration */}
      {(selectedMode === 'mock' || selectedMode === 'study') && (
        <Card className="p-6 bg-slate-50/70 border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  {selectedMode === 'mock' ? 'Mock Exam Size (Standard: 30 Questions):' : 'Number of Questions:'}
                </label>
                {selectedMode === 'mock' && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    30 questions in 30 minutes mirrors the actual CCCRN BRIDGE-N recruitment examination format.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {[10, 20, 30, 50, 100].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                      questionCount === num
                        ? 'bg-secondary-500 text-white border-secondary-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {role.supplementaryCount && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">
                    Include CCCRN BRIDGE-N Practical Workplace Scenarios (62 Questions):
                  </span>
                  <div className="text-xs text-slate-500">
                    Questions on client follow-up, closed-loop referrals, ART adherence, TB clinic cases, and confidentiality.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={includeSupplementary}
                    onChange={(e) => setIncludeSupplementary(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
                </label>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Start Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleStartSession}
          disabled={isCreating}
          icon={<ArrowRight className="w-5 h-5 ml-2" />}
          className="w-full sm:w-auto px-12 flex-row-reverse"
        >
          {isCreating ? 'Preparing Examination...' : selectedMode === 'mock' ? 'Begin 30-Minute Mock Exam' : 'Start Practice Session'}
        </Button>
      </div>
    </div>
  );
};
