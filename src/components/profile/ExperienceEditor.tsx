import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Experience } from '../../types/student';

interface ExperienceEditorProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
  errors?: Record<string, string>;
  clearError?: (field: string) => void;
}

import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, onChange, errors = {}, clearError }) => {
  const handleAdd = () => {
    onChange([...experience, { company: '', role: '', employmentType: 'Full-time', startDate: '', endDate: '', responsibilities: '' }]);
  };

  const handleRemove = (index: number) => {
    const newExp = [...experience];
    newExp.splice(index, 1);
    onChange(newExp);
  };

  const handleChange = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange(newExp);
    if (clearError) {
      clearError(`exp_${index}_${String(field)}`);
    }
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, idx) => (
        <div key={idx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3 relative">
          <button 
            type="button"
            onClick={() => handleRemove(idx)}
            className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors p-1 rounded"
            title="Remove experience"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={clsx("space-y-1", errors[`exp_${idx}_role`] && "error-field")}>
              <label className="block text-slate-700 font-semibold mb-1">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                value={exp.role}
                onChange={e => handleChange(idx, 'role', e.target.value)}
                placeholder="e.g. Software Engineer"
                className={clsx("w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium focus:ring-1 outline-none transition-colors", errors[`exp_${idx}_role`] ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-blue-500")}
              />
              {errors[`exp_${idx}_role`] && <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors[`exp_${idx}_role`]}</span>}
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company / Organization</label>
              <input 
                type="text" 
                value={exp.company}
                onChange={e => handleChange(idx, 'company', e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className={clsx("space-y-1", errors[`exp_${idx}_startDate`] && "error-field")}>
              <label className="block text-slate-700 font-semibold mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input 
                type="month" 
                value={exp.startDate}
                onChange={e => handleChange(idx, 'startDate', e.target.value)}
                className={clsx("w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium focus:ring-1 outline-none cursor-pointer transition-colors", errors[`exp_${idx}_startDate`] ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-blue-500")}
              />
              {errors[`exp_${idx}_startDate`] && <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors[`exp_${idx}_startDate`]}</span>}
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Date</label>
              <input 
                type="month" 
                value={exp.endDate === 'Present' ? '' : (exp.endDate || '')}
                onChange={e => handleChange(idx, 'endDate', e.target.value)}
                disabled={exp.endDate === 'Present'}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
              />
              <label className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={exp.endDate === 'Present'}
                  onChange={(e) => {
                    const newExp = [...experience];
                    if (e.target.checked) {
                      newExp.forEach((x, i) => { if (i !== idx && x.endDate === 'Present') x.endDate = '' });
                      newExp[idx].endDate = 'Present';
                    } else {
                      newExp[idx].endDate = '';
                    }
                    onChange(newExp);
                  }}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                />
                <span>Currently working in this position</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Responsibilities & Achievements</label>
            <textarea 
              value={exp.responsibilities}
              onChange={e => handleChange(idx, 'responsibilities', e.target.value)}
              placeholder="Describe your core achievements, team leadership, or tools used"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none leading-relaxed"
            />
          </div>
        </div>
      ))}
      
      <button 
        type="button"
        onClick={handleAdd}
        className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Experience</span>
      </button>
    </div>
  );
};
