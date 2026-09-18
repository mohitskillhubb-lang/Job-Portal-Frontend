import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Bookmark, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Laptop
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Job, JobMatch as JobMatchType } from '../../types/job';
import { storageService } from '../../services/storageService';

interface JobCardProps {
  jobMatch?: JobMatchType;
  job?: Job;
  studentId?: string;
  onSaveToggle?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  jobMatch, 
  job: rawJob, 
  studentId, 
  onSaveToggle 
}) => {
  const job = jobMatch ? jobMatch.job : rawJob;
  const [logoError, setLogoError] = useState(false);
  const [showMatchTooltip, setShowMatchTooltip] = useState(false);
  const navigate = useNavigate();

  if (!job) return null;

  const [localIsSaved, setLocalIsSaved] = useState(storageService.isJobSaved(job.id));
  
  useEffect(() => {
    setLocalIsSaved(storageService.isJobSaved(job.id));
  }, [job.id]);

  const matchScore = jobMatch?.matchScore ?? 0;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (localIsSaved) {
      storageService.removeSavedJob(job.id);
      setLocalIsSaved(false);
    } else {
      storageService.saveJob(job.id, studentId || 'student_123');
      setLocalIsSaved(true);
    }
    if (onSaveToggle) onSaveToggle();
  };

  const getMatchScoreBadge = () => {
    if (!jobMatch) return null;

    let badgeClass = 'text-slate-600 bg-slate-100 border-slate-200';
    let label = `${matchScore}% Match`;

    if (matchScore >= 70) {
      badgeClass = 'text-white bg-emerald-500 border-emerald-500 shadow-sm';
    } else if (matchScore >= 50) {
      badgeClass = 'text-white bg-amber-500 border-amber-500 shadow-sm';
    }

    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowMatchTooltip(true)}
        onMouseLeave={() => setShowMatchTooltip(false)}
      >
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-help transition-colors ${badgeClass}`}>
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>{label}</span>
        </div>

        {/* Progressive Disclosure: Tooltip on Hover */}
        {showMatchTooltip && (
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <p className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Why this matches your profile
            </p>
            <div className="space-y-1 text-slate-300 text-[11px]">
              {jobMatch.reasons?.length > 0 ? (
                jobMatch.reasons.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r.replace('✓ ', '')}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Aligned with your career preferences</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer min-w-[280px]"
    >
      
      {/* Top Header: Logo + Title + Bookmark */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
            {job.companyLogo && !logoError ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-bold text-xs">
                {job.company ? job.company.charAt(0) : <Building2 className="w-4 h-4 text-slate-400" />}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link 
              to={`/jobs/${job.id}`} 
              onClick={e => e.stopPropagation()}
              className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate"
            >
              {job.title}
            </Link>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {job.company}
            </p>
          </div>
        </div>
        
        {/* Bookmark Action */}
        <button 
          type="button"
          onClick={handleSaveToggle}
          className={`p-1.5 rounded-lg transition-colors shrink-0 -mt-1 -mr-1 ${
            localIsSaved 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={localIsSaved ? 'Remove from saved' : 'Save job'}
          aria-label={localIsSaved ? 'Saved job' : 'Save job'}
        >
          <Bookmark className={`w-5 h-5 ${localIsSaved ? 'fill-blue-600' : ''}`} />
        </button>
      </div>

      {/* Details Row */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-blue-50/60 text-slate-600 text-[11px] font-semibold flex items-center gap-1 border border-blue-100/50">
            <Laptop className="w-3 h-3 text-slate-400" />
            {job.workplaceType}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-50/60 text-slate-600 text-[11px] font-semibold flex items-center gap-1 border border-blue-100/50">
            <Briefcase className="w-3 h-3 text-slate-400" />
            {job.employmentType}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-50/60 text-slate-600 text-[11px] font-semibold flex items-center gap-1 border border-blue-100/50">
            <Clock className="w-3 h-3 text-slate-400" />
            {job.experienceLevel}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Match Score & Action Link */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          {getMatchScoreBadge()}
        </div>

        <Link 
          to={`/jobs/${job.id}`}
          onClick={e => e.stopPropagation()}
          className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0 shadow-sm"
        >
          <span>View Job</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
