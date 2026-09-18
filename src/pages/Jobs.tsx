import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters, FilterState } from '../components/jobs/JobFilters';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { JobMatch } from '../types/job';
import { jobMatcher } from '../utils/jobMatcher';
import { Student } from '../types/student';
import searchBg from '../assets/Job Portal Search BG.png';

let searchCache = {
  keyword: '',
  location: '',
  filters: { jobType: '', workMode: '', experienceLevel: '' } as FilterState,
  jobs: [] as JobMatch[],
  searched: false,
  start: 0,
  hasMore: true,
  hasCached: false
};

export const Jobs: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const locationRouter = useLocation();

  const [keyword, setKeyword] = useState(searchCache.hasCached ? searchCache.keyword : (profile?.preferences?.preferredRoles?.[0] || ''));
  const [location, setLocation] = useState(searchCache.hasCached ? searchCache.location : (profile?.preferences?.preferredLocations?.[0] || ''));
  const [filters, setFilters] = useState<FilterState>(searchCache.hasCached ? searchCache.filters : {
    jobType: '',
    workMode: '',
    experienceLevel: ''
  });

  const [sortBy, setSortBy] = useState<'best_match' | 'newest' | 'relevance'>('best_match');
  const [jobs, setJobs] = useState<JobMatch[]>(searchCache.jobs);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(searchCache.searched);
  const [start, setStart] = useState(searchCache.start);
  const [hasMore, setHasMore] = useState(searchCache.hasMore);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);

  // Sync state to cache
  useEffect(() => {
    searchCache = {
      keyword,
      location,
      filters,
      jobs,
      searched,
      start,
      hasMore,
      hasCached: true
    };
  }, [keyword, location, filters, jobs, searched, start, hasMore]);

  const performSearch = async (currentStart: number, append: boolean = false, searchKw = keyword, searchLoc = location) => {
    try {
      const rawJobs = await api.searchJobs(searchKw, searchLoc, currentStart);

      if (rawJobs.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      let filteredJobs = rawJobs;
      if (filters.jobType) filteredJobs = filteredJobs.filter(j => j.employmentType === filters.jobType);
      if (filters.workMode) filteredJobs = filteredJobs.filter(j => j.workplaceType === filters.workMode);
      if (filters.experienceLevel) filteredJobs = filteredJobs.filter(j => j.experienceLevel === filters.experienceLevel);

      let matches: JobMatch[] = [];
      if (profile) {
        matches = filteredJobs.map(job => jobMatcher.calculateMatch(job, profile));
        matches = matches.filter(match => match.matchScore >= 30);
      } else {
        matches = filteredJobs.map(job => ({ job, matchScore: 0, matchingSkills: [], missingSkills: [], reasons: [] }));
      }

      // Sort
      if (sortBy === 'best_match') {
        matches.sort((a, b) => b.matchScore - a.matchScore);
      } else if (sortBy === 'newest') {
        matches.sort((a, b) => new Date(b.job.postedDate || 0).getTime() - new Date(a.job.postedDate || 0).getTime());
      }

      setJobs(prev => append ? [...prev, ...matches] : matches);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    setStart(0);
    await performSearch(0, false);
    setLoading(false);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextStart = start + 25;
    setStart(nextStart);
    await performSearch(nextStart, true);
    setLoadingMore(false);
  };

  // Watch for URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(locationRouter.search);
    let changed = false;
    let newKeyword = keyword;
    let newLoc = location;

    if (params.has('keyword')) {
      newKeyword = params.get('keyword') || '';
      if (newKeyword !== keyword) {
        setKeyword(newKeyword);
        changed = true;
      }
    }
    
    if (params.has('location')) {
      newLoc = params.get('location') || '';
      if (newLoc !== location) {
        setLocation(newLoc);
        changed = true;
      }
    }

    if (changed || (!searchCache.hasCached && jobs.length === 0 && (params.has('keyword') || params.has('location')))) {
      setStart(0);
      setLoading(true);
      setSearched(true);
      performSearch(0, false, newKeyword, newLoc).finally(() => setLoading(false));
    } else if (!searchCache.hasCached || jobs.length === 0) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationRouter.search]);

  // Filter change auto trigger
  useEffect(() => {
    if (searchCache.hasCached) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [filters, sortBy]);

  const removeFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const activeFilterChips = [
    filters.workMode && { key: 'workMode' as const, label: `Mode: ${filters.workMode}` },
    filters.jobType && { key: 'jobType' as const, label: `Type: ${filters.jobType}` },
    filters.experienceLevel && { key: 'experienceLevel' as const, label: `Exp: ${filters.experienceLevel}` },
  ].filter(Boolean) as { key: keyof FilterState; label: string }[];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Clean Professional Search Bar with background */}
            <div
              className="relative rounded-[2rem] overflow-hidden shadow-xl py-8 px-4 sm:p-10 mb-4 flex flex-col items-center justify-center text-center"
              style={{
                backgroundImage: `url(${searchBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply"></div>

              <div className="relative z-10 w-full max-w-4xl space-y-5 sm:space-y-8">
                <div className="space-y-2 sm:space-y-4 text-white px-2">
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    Discover New Opportunities
                  </h1>
                  <p className="text-xs sm:text-base text-slate-200 font-medium max-w-2xl mx-auto">
                    Search thousands of opportunities and let our intelligent engine match you with the perfect role.
                  </p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/20 p-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-2xl">
                  {/* Keyword Input (Row 1 on mobile, inline on desktop) */}
                  <div className="flex w-full sm:w-auto sm:flex-1 h-14 sm:h-12 items-center">
                    <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company..."
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      className="w-full h-full bg-transparent text-white pl-3 pr-4 text-sm focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Divider - desktop only */}
                  <div className="w-px h-8 bg-slate-700 hidden sm:block shrink-0 self-center"></div>

                  {/* Divider - mobile only */}
                  <div className="h-px w-[95%] bg-slate-700 sm:hidden shrink-0 mx-auto"></div>

                  {/* Location & Search Button (Row 2 on mobile, inline on desktop) */}
                  <div className="flex w-full sm:w-auto sm:flex-1 h-14 sm:h-12 items-center">
                    <div className="flex-1 flex items-center h-full">
                      <MapPin className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                      <input
                        type="text"
                        placeholder="City, state, remote..."
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full h-full bg-transparent text-white pl-3 pr-4 text-sm focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 h-10 sm:h-full rounded-xl font-bold text-sm transition-all disabled:opacity-75 shrink-0 flex items-center justify-center shadow-lg mx-2 sm:mx-0"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        <span>Search</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Grid & Filter Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Desktop Filter Sidebar */}
              {desktopFiltersOpen && (
                <div className="hidden lg:block sticky top-0 w-64 shrink-0 transition-all z-20">
                  <JobFilters filters={filters} setFilters={setFilters} totalResults={jobs.length} />
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Results Header Toolbar */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    {/* Mobile Filters Toggle */}
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFilterChips.length > 0 && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                          {activeFilterChips.length}
                        </span>
                      )}
                    </button>

                    {/* Desktop Filters Toggle */}
                    <button
                      type="button"
                      onClick={() => setDesktopFiltersOpen(!desktopFiltersOpen)}
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFilterChips.length > 0 && (
                        <span className="ml-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                          {activeFilterChips.length}
                        </span>
                      )}
                    </button>

                    <p className="text-xs font-semibold text-slate-700">
                      {loading ? (
                        'Searching jobs...'
                      ) : (
                        <span>
                          <strong className="text-slate-900 font-bold">{jobs.length}</strong> jobs found
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="best_match">Best match</option>
                      <option value="newest">Newest first</option>
                      <option value="relevance">Relevance</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilterChips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active:</span>
                    {activeFilterChips.map(chip => (
                      <span
                        key={chip.key}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold"
                      >
                        {chip.label}
                        <button
                          type="button"
                          onClick={() => removeFilter(chip.key)}
                          className="hover:text-blue-950 p-0.5 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFilters({ jobType: '', workMode: '', experienceLevel: '' })}
                      className="text-xs text-slate-500 hover:text-slate-800 underline ml-1"
                    >
                      Reset all
                    </button>
                  </div>
                )}

                {/* Job List */}
                {loading ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="bg-white h-44 rounded-xl border border-slate-200/80 p-5 space-y-3 skeleton-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-slate-200 rounded-lg shrink-0"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-100 rounded w-full mt-4"></div>
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {jobs.map(match => (
                        <JobCard key={match.job.id} jobMatch={match} studentId={profile?.id} />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="pt-4 flex justify-center">
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="px-6 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs flex items-center gap-2"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Loading more roles...</span>
                            </>
                          ) : (
                            <span>Load More Jobs</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200/90 p-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No matching jobs found</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Try adjusting your keywords, broadening your location preference, or clearing some filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword('');
                        setLocation('');
                        setFilters({ jobType: '', workMode: '', experienceLevel: '' });
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Clear search filters
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#F8F9FA] overflow-y-auto pb-24">
          <div className="p-4 sm:p-6 bg-white flex-1 min-h-full">
            <JobFilters
              filters={filters}
              setFilters={setFilters}
              totalResults={jobs.length}
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
