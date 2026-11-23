import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamSession } from '../hooks/useExamSession';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { Role } from '../types';
import { ExamTimer } from '../components/exam/ExamTimer';
import { QuestionCard } from '../components/exam/QuestionCard';
import { QuestionPalette } from '../components/exam/QuestionPalette';
import { ExamControls } from '../components/exam/ExamControls';
import { SubmitModal } from '../components/exam/SubmitModal';
import { StudyFeedback } from '../components/exam/StudyFeedback';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { AlertCircle, LayoutGrid, ArrowLeft } from 'lucide-react';

export const ExamPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { candidate } = useCandidate();

  const {
    attempt,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    timeRemaining,
    isLoading,
    isSubmitting,
    showWarning5Min,
    showWarning1Min,
    selectAnswer,
    toggleMarkForReview,
    goToNext,
    goToPrevious,
    goToQuestion,
    submitExam
  } = useExamSession(attemptId || '');

  const [role, setRole] = useState<Role | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showMobilePalette, setShowMobilePalette] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load role & bookmarks
  useEffect(() => {
    if (!attempt) return;

    const loadExtra = async () => {
      const r = await db.roles.get(attempt.roleId);
      if (r) setRole(r);

      if (candidate?.id) {
        const bms = await db.bookmarks.where('candidateId').equals(candidate.id).toArray();
        setBookmarkedIds(new Set(bms.map((b) => b.questionId)));
      }
    };

    loadExtra();
  }, [attempt, candidate]);

  // Navigate to results if already completed
  useEffect(() => {
    if (attempt && attempt.status === 'completed') {
      navigate(`/results/${attempt.id}`);
    }
  }, [attempt, navigate]);

  const handleToggleBookmark = async (questionId: string) => {
    if (!candidate?.id) return;
    const isBookmarked = bookmarkedIds.has(questionId);

    if (isBookmarked) {
      await db.bookmarks
        .where('[candidateId+questionId]')
        .equals([candidate.id, questionId])
        .delete();
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await db.bookmarks.add({
        candidateId: candidate.id,
        questionId,
        createdAt: Date.now()
      });
      setBookmarkedIds((prev) => new Set(prev).add(questionId));
    }
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    await submitExam();
    if (attempt) {
      navigate(`/results/${attempt.id}`);
    }
  };

  if (isLoading || !attempt || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading examination environment...</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(attempt.answers).length;
  const isMarked = attempt.markedQuestions.includes(currentQuestion.id);
  const isStudyMode = attempt.mode === 'study';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Examination Status Bar */}
      <div className="bg-primary-900 text-white px-4 sm:px-6 py-3 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Candidate & Position */}
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-secondary-300">
                {role?.title || 'BRIDGE-N Candidate Assessment'}
              </div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{candidate?.fullName}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-800 text-secondary-300 border border-primary-700">
                  {attempt.mode === 'mock'
                    ? 'REAL 30-MIN CBT EXAM'
                    : attempt.mode === 'study'
                    ? 'STUDY MODE (UNTIMED)'
                    : attempt.mode === 'quick'
                    ? 'QUICK PRACTICE (10 Qs)'
                    : 'MISTAKES REVISION'}
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Timer & Mobile Navigator Toggle */}
          <div className="flex items-center gap-3">
            {attempt.mode === 'mock' && (
              <ExamTimer
                secondsLeft={timeRemaining}
                warning5Min={showWarning5Min}
                warning1Min={showWarning1Min}
              />
            )}

            <button
              type="button"
              onClick={() => setShowMobilePalette(!showMobilePalette)}
              className="lg:hidden p-2 rounded-xl bg-primary-800 hover:bg-primary-700 text-white border border-primary-700 flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Toggle Question Navigator"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Palette</span>
            </button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="shadow-md"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Progress bar across full width */}
        <div className="max-w-7xl mx-auto mt-2">
          <ProgressBar
            current={answeredCount}
            total={totalQuestions}
            label={`Question ${currentIndex + 1} of ${totalQuestions}`}
            showPercent={false}
          />
        </div>
      </div>

      {/* Main Examination Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Card + Controls */}
        <div className="flex-1 flex flex-col space-y-6">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={attempt.answers[currentQuestion.id]}
            onSelectAnswer={(key) => selectAnswer(currentQuestion.id, key)}
            isBookmarked={bookmarkedIds.has(currentQuestion.id)}
            onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
            isStudyMode={isStudyMode}
            showFeedback={isStudyMode && !!attempt.answers[currentQuestion.id]}
          />

          {isStudyMode && attempt.answers[currentQuestion.id] && (
            <StudyFeedback
              question={currentQuestion}
              selectedAnswer={attempt.answers[currentQuestion.id]}
            />
          )}

          <ExamControls
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            isMarked={isMarked}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onToggleMark={() => toggleMarkForReview(currentQuestion.id)}
            onSubmit={() => setShowSubmitModal(true)}
            isLastQuestion={currentIndex === totalQuestions - 1}
          />
        </div>

        {/* Right: Question Palette (desktop sidebar) */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-28">
            <QuestionPalette
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answers={attempt.answers}
              markedQuestions={attempt.markedQuestions}
              questionIds={attempt.questionIds}
              onSelectQuestion={goToQuestion}
            />
          </div>
        </div>
      </div>

      {/* Mobile Question Palette Drawer */}
      {showMobilePalette && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-sm h-full p-4 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b mb-4">
                <h3 className="font-bold text-slate-900">Question Navigator</h3>
                <button
                  onClick={() => setShowMobilePalette(false)}
                  className="text-sm font-semibold text-slate-500 p-1"
                >
                  Close
                </button>
              </div>
              <QuestionPalette
                totalQuestions={totalQuestions}
                currentIndex={currentIndex}
                answers={attempt.answers}
                markedQuestions={attempt.markedQuestions}
                questionIds={attempt.questionIds}
                onSelectQuestion={(idx) => {
                  goToQuestion(idx);
                  setShowMobilePalette(false);
                }}
              />
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowMobilePalette(false)}
              >
                Return to Question
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleConfirmSubmit}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        markedCount={attempt.markedQuestions.length}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
