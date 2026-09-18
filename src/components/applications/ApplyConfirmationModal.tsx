import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Job } from '../../types/job';
import { storageService } from '../../services/storageService';

interface ApplyConfirmationModalProps {
  job: Job;
  studentId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApplyConfirmationModal: React.FC<ApplyConfirmationModalProps> = ({ 
  job, 
  studentId, 
  onClose, 
  onConfirm 
}) => {
  const [step, setStep] = useState(1);
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('LinkedIn');

  const handleApplyConfirm = () => {
    storageService.createApplication({
      studentId,
      jobId: job.id,
      appliedDate,
      applicationSource: source,
      status: 'APPLIED'
    });
    onConfirm();
  };

  const handleJustReviewed = () => {
    storageService.createApplication({
      studentId,
      jobId: job.id,
      appliedDate: new Date().toISOString(),
      applicationSource: 'None',
      status: 'REVIEWED'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 relative animate-in fade-in zoom-in-95 duration-150">
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 1 ? (
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Did you submit your application?</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xs mx-auto">
                Track this role at <strong className="text-slate-800">{job.company}</strong> in your SkillHubb dashboard to follow up on status updates.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
              >
                Yes, record my application
              </button>
              <button 
                type="button"
                onClick={handleJustReviewed}
                className="w-full bg-white text-slate-600 border border-slate-200 py-2.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                I just browsed the listing
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Application Source Details</h2>
              <p className="text-[11px] text-slate-500">Record how you submitted your profile</p>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Channel
              </label>
              <select 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="Directly on Company Website">Company Career Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Employee Referral">Employee Referral</option>
                <option value="Email / Recruiter Outreach">Email / Recruiter Outreach</option>
                <option value="Job Board Portal">Job Board Portal</option>
              </select>
            </div>

            <button 
              type="button"
              onClick={handleApplyConfirm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              Confirm & Track Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
