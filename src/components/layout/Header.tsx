import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  X, 
  Menu,
  Briefcase, 
  Building2, 
  Tag, 
  MapPin, 
  Check, 
  ExternalLink,
  Sparkles,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Student } from '../../types/student';
import { profileService } from '../../services/profileService';

interface HeaderProps {
  user?: Student;
}

interface SearchSuggestion {
  type: 'job' | 'skill' | 'company' | 'location';
  title: string;
  subtitle?: string;
  queryParam: string;
}


export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input') as HTMLInputElement;
        input?.focus();
        setSearchFocused(true);
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseSuggestions = useMemo(() => {
    const suggestions: SearchSuggestion[] = [];
    if (user?.preferences?.preferredRoles) {
      user.preferences.preferredRoles.forEach(role => {
        if (role) suggestions.push({ type: 'job', title: role, subtitle: 'Recommended Role', queryParam: role });
      });
    }
    if (user?.skills) {
      user.skills.slice(0, 3).forEach(skill => {
        if (skill?.name) suggestions.push({ type: 'skill', title: skill.name, subtitle: 'Your Skill', queryParam: skill.name });
      });
    }
    
    return suggestions;
  }, [user]);

  const filteredSuggestions = searchQuery.trim()
    ? baseSuggestions.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseSuggestions.slice(0, 6);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchFocused(false);
    setSearchQuery(suggestion.title);
    if (suggestion.type === 'location') {
      navigate(`/jobs?location=${encodeURIComponent(suggestion.queryParam)}`);
    } else {
      navigate(`/jobs?keyword=${encodeURIComponent(suggestion.queryParam)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getContextTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/jobs/')) return 'Details';
    if (path === '/jobs') return 'Browse';
    if (path === '/recommended') return 'Matches';
    if (path === '/saved-jobs') return 'Saved';
    if (path === '/applied-jobs') return 'Applied';
    if (path.startsWith('/applications/')) return 'Application';
    if (path === '/profile') return 'Profile';
    return 'Dashboard';
  };

  const profileCompletion = user ? profileService.getProfileCompletion(user) : 0;

  return (
    <header className="bg-white border-b border-slate-200/80 h-14 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Trigger & Context Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Context Title on mobile */}
        <div className="lg:hidden flex items-center">
          <span className="text-slate-800 font-bold tracking-tight text-lg">
            {getContextTitle()}
          </span>
        </div>

        {/* Contextual Section / Breadcrumb on Desktop */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">SkillHubb</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold tracking-tight">
            {getContextTitle()}
          </span>
        </div>
      </div>

      {/* Center: Command Search with ⌘K & Autocomplete */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-3 sm:mx-6 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search jobs, skills, companies..."
            className="w-full pl-9 pr-14 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </form>

        {/* Autocomplete Menu (Recognition Over Recall) */}
        {searchFocused && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden text-xs">
            <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>SUGGESTED DISCOVERY</span>
              <span className="text-slate-400 font-normal">ESC to close</span>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={`${item.type}-${idx}`}
                  type="button"
                  onMouseDown={() => handleSuggestionClick(item)}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {item.type === 'job' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                    {item.type === 'skill' && <Tag className="w-3.5 h-3.5 text-emerald-600" />}
                    {item.type === 'company' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                    {item.type === 'location' && <MapPin className="w-3.5 h-3.5 text-amber-600" />}
                    <div>
                      <span className="font-semibold text-slate-800">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-slate-400 text-[10px] ml-1.5 font-normal">
                          · {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </button>
              ))}
            </div>
            {searchQuery && (
              <div className="p-2 border-t border-slate-100 bg-slate-50/60 text-center">
                <button
                  type="button"
                  onMouseDown={handleSearchSubmit}
                  className="text-blue-600 font-semibold text-[11px] hover:underline"
                >
                  Search all results for "{searchQuery}" &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 sm:block" 
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 w-full h-full sm:w-80 sm:h-auto bg-white sm:border border-slate-200 sm:rounded-xl shadow-xl z-50 overflow-hidden text-xs flex flex-col">
                <div className="p-4 sm:p-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      className="sm:hidden p-1 -ml-1 text-slate-500 hover:text-slate-800"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-slate-900 text-sm sm:text-xs">Notifications</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                    1 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto sm:max-h-72">
                  <button 
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/profile?edit=true');
                    }}
                    className="w-full text-left p-4 sm:p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 sm:gap-2">
                      <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm sm:text-xs">Profile Optimization</p>
                        <p className="text-slate-500 text-xs sm:text-[11px] mt-1 sm:mt-0.5 leading-snug">
                          Complete your profile preferences to receive higher confidence job matches.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1.5 sm:mt-1 block">Just now</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="p-3 sm:p-2 border-t border-slate-100 bg-slate-50/50 text-center pb-safe">
                  <button 
                    type="button" 
                    onClick={() => setNotificationsOpen(false)} 
                    className="text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-[11px]"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

        {/* Profile Avatar / Menu */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full p-[2px] flex items-center justify-center shrink-0"
                style={{ background: `conic-gradient(#2563eb ${profileCompletion}%, #e2e8f0 0)` }}
              >
                <div className="w-full h-full rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="hidden md:block text-left text-xs leading-none">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                  {user.preferences?.preferredRoles?.[0] || 'Student'}
                </p>
              </div>
            </button>

            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/saved-jobs"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Saved Roles</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <Link
                    to="/profile?edit=true"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Profile Data</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/profile/setup"
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Drawer (Settings & Extra Options) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-white shadow-2xl h-full p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  SH
                </div>
                <span className="font-bold text-slate-900 text-base">SkillHubb</span>
              </div>
              <button 
                type="button" 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1 text-sm font-medium">
              <Link
                to="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Browse Jobs
              </Link>
              <Link
                to="/recommended"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Recommended
              </Link>
              <Link
                to="/saved-jobs"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Saved Jobs
              </Link>
              <Link
                to="/applied-jobs"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
