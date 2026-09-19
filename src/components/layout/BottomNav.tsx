import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Star,
  Bookmark,
  Briefcase
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const leftNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Bookmark, label: 'Saved', path: '/saved-jobs' },
  ];

  const rightNavItems = [
    { icon: Briefcase, label: 'My Jobs', path: '/applied-jobs' },
    { icon: Star, label: 'Top Selected', path: '/recommended' },
  ];

  const renderNavItem = (item: any) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex flex-col items-center justify-start pt-3 transition-all flex-1 max-w-[76px] ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            fill={isActive ? 'currentColor' : 'none'}
            className={`w-[20px] h-[20px] mb-1.5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
              }`}
          />
          <span className={`text-[11px] font-medium tracking-tight whitespace-nowrap mb-1 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>
            {item.label}
          </span>
          <span className={`w-1 h-1 rounded-full transition-opacity ${isActive ? 'bg-blue-600 opacity-100' : 'opacity-0'}`}></span>
        </>
      )}
    </NavLink>
  );

  const isSearchActive = location.pathname === '/jobs';

  if (location.pathname.startsWith('/jobs/')) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="relative w-full h-[72px] mx-auto flex items-end justify-center pointer-events-auto">

        {/* Background with SVG for smooth fully rounded notch */}
        <div
          className="absolute bottom-0 left-0 w-full h-[72px] drop-shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pointer-events-none flex"
        >
          {/* Left Side */}
          <div className="flex-1 bg-white border-t border-slate-200"></div>

          {/* Rounded Notch */}
          <div className="w-[130px] h-[72px] relative shrink-0 overflow-visible">
            <svg
              viewBox="0 0 130 72"
              className="absolute inset-0 w-full h-full"
              fill="white"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="
        M0 0
        C20 0 27 0 36 10
        C43 18 45 30 48 38
        C50 44 55 47 65 47
        C75 47 80 44 82 38
        C85 30 87 18 94 10
        C103 0 110 0 130 0
        L130 72
        L0 72
        Z
      "
              />
              <path
                d="
        M0 0
        C20 0 27 0 36 10
        C43 18 45 30 48 38
        C50 44 55 47 65 47
        C75 47 80 44 82 38
        C85 30 87 18 94 10
        C103 0 110 0 130 0
      "
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            </svg>
          </div>
          
          {/* Right Side */}
          <div className="flex-1 bg-white border-t border-slate-200"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex items-start justify-around w-full max-w-[420px] px-2 h-full pt-0.5">
          <div className="flex items-center justify-around flex-1">
            {leftNavItems.map(renderNavItem)}
          </div>

          {/* Center Search Button */}
          <div className="relative flex flex-col items-center -mt-[26px] w-[72px]">
            <NavLink
              to="/jobs"
              className={`flex items-center justify-center w-[54px] h-[54px] rounded-full shadow-lg transition-transform active:scale-95 ${isSearchActive ? 'bg-blue-700 text-white shadow-blue-500/30' : 'bg-blue-600 text-white'
                }`}
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </NavLink>
          </div>

          <div className="flex items-center justify-around flex-1">
            {rightNavItems.map(renderNavItem)}
          </div>
        </div>
      </div>
    </nav>
  );
};
