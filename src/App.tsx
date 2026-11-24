import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateProvider } from './contexts/CandidateContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { seedDatabase } from './db/seed';

import { Header } from './components/common/Header';
import { WelcomePage } from './pages/WelcomePage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { PracticeModePage } from './pages/PracticeModePage';
import { DashboardPage } from './pages/DashboardPage';
import { ExamPage } from './pages/ExamPage';
import { ResultsPage } from './pages/ResultsPage';
import { ReviewPage } from './pages/ReviewPage';
import { WrongAnswersPage } from './pages/WrongAnswersPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ResourcesPage } from './pages/ResourcesPage';

export const App: React.FC = () => {
  useEffect(() => {
    // Idempotently seed question banks on first app launch
    seedDatabase().catch((err) => {
      console.error('Failed to initialize local IndexedDB question banks:', err);
    });
  }, []);

  return (
    <PreferencesProvider>
      <CandidateProvider>
        <OfflineProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
              <Header />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/roles" element={<RoleSelectionPage />} />
                  <Route path="/practice" element={<PracticeModePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/exam/:attemptId" element={<ExamPage />} />
                  <Route path="/results/:attemptId" element={<ResultsPage />} />
                  <Route path="/review/:attemptId" element={<ReviewPage />} />
                  <Route path="/wrong-answers" element={<WrongAnswersPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </OfflineProvider>
      </CandidateProvider>
    </PreferencesProvider>
  );
};

export default App;
