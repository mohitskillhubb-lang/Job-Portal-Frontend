export type ApplicationStatus = 
  | 'APPLIED'
  | 'APPLICATION_VIEWED'
  | 'RECRUITER_CONTACTED'
  | 'ASSESSMENT_COMPLETED'
  | 'ASSESSMENT_PENDING'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'INTERVIEW_QUALIFIED'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'NO_RESPONSE'
  | 'REVIEWED';

export type ApplicationEvent = {
  id: string;
  applicationId: string;
  type: string;
  answer: string;
  date: string;
  notes?: string;
};

export type Application = {
  id: string;
  studentId: string;
  jobId: string;
  appliedDate: string;
  applicationSource: string;
  status: ApplicationStatus;
  lastUpdated: string;
  nextAction?: string;
  events: ApplicationEvent[];
  interviewDate?: string;
  interviewType?: string;
  interviewMode?: string;
  offerDetails?: {
    position: string;
    salary: string;
    joiningDate: string;
  };
};

export type SavedJob = {
  id: string;
  studentId: string;
  jobId: string;
  savedAt: string;
};
