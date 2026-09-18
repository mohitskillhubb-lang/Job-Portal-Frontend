import { Application, ApplicationStatus } from '../types/application';

export interface FollowUpQuestion {
  stageId: string;
  question: string;
  options: { label: string; action: string }[];
  type: 'select' | 'form';
  formFields?: { name: string; label: string; type: string; options?: string[] }[];
}

export const applicationFollowUp = {
  getNextQuestion: (application: Application): FollowUpQuestion | null => {
    const status = application.status;
    
    switch (status) {
      case 'APPLIED':
        return {
          stageId: 'stage_1',
          question: 'Has the company viewed your application?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'APPLICATION_VIEWED' },
            { label: 'No', action: 'WAITING' },
            { label: 'Don\'t Know', action: 'WAITING' }
          ]
        };

      case 'APPLICATION_VIEWED':
        return {
          stageId: 'stage_2',
          question: 'Has a recruiter contacted you?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'RECRUITER_CONTACTED' },
            { label: 'No', action: 'WAITING' }
          ]
        };

      case 'RECRUITER_CONTACTED':
        return {
          stageId: 'stage_3',
          question: 'Did your interview scheduled ?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'INTERVIEW_SCHEDULED' },
            { label: 'No', action: 'WAITING' }
          ]
        };

      case 'INTERVIEW_SCHEDULED':
        return {
          stageId: 'stage_4',
          question: 'Did you Qualified interview?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'INTERVIEW_QUALIFIED' },
            { label: 'No', action: 'REJECTED' }
          ]
        };

      case 'INTERVIEW_QUALIFIED':
        return {
          stageId: 'stage_5',
          question: 'Did you received offer letter ?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'OFFER_RECEIVED' },
            { label: 'No', action: 'WAITING' }
          ]
        };
        
      case 'OFFER_RECEIVED':
        return {
          stageId: 'stage_6',
          question: 'Did you accept the offer?',
          type: 'select',
          options: [
            { label: 'Yes', action: 'OFFER_ACCEPTED' },
            { label: 'No', action: 'WITHDRAWN' },
            { label: 'Deciding', action: 'WAITING' }
          ]
        };

      default:
        return null;
    }
  }
};
