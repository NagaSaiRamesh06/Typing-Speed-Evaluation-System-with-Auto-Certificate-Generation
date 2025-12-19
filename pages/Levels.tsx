import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LEVEL_RANKS, LEVELS, MILESTONES } from '../constants';
import { Milestone } from '../types';
import Certificate from '../components/Certificate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Levels: React.FC = () => {
  const { user } = useAuth();
  const currentLevel = user?.level || 0;
  
  // Certificate State
  const [viewingCertificate, setViewingCertificate] = useState<Milestone | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Milestone | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to get XP for a specific level
  const getXpForLevel = (lvl: number) => {
    const levelObj = LEVELS.find(l => l.level === lvl);
    return levelObj ? levelObj.xp : 'Varied';
  };

  const downloadCertificate = async (milestone: Milestone) => {
    if (!user) return;
    setIsGenerating(true);
    setActiveCertificate(milestone);
    
    setTimeout(async () => {
      const element = document.getElementById(`cert-level-${milestone.id}`);
      if (element) {
        try {
          const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Rank Progression</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Level up your typing skills to unlock prestigious titles, badges, and certificates.
        </p>
      </div>

      <div className="relative border-l-4 border-slate-200 dark:border-slate-700 ml-6 md:ml-10 space-y-12 pb-10">
        {LEVEL_RANKS.map((rank, index) => {
          const nextRank = LEVEL_RANKS[index + 1];
          const maxLevel = nextRank ? nextRank.minLevel - 1 : 50;
          
          const isUnlocked = currentLevel >= rank.minLevel;
          const isCurrent = isUnlocked && (!nextRank || currentLevel < nextRank.minLevel);
          const xpRequired = getXpForLevel(rank.minLevel);

          // Find the certificate milestone associated with this rank level
          const milestone = MILESTONES.find(m => m.requiredLevel === rank.minLevel);

          return (
            <div key={rank.title} className={`relative pl-8 md:pl-12 transition-all duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}>
              {/* Timeline Dot */}
              <div className={`absolute -left-[14px] md:-left-[14px] top-0 flex items-center justify-center w-6 h-6 rounded-full border-4 transition-all duration-300 ${isCurrent ? 'bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(99,102,241,0.6)] z-10' : isUnlocked ? 'bg-indigo-400 border-indigo-400 z-0' : 'bg-slate-300 border-slate-300 dark:bg-slate-600 dark:border-slate-600 z-0'}`}></div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isCurrent ? 'bg-white dark:bg-slate-800 border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'}`}>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-inner shrink-0 ${rank.bg} ${rank.color}`}>
                       <i className={`fa-solid ${rank.icon}`}></i>
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                {rank.title} 
                            </h3>
                            {isCurrent && <span className="text-xs bg-primary text-white px-2 py-1 rounded-full uppercase tracking-wider font-bold">Current Rank</span>}
                        </div>
                        <p className="text-slate-500 font-medium">Level {rank.minLevel} - {maxLevel === 50 ? '50+' : maxLevel}</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 bg-slate-50 dark:bg-slate-900/50 p-2 sm:bg-transparent sm:p-0 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Required XP</p>
                        <p className="font-mono font-bold text-slate-700 dark:text-slate-300">{typeof xpRequired === 'number' ? xpRequired.toLocaleString() : xpRequired}</p>
                    </div>
                 </div>
                 
                 <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {isCurrent ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                            You are currently mastering this rank. Keep typing to reach the next tier!
                        </span>
                    ) : isUnlocked ? (
                        <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                            <i className="fa-solid fa-check-circle"></i> Completed
                        </span>
                    ) : (
                        <span>
                            Reach Level {rank.minLevel} to unlock the <strong>{rank.title}</strong> badge.
                        </span>
                    )}
                 </p>

                 {/* Certificate Section */}
                 {milestone && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                                <i className="fa-solid fa-certificate"></i>
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Rank Certificate</p>
                                <p className="text-xs text-slate-500">{isUnlocked ? 'Available for download' : `Unlocks at Level ${rank.minLevel}`}</p>
                            </div>
                        </div>
                        
                        {isUnlocked && user ? (
                            <button 
                                onClick={() => setViewingCertificate(milestone)}
                                className="px-4 py-2 text-xs font-bold bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg shadow-sm transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-indigo-400 dark:hover:bg-slate-700"
                            >
                                <i className="fa-solid fa-eye mr-2"></i>View
                            </button>
                        ) : (
                            <div className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 rounded-lg flex items-center gap-2 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed border border-transparent">
                                <i className="fa-solid fa-lock"></i> Locked
                            </div>
                        )}
                    </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

       {/* Hidden Certificate Generator */}
       {activeCertificate && user && (
        <div className="fixed top-0 left-[-9999px] z-[-50]">
             <div className="w-[850px] bg-white p-4">
                <Certificate user={user} milestone={activeCertificate} id={`cert-level-${activeCertificate.id}`} />
             </div>
        </div>
      )}

      {/* Certificate Modal */}
      {viewingCertificate && user && (
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
                         <Certificate user={user} milestone={viewingCertificate} id={`view-cert-level-${viewingCertificate.id}`} />
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

export default Levels;