import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { ApplicationEvent } from '../../types/application';

interface ApplicationTimelineProps {
  events: ApplicationEvent[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventTitle = (type: string) => {
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        Application History Timeline
      </h3>
      
      <div className="relative pl-2">
        {/* Vertical track */}
        <div className="absolute left-3.5 top-2 bottom-4 w-px bg-slate-200"></div>
        
        <div className="space-y-6">
          {sortedEvents.map((event, idx) => {
            const date = new Date(event.date);
            
            return (
              <div key={event.id} className="relative pl-7">
                {/* Node icon */}
                <div className="absolute -left-[1px] top-0.5 bg-white rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900">
                      {getEventTitle(event.type)}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {date.getHours() > 0 && ` · ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-700 mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-800">{event.answer}</p>
                    {event.notes && (
                      <p className="text-slate-500 mt-1 text-[11px] whitespace-pre-line">{event.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Active next step indicator */}
          <div className="relative pl-7">
            <div className="absolute -left-[1px] top-0.5 bg-white rounded-full">
              <Circle className="w-4 h-4 text-slate-300 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400">
                Awaiting Recruiter Response / Next Milestones...
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
