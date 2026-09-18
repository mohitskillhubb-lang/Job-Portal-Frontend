import React from 'react';
import { Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { JobMatch as JobMatchType } from '../../types/job';

interface JobMatchProps {
  match: JobMatchType;
}

export const JobMatch: React.FC<JobMatchProps> = ({ match }) => {
  const score = match.matchScore;

  let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  let barColor = 'bg-blue-600';
  let statusText = 'Good Match';

  if (score >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    barColor = 'bg-emerald-600';
    statusText = 'Strong Match';
  } else if (score < 50) {
    badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
    barColor = 'bg-slate-500';
    statusText = 'Partial Match';
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Match Analysis
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Based on your skills, experience & preferences
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${badgeColor}`}>
          {score}% &bull; {statusText}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Reasons & Matched Skills */}
        <div>
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            Matching Highlights
          </h4>
          <ul className="space-y-2">
            {match.reasons && match.reasons.length > 0 ? (
              match.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>{reason.replace(/^[•\-\*]\s*/, '')}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                <span>Job criteria align with your profile configuration</span>
              </li>
            )}

            {match.matchingSkills && match.matchingSkills.map((skill, idx) => (
              <li key={`skill-${idx}`} className="flex items-start text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                <span>
                  Matches your skill in <strong className="font-semibold text-slate-900">{skill}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Requirements */}
        {match.missingSkills && match.missingSkills.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Skills to Consider</span>
              <span className="text-[10px] text-slate-400 font-normal">Not listed in your profile</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, idx) => (
                <span
                  key={`missing-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium"
                >
                  <AlertCircle className="w-3 h-3 text-slate-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
