import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Bookmark, 
  Briefcase, 
  UserCircle2,
  ChevronRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { profileService } from '../../services/profileService';

export const Sidebar: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const completion = profile ? profileService.getProfileCompletion(profile) : 0;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Compass, label: 'Browse Jobs', path: '/jobs' },
    { icon: Sparkles, label: 'Recommended', path: '/recommended' },
    { icon: Bookmark, label: 'Saved Jobs', path: '/saved-jobs' },
    { icon: Briefcase, label: 'Applications', path: '/applied-jobs' },
  ];

  return (
    <aside className="w-[232px] bg-white border-r border-slate-200/80 flex flex-col h-screen hidden lg:flex shrink-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_1px_3px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-105">
            <span className="tracking-tight font-extrabold">SH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[1.0625rem] font-bold tracking-tight text-slate-900 leading-none">
              SkillHubb
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Career Engine
            </span>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-[13.5px] font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'bg-blue-50/80 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-[18px] h-[18px] mr-2.5 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600 stroke-[1.8]'
                  }`} 
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Section with Completion Meter */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `block p-2.5 rounded-lg border transition-all ${
              isActive 
                ? 'bg-white border-blue-200 shadow-sm' 
                : 'bg-white/80 border-slate-200/70 hover:bg-white hover:border-slate-300'
            }`
          }
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {profile?.name ? profile.name.charAt(0) : <UserCircle2 className="w-4 h-4" />}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-slate-900 truncate leading-none">
                  {profile?.name || 'Complete Profile'}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {profile?.preferences?.preferredRoles?.[0] || 'Job Seeker'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Profile Completion Meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Profile completeness</span>
              <span className="text-blue-700 font-bold">{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
