import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Skill } from '../../types/student';
import { skillSanitizer } from '../../utils/skillSanitizer';

interface SkillInputProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillInput: React.FC<SkillInputProps> = ({ skills, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [levelValue, setLevelValue] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [validationError, setValidationError] = useState<string | null>(null);

  const cleanSkills = skillSanitizer.sanitizeSkills(skills);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    setValidationError(null);

    if (!trimmed) return;

    if (!skillSanitizer.isValidSkillName(trimmed)) {
      setValidationError('Please enter a valid technical or professional skill name.');
      return;
    }

    if (cleanSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setValidationError('This skill is already listed in your profile.');
      return;
    }

    onChange([...cleanSkills, { name: trimmed, level: levelValue }]);
    setInputValue('');
  };

  const handleRemove = (name: string) => {
    onChange(cleanSkills.filter(s => s.name !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      {/* Skill Chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
        {cleanSkills.length > 0 ? (
          cleanSkills.map((skill) => (
            <span 
              key={skill.name} 
              className="inline-flex items-center gap-1 bg-white border border-slate-200/90 text-slate-800 px-2.5 py-1 rounded-md text-xs font-medium shadow-2xs"
            >
              <span>{skill.name}</span>
              <span className="text-[10px] text-slate-400 border-l border-slate-200 pl-1 ml-0.5">
                {skill.level}
              </span>
              <button 
                type="button" 
                onClick={() => handleRemove(skill.name)}
                className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                title={`Remove ${skill.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic py-1 px-1">
            No skills added yet. Add your core competencies below.
          </span>
        )}
      </div>

      {/* Input controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input 
            type="text"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React, Python, PostgreSQL, System Design"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <select 
          value={levelValue}
          onChange={e => setLevelValue(e.target.value as any)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button 
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shrink-0 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {validationError && (
        <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError}</span>
        </p>
      )}
    </div>
  );
};
