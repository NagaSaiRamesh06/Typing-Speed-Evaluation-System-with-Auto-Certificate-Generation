import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockBackend';
import { TestResult, Milestone } from '../types';
import { MILESTONES, LEVELS, getRank } from '../constants';
import Certificate from '../components/Certificate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<TestResult[]>([]);
  // activeCertificate is for the Hidden High-Res version (for PDF)
  const [activeCertificate, setActiveCertificate] = useState<Milestone | null>(null);
  // viewingCertificate is for the UI Modal
  const [viewingCertificate, setViewingCertificate] = useState<Milestone | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const h = await mockDb.getHistory();
      setHistory(h);
    };
    fetchHistory();
  }, [user]);

  const checkIsUnlocked = (milestone: Milestone) => {
    if (!user) return false;
    if (milestone.requiredLevel && user.level >= milestone.requiredLevel) return true;
    if (milestone.requiredTests && user.totalTests >= milestone.requiredTests) return true;
    if (milestone.requiredWpm && user.bestWpm >= milestone.requiredWpm) return true;
    return false;
  };

  const downloadCertificate = async (milestone: Milestone) => {
    if (!checkIsUnlocked(milestone)) {
        alert("This certificate is locked.");
        return;
    }

    setIsGenerating(true);
    // Set active to render the hidden high-res component
    setActiveCertificate(milestone);
    
    // Wait for render
    setTimeout(async () => {
      const element = document.getElementById(`cert-${milestone.id}`);
      if (element) {
        try {
          const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); // landscape, mm, a4
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`TypeMaster_Certificate_${milestone.id}.pdf`);
        } catch (err) {
          console.error("Failed to generate PDF", err);
        } finally {
          setActiveCertificate(null);
          setIsGenerating(false);
        }
      } else {
          setIsGenerating(false);
      }
    }, 1000);
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
            <div>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Please Log In</h2>
                <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-lg">Go to Login</Link>
            </div>
        </div>
    );
  }

  // XP & Level Calculation
  const currentRank = getRank(user.level);
  // Find current level floor
  const currentLevelObj = LEVELS.find(l => l.level === user.level);
  const nextLevelObj = LEVELS.find(l => l.level === user.level + 1);
  
  const xpCurrentLevel = currentLevelObj ? currentLevelObj.xp : 0;
  const xpNextLevel = nextLevelObj ? nextLevelObj.xp : (xpCurrentLevel + 10000); // Fallback
  
  // Progress within the current level
  const xpGainedInLevel = user.xp - xpCurrentLevel;
  const xpNeededForLevel = xpNextLevel - xpCurrentLevel;
  
  const progressPercent = Math.min(100, Math.max(0, (xpGainedInLevel / xpNeededForLevel) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400">Track your progress and achievements.</p>
        </div>
        <div className="flex gap-2">
            <a href="#certificates" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <i className="fa-solid fa-certificate mr-2"></i> Jump to Certificates
            </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Main Level Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
           
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                  <p className="text-indigo-100 font-medium text-sm uppercase tracking-wider">Current Rank</p>
                  <h2 className="text-3xl font-bold flex items-center gap-3 mt-1">
                      <i className={`fa-solid ${currentRank.icon}`}></i>
                      {currentRank.title}
                  </h2>
              </div>
              <div className="text-right">
                  <p className="text-indigo-100 text-sm">Level</p>
                  <p className="text-4xl font-extrabold">{user.level}</p>
              </div>
           </div>
           
           <div className="relative z-10">
              <div className="flex justify-between text-xs mb-2 text-indigo-100 font-mono">
                  <span>{user.xp} XP</span>
                  <span>{xpNextLevel} XP</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-white h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
              </div>
              <p className="text-xs mt-2 text-indigo-100 text-right">{Math.round(progressPercent)}% to Level {user.level + 1}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <i className="fa-solid fa-bolt text-xl"></i>
                </div>
                <div>
                <p className="text-sm text-slate-500">Best WPM</p>
                <p className="text-2xl font-bold dark:text-white">{user.bestWpm}</p>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <i className="fa-solid fa-keyboard text-xl"></i>
                </div>
                <div>
                <p className="text-sm text-slate-500">Tests Completed</p>
                <p className="text-2xl font-bold dark:text-white">{user.totalTests}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Certificates Section */}
      <h2 id="certificates" className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2 pt-4">
        <i className="fa-solid fa-certificate text-yellow-500"></i>
        Certificates & Landmarks
      </h2>
      
      {/* Info Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-8 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
              <i className="fa-solid fa-info text-lg"></i>
          </div>
          <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">How to earn Certificates?</h4>
              <p className="text-slate-600 dark:text-slate-300 mt-1 mb-2">
                  Certificates are automatically unlocked when you cross specific landmarks. Keep practicing to unlock them by:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <i className="fa-solid fa-arrow-up-right-dots text-green-500"></i>
                    <span><strong>Ranking Up:</strong> Reach new Levels</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <i className="fa-solid fa-gauge-high text-blue-500"></i>
                    <span><strong>Speed:</strong> Hit WPM milestones</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <i className="fa-solid fa-calendar-check text-purple-500"></i>
                    <span><strong>Consistency:</strong> Complete more tests</span>
                </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {MILESTONES.map((milestone) => {
            const isUnlocked = checkIsUnlocked(milestone);
            
            return (
                <div key={milestone.id} className={`relative p-6 rounded-xl border flex flex-col h-full transition-all duration-300 ${isUnlocked ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale-[0.5]'}`}>
                    <div className="flex flex-col items-center text-center flex-grow">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            <i className={`fa-solid ${milestone.icon} text-3xl ${!isUnlocked && 'text-slate-400'}`}></i>
                        </div>
                        <h3 className="font-bold text-lg mb-1 dark:text-white">{milestone.name}</h3>
                        <p className="text-sm text-slate-500 mb-6">{milestone.description}</p>
                    </div>
                    
                    {isUnlocked ? (
                        <button 
                            onClick={() => setViewingCertificate(milestone)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-eye"></i> View Certificate
                        </button>
                    ) : (
                        <div className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                             <i className="fa-solid fa-lock"></i> Locked
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {/* History Table */}
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Recent Activity</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">WPM</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Accuracy</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">XP</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {history.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {new Date(test.date).toLocaleDateString()} <span className="text-xs text-slate-400">{new Date(test.date).toLocaleTimeString()}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">{test.wpm}</td>
                        <td className="px-6 py-4 font-bold text-secondary">{test.accuracy}%</td>
                        <td className="px-6 py-4 text-sm text-purple-500 font-medium">+{test.xpEarned} XP</td>
                    </tr>
                ))}
            </tbody>
          </table>
        ) : (
            <div className="p-10 text-center text-slate-500">
                <p>No typing tests completed yet.</p>
                <Link to="/test" className="text-primary font-bold hover:underline mt-2 inline-block">Start your first test</Link>
            </div>
        )}
      </div>

      {/* Hidden Certificate for Generating High-Res PDF */}
      {/* Changed logic: using off-screen positioning instead of opacity to ensure html2canvas captures it correctly */}
      {activeCertificate && (
        <div className="fixed top-0 left-[-9999px] z-[-50]">
             <div className="w-[850px] bg-white p-4">
                <Certificate user={user} milestone={activeCertificate} id={`cert-${activeCertificate.id}`} />
             </div>
        </div>
      )}

      {/* Certificate Modal */}
      {viewingCertificate && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !isGenerating && setViewingCertificate(null)}>
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-xl">
                     <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                         <i className="fa-solid fa-award text-yellow-500"></i> {viewingCertificate.name}
                     </h3>
                     <button onClick={() => !isGenerating && setViewingCertificate(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                         <i className="fa-solid fa-times"></i>
                     </button>
                 </div>
                 
                 <div className="p-6 bg-slate-100 dark:bg-slate-900/50 flex justify-center overflow-auto">
                      <div className="transform scale-75 sm:scale-90 md:scale-100 origin-top shadow-lg">
                         <Certificate user={user} milestone={viewingCertificate} id={`view-cert-${viewingCertificate.id}`} />
                      </div>
                 </div>

                 <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-3 rounded-b-xl">
                      <button 
                        onClick={() => setViewingCertificate(null)}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        disabled={isGenerating}
                      >
                          Close
                      </button>
                      <button 
                        onClick={() => downloadCertificate(viewingCertificate)}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-primary hover:bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                      >
                          {isGenerating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-download"></i>}
                          Download PDF
                      </button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;