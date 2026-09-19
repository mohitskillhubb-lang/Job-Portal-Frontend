import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualProfileForm } from '../components/profile/ManualProfileForm';
import { storageService } from '../services/storageService';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const profile = storageService.getStudentProfile();
    if (profile && profile.profileCompleted) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col antialiased font-sans">
      <ManualProfileForm />
    </div>
  );
};
