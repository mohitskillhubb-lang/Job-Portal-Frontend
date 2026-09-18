import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ProfileSetup } from './pages/ProfileSetup';
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { RecommendedJobs } from './pages/RecommendedJobs';
import { SavedJobs } from './pages/SavedJobs';
import { AppliedJobs } from './pages/AppliedJobs';
import { ApplicationDetails } from './pages/ApplicationDetails';
import { Profile } from './pages/Profile';
import { storageService } from './services/storageService';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const profile = storageService.getStudentProfile();
  if (!profile || !profile.profileCompleted) {
    return <Navigate to="/profile/setup" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/profile/setup" replace />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/jobs/:jobId" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
        <Route path="/recommended" element={<PrivateRoute><RecommendedJobs /></PrivateRoute>} />
        <Route path="/saved-jobs" element={<PrivateRoute><SavedJobs /></PrivateRoute>} />
        <Route path="/applied-jobs" element={<PrivateRoute><AppliedJobs /></PrivateRoute>} />
        <Route path="/applications/:applicationId" element={<PrivateRoute><ApplicationDetails /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
