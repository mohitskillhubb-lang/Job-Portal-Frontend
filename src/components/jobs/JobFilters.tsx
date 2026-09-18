import React from 'react';
import { Filter, X, Check, RotateCcw } from 'lucide-react';

export interface FilterState {
  jobType: string;
  workMode: string;
  experienceLevel: string;
}

interface JobFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults?: number;
  onCloseMobile?: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  setFilters,
  totalResults,
  onCloseMobile
}) => {
  const handleRadioChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({
      jobType: '',
      workMode: '',
      experienceLevel: ''
    });
  };

  const hasActiveFilters = Boolean(filters.jobType || filters.workMode || filters.experienceLevel);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Filter Roles</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Work Mode */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider text-[11px]">
            Workplace Type
          </h4>
          <div className="space-y-1.5">
            {[
              { label: 'All Modes', value: '' },
              { label: 'Remote', value: 'Remote' },
              { label: 'Hybrid', value: 'Hybrid' },
              { label: 'On-site', value: 'On-site' },
            ].map((item) => (
              <label
                key={item.value}
                className="flex items-center justify-between text-xs text-slate-700 py-1 px-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="workMode"
                    checked={filters.workMode === item.value}
                    onChange={() => handleRadioChange('workMode', item.value)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={filters.workMode === item.value ? 'font-semibold text-slate-900' : ''}>
                    {item.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider text-[11px]">
            Employment Type
          </h4>
          <div className="space-y-1.5">
            {[
              { label: 'All Types', value: '' },
              { label: 'Full-time', value: 'Full-time' },
              { label: 'Internship', value: 'Internship' },
              { label: 'Contract', value: 'Contract' },
              { label: 'Part-time', value: 'Part-time' },
            ].map((item) => (
              <label
                key={item.value}
                className="flex items-center justify-between text-xs text-slate-700 py-1 px-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="jobType"
                    checked={filters.jobType === item.value}
                    onChange={() => handleRadioChange('jobType', item.value)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={filters.jobType === item.value ? 'font-semibold text-slate-900' : ''}>
                    {item.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider text-[11px]">
            Experience Level
          </h4>
          <div className="space-y-1.5">
            {[
              { label: 'All Levels', value: '' },
              { label: 'Entry Level', value: 'Entry Level' },
              { label: 'Internship', value: 'Internship' },
              { label: 'Associate', value: 'Associate' },
              { label: 'Mid-Senior', value: 'Mid-Senior' },
            ].map((item) => (
              <label
                key={item.value}
                className="flex items-center justify-between text-xs text-slate-700 py-1 px-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={filters.experienceLevel === item.value}
                    onChange={() => handleRadioChange('experienceLevel', item.value)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={filters.experienceLevel === item.value ? 'font-semibold text-slate-900' : ''}>
                    {item.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {onCloseMobile && (
        <div className="fixed bottom-[90px] right-4 z-[60]">
          <button
            type="button"
            onClick={onCloseMobile}
            className="px-6 py-3.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-transform"
          >
            Apply Filters {totalResults !== undefined ? `(${totalResults})` : ''}
          </button>
        </div>
      )}
    </div>
  );
};
