import React from 'react';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';
import { User, Milestone } from '../types';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  // Mock Data for the preview
  const demoUser: User = {
    id: '12345',
    username: 'Alex Taylor',
    email: 'alex@example.com',
    avatar: '',
    level: 40,
    xp: 150000,
    totalTests: 124,
    bestWpm: 95,
    createdAt: new Date().toISOString()
  };

  const demoMilestone: Milestone = {
    id: 'rank-grandmaster',
    name: 'Grandmaster Typist',
    description: 'Reach Level 40',
    requiredLevel: 40,
    icon: 'fa-crown text-red-500'
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center px-4 relative overflow-hidden pb-20">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-4xl text-center z-10 pt-16 md:pt-24">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold tracking-wide border border-indigo-100 dark:border-indigo-800">
          ✨ New: AI-Powered Typing Tests
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          Master Your <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Typing Speed</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          Improve your WPM, track your progress, compete on the global leaderboard, and earn professional certificates.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/test" 
            className="px-10 py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
          >
            Start Typing Test
          </Link>
          <Link 
            to="/dashboard" 
            className="px-10 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg shadow-sm transition-all transform hover:-translate-y-1"
          >
            {user ? 'My Dashboard' : 'View Dashboard'}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-sm">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-bold text-lg dark:text-white mb-2">Fast & Responsive</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Experience lag-free typing with instant feedback and accurate WPM calculation.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-sm">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-bold text-lg dark:text-white mb-2">Compete Globally</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Climb the leaderboard ranks and show off your typing prowess to the world.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-sm">
                <div className="text-3xl mb-3">📜</div>
                <h3 className="font-bold text-lg dark:text-white mb-2">Earn Certificates</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Unlock verifiable certificates as you reach new speed and consistency milestones.</p>
            </div>
        </div>
      </div>

      {/* NEW SECTION: Certificate Preview */}
      <div className="mt-24 w-full max-w-6xl z-10 flex flex-col items-center">
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
               <i className="fa-solid fa-award text-yellow-500"></i> Get Certified
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Reach milestones to unlock and download high-quality, professional certificates to showcase your achievements.
            </p>
        </div>
        
        {/* Certificate container with scaling */}
        <div className="relative group perspective-1000 mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-slate-200 dark:bg-slate-700 p-2 sm:p-4 rounded-2xl shadow-2xl overflow-hidden">
                <div className="overflow-hidden flex justify-center items-center" 
                     style={{ 
                        width: 'var(--cert-container-width)', 
                        height: 'var(--cert-container-height)' 
                     }}>
                    <div className="origin-top-left transform scale-[0.38] xs:scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[1]">
                         <Certificate user={demoUser} milestone={demoMilestone} id="demo-certificate-preview" />
                    </div>
                </div>
            </div>
        </div>

        {/* CSS Variables for Responsive Height/Width adjustments of the container */}
        <style>{`
            :root {
                --cert-container-width: 304px;
                --cert-container-height: 228px;
            }
            @media (min-width: 480px) {
                :root {
                    --cert-container-width: 360px;
                    --cert-container-height: 270px;
                }
            }
            @media (min-width: 640px) {
                :root {
                    --cert-container-width: 480px;
                    --cert-container-height: 360px;
                }
            }
            @media (min-width: 768px) {
                :root {
                    --cert-container-width: 640px;
                    --cert-container-height: 480px;
                }
            }
            @media (min-width: 1024px) {
                :root {
                    --cert-container-width: 800px;
                    --cert-container-height: 600px;
                }
            }
        `}</style>

        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                * Example certificate. Actual certificates are personalized with your name and stats.
            </p>
            <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
                Create Account to Start <i className="fa-solid fa-arrow-right"></i>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;