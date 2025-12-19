import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Levels from './pages/Levels';
import Login from './pages/Login';
import TypingTest from './components/TypingTest';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TestResult } from './types';
import { getRank, MILESTONES } from './constants';

// Protected Route Component
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Wrapper for Typing Page to handle modal state locally
const TypingPage: React.FC = () => {
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ isLevelUp: boolean, newLevel: number }>({ isLevelUp: false, newLevel: 0 });

  const handleComplete = (result: TestResult, isLevelUp: boolean = false, newLevel: number = 0) => {
    setLastResult(result);
    setLevelUpData({ isLevelUp, newLevel });
  };

  const currentRank = levelUpData.isLevelUp ? getRank(levelUpData.newLevel) : null;
  const unlockedCertificate = levelUpData.isLevelUp 
    ? MILESTONES.find(m => m.requiredLevel === levelUpData.newLevel) 
    : null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center pt-10">
       <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Speed Test</h2>
       <TypingTest onComplete={handleComplete} />
       
       {/* Result Modal Overlay */}
       {lastResult && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-bounce-in relative overflow-hidden`}>
              {/* Level Up Background Effect */}
              {levelUpData.isLevelUp && (
                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-300 to-purple-500 animate-pulse"></div>
                  </div>
              )}

              <div className="relative z-10 text-center mb-6">
                {levelUpData.isLevelUp ? (
                     <div className="mb-4 animate-bounce">
                        <i className={`fa-solid ${currentRank?.icon || 'fa-star'} text-6xl text-yellow-500 drop-shadow-lg`}></i>
                        <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mt-2">LEVEL UP!</h3>
                        <p className="text-slate-600 dark:text-slate-300 font-bold mt-1">You are now a <span className="text-primary">{currentRank?.title}</span> (Lvl {levelUpData.newLevel})</p>
                        
                        {unlockedCertificate && (
                            <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/40 p-2 rounded-lg inline-block border border-indigo-200 dark:border-indigo-700 animate-pulse">
                                <span className="text-indigo-600 dark:text-indigo-300 text-sm font-bold flex items-center gap-2">
                                    <i className="fa-solid fa-certificate"></i>
                                    New Certificate Unlocked!
                                </span>
                            </div>
                        )}
                     </div>
                ) : (
                    <>
                        <i className="fa-solid fa-crown text-5xl text-yellow-400 mb-4"></i>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Test Complete!</h3>
                    </>
                )}
              </div>
              
              <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                    <p className="text-slate-500 text-xs uppercase">Speed</p>
                    <p className="text-3xl font-bold text-primary">{lastResult.wpm} <span className="text-sm text-slate-400 font-normal">WPM</span></p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                    <p className="text-slate-500 text-xs uppercase">Accuracy</p>
                    <p className="text-3xl font-bold text-secondary">{lastResult.accuracy}%</p>
                 </div>
              </div>
              
              <div className="relative z-10 text-center mb-8">
                <p className="text-slate-600 dark:text-slate-300">
                  You earned <strong className="text-purple-500">+{lastResult.xpEarned} XP</strong>
                </p>
              </div>

              <div className="relative z-10 flex gap-4">
                 <button 
                   onClick={() => setLastResult(null)} 
                   className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                 >
                   Try Again
                 </button>
                 <button 
                    onClick={() => { setLastResult(null); window.location.hash = "#/dashboard"; }}
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                 >
                   Dashboard
                 </button>
              </div>
            </div>
         </div>
       )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/test" 
                  element={
                    <RequireAuth>
                      <TypingPage />
                    </RequireAuth>
                  } 
                />
                <Route path="/levels" element={<Levels />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  } 
                />
                <Route path="/login" element={<Login initialIsLogin={true} />} />
                <Route path="/signup" element={<Login initialIsLogin={false} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;