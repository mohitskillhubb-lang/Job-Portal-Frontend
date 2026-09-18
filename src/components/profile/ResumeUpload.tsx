import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Student } from '../../types/student';
import { skillSanitizer } from '../../utils/skillSanitizer';

interface ResumeUploadProps {
  onSuccess: (data: Partial<Student>) => void;
  onCancel: () => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setStatus('error');
      setErrorMsg('Please upload a PDF or Word document (.doc, .docx).');
      return;
    }

    try {
      setStatus('uploading');
      await new Promise(r => setTimeout(r, 600));
      setStatus('parsing');
      
      const parsedData = await api.parseResume(file);
      
      // Clean skills immediately
      if (parsedData.skills) {
        parsedData.skills = skillSanitizer.sanitizeSkills(parsedData.skills);
      }
      
      setStatus('success');
      setTimeout(() => onSuccess(parsedData), 800);
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'We couldn\'t read this resume. Please try another file.');
    }
  };

  return (
    <div className="w-full space-y-5">

      {status === 'idle' && (
        <div 
          className="border border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50/60 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 stroke-[1.8]" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Click to select or drag and drop your file
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supported formats: PDF, DOCX (Max 10MB)
          </p>
          <button 
            type="button" 
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            Choose File
          </button>
        </div>
      )}

      {status === 'uploading' && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-800">Uploading document...</p>
        </div>
      )}

      {status === 'parsing' && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
          <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          <p className="text-xs font-semibold text-slate-800">Extracting skills and experience...</p>
          <p className="text-[11px] text-slate-400">Filtering competencies and organizing profile data</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          <p className="text-xs font-bold text-slate-900">Resume parsed successfully!</p>
          <p className="text-[11px] text-slate-500">Preparing candidate profile review...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600" />
          <div>
            <p className="text-xs font-bold text-rose-700">Failed to parse resume</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{errorMsg}</p>
          </div>
          <button 
            type="button"
            onClick={() => setStatus('idle')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      )}

      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        onChange={handleFileChange} 
      />
    </div>
  );
};
