import React from 'react';
import { User, Milestone } from '../types';

interface CertificateProps {
  user: User;
  milestone: Milestone;
  id: string; // DOM ID for html2canvas to target
}

const Certificate: React.FC<CertificateProps> = ({ user, milestone, id }) => {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate a unique-looking Certificate ID based on user and milestone
  const certId = `CERT-${user.id.substring(0, 5).toUpperCase()}-${milestone.id.toUpperCase()}-${new Date().getFullYear()}`;

  const getReasonText = () => {
    if (milestone.requiredLevel) {
        return `For outstanding performance and dedication in reaching the rank of`;
    }
    if (milestone.requiredWpm) {
        return `For demonstrating exceptional typing proficiency by achieving`;
    }
    return `For consistent practice and dedication by completing`;
  };

  const getMilestoneValue = () => {
       if (milestone.requiredLevel) return `Level ${milestone.requiredLevel}`;
       if (milestone.requiredWpm) return `${milestone.requiredWpm} WPM`;
       if (milestone.requiredTests) return `${milestone.requiredTests} Tests`;
       return "";
  };

  return (
    <div className="overflow-hidden bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex justify-center">
      {/* Container for the certificate - Fixed size for consistent PDF generation */}
      <div 
        id={id} 
        className="relative w-[800px] h-[600px] bg-[#fffbf0] text-slate-900 shadow-2xl flex flex-col items-center justify-between p-10 box-border"
        style={{ fontFamily: "'Playfair Display', serif" }} 
      >
        {/* Ornate Borders */}
        {/* Outer Double Border */}
        <div className="absolute inset-3 border-[6px] border-double border-slate-800 pointer-events-none z-20"></div>
        {/* Inner Fine Border */}
        <div className="absolute inset-5 border border-slate-400 pointer-events-none z-20"></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-3 left-3 w-20 h-20 border-t-[6px] border-l-[6px] border-indigo-900 z-20"></div>
        <div className="absolute top-3 right-3 w-20 h-20 border-t-[6px] border-r-[6px] border-indigo-900 z-20"></div>
        <div className="absolute bottom-3 left-3 w-20 h-20 border-b-[6px] border-l-[6px] border-indigo-900 z-20"></div>
        <div className="absolute bottom-3 right-3 w-20 h-20 border-b-[6px] border-r-[6px] border-indigo-900 z-20"></div>

        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ 
                 backgroundImage: 'radial-gradient(#4338ca 0.5px, transparent 0.5px)', 
                 backgroundSize: '10px 10px' 
             }}>
        </div>
        
        {/* Central Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
             <i className="fa-solid fa-certificate text-[450px] text-slate-900"></i>
        </div>

        {/* --- CONTENT START --- */}

        {/* Header Section */}
        <div className="text-center z-10 mt-8 w-full">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
                <i className="fa-solid fa-keyboard text-indigo-900 text-xl"></i>
                <span className="uppercase tracking-[0.4em] text-[10px] font-sans text-indigo-900 font-bold">TypeMaster Professional Certification</span>
                <i className="fa-solid fa-keyboard text-indigo-900 text-xl"></i>
            </div>
            <h1 className="text-6xl font-bold uppercase tracking-widest text-slate-900 mb-2 drop-shadow-sm">Certificate</h1>
            <h2 className="text-3xl italic text-slate-600 font-light font-dancing">of Achievement</h2>
        </div>

        {/* Recipient Section */}
        <div className="text-center z-10 w-full px-12 flex-grow flex flex-col justify-center">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-slate-500 mb-6">This certifies that</p>
          
          <div className="relative mb-8 mx-auto">
            <h3 className="text-5xl font-bold text-indigo-900 font-dancing px-12 py-2 border-b-2 border-slate-300 min-w-[300px] inline-block">
                {user.username}
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {getReasonText()}
            </p>
            <div className="mt-4">
                <span className="text-3xl font-bold text-indigo-800 block mb-1 uppercase tracking-wide">{milestone.name}</span>
                <span className="text-sm font-sans font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest inline-block">
                    {getMilestoneValue()}
                </span>
            </div>
          </div>
        </div>

        {/* Footer / Signatures */}
        <div className="flex justify-between w-full items-end z-10 px-8 mb-4">
          
          {/* Date */}
          <div className="text-center">
            <div className="font-dancing text-2xl text-slate-800 mb-1 px-6">{date}</div>
            <div className="w-40 border-t border-slate-400 pt-1 mx-auto">
                 <p className="text-[9px] font-sans uppercase tracking-widest text-slate-500 font-bold">Date Issued</p>
            </div>
          </div>
          
          {/* Gold Seal */}
          <div className="relative flex flex-col items-center -mb-2 mx-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
                 {/* Seal Layers */}
                 <div className="absolute inset-0 bg-yellow-500 rounded-full shadow-xl flex items-center justify-center border-[6px] border-yellow-600 border-double"></div>
                 <div className="absolute inset-2 border border-yellow-200 rounded-full opacity-60"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-award text-yellow-800 text-6xl drop-shadow-sm"></i>
                 </div>
            </div>
            {/* Ribbons */}
            <div className="absolute -bottom-6 flex justify-center -z-10">
                <div className="w-10 h-16 bg-yellow-600 shadow-md transform rotate-[20deg] origin-top -ml-6 border-b-8 border-yellow-700"></div>
                <div className="w-10 h-16 bg-yellow-600 shadow-md transform -rotate-[20deg] origin-top -mr-6 border-b-8 border-yellow-700"></div>
            </div>
          </div>

          {/* Signature */}
          <div className="text-center">
             <div className="font-dancing text-4xl text-indigo-900 mb-1 px-6" style={{ transform: 'rotate(-4deg)' }}>TypeMaster AI</div>
            <div className="w-40 border-t border-slate-400 pt-1 mx-auto">
                 <p className="text-[9px] font-sans uppercase tracking-widest text-slate-500 font-bold">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="absolute bottom-3 left-0 w-full text-center z-20">
            <div className="inline-block bg-white/80 px-4 py-1 rounded-full border border-slate-200 backdrop-blur-sm">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    <i className="fa-solid fa-lock mr-1 text-slate-400"></i>
                    ID: {certId}
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Certificate;