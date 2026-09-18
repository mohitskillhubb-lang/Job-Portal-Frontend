import React from 'react';
import { applicationFollowUp } from '../../utils/applicationFollowUp';
import { Application } from '../../types/application';
import { CheckCircle2, MessageSquare } from 'lucide-react';

interface ApplicationFollowUpProps {
  application: Application;
  onUpdate: (action: string, answer: string, details?: any) => void;
}

export const ApplicationFollowUp: React.FC<ApplicationFollowUpProps> = ({ application, onUpdate }) => {
  const question = applicationFollowUp.getNextQuestion(application);

  if (!question) {
    return (
      <div className="bg-emerald-50/80 rounded-xl p-5 border border-emerald-200/80 text-center space-y-1">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
        <p className="text-xs font-bold text-emerald-900">Application status is up to date</p>
        <p className="text-[11px] text-emerald-700">We will notify you when a follow-up action is required.</p>
      </div>
    );
  }

  const handleActionClick = (action: string, label: string) => {
    if (action !== 'WAITING') {
      onUpdate(action, label);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
        Follow-up Action
      </h3>
      
      <div>
        <p className="text-xs font-semibold text-slate-900 mb-3">{question.question}</p>
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleActionClick(opt.action, opt.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                opt.label === 'Yes' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs' 
                  : opt.label === 'No' 
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
