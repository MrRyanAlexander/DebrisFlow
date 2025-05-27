'use client';
import React from 'react'; // Added React import
import type { TicketEvent, TicketEventType } from '@/types';
import { TICKET_EVENT_TYPES_ORDER, TICKET_EVENTS_CONFIG, EVENT_STATUS_COLORS } from '@/lib/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/lib/constants';

interface EventProgressIndicatorProps {
  events: TicketEvent[];
  className?: string;
}

export default function EventProgressIndicator({ events, className }: EventProgressIndicatorProps) {
  // Create a map of events by type for quick lookup
  const eventsMap = new Map(events.map(event => [event.type, event]));

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("flex items-center space-x-1 overflow-x-auto pb-2 -mb-2", className)}>
        {TICKET_EVENT_TYPES_ORDER.map((eventType, index) => {
          const event = eventsMap.get(eventType);
          const eventConfig = TICKET_EVENTS_CONFIG[eventType];
          const statusConfig = event ? EVENT_STATUS_COLORS[event.status] : EVENT_STATUS_COLORS.pending;
          const IconComponent = statusConfig.icon;

          const isLast = index === TICKET_EVENT_TYPES_ORDER.length - 1;
          const isCompletedOrActive = event && (event.status === 'completed' || event.status === 'active');

          return (
            <React.Fragment key={eventType}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center text-center">
                     <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2",
                        event?.status === 'completed' ? 'bg-green-100 border-green-500' :
                        event?.status === 'active' ? 'bg-blue-100 border-blue-500' :
                        event?.status === 'error' ? 'bg-red-100 border-red-500' :
                        event?.status === 'skipped' ? 'bg-orange-100 border-orange-500' :
                        'bg-gray-100 border-gray-300',
                        statusConfig.iconClasses
                      )}>
                      <IconComponent 
                        className={cn(
                          "h-4 w-4",
                           event?.status === 'active' && "animate-spin"
                        )} />
                    </div>
                    <span className="mt-1.5 text-xs text-muted-foreground max-w-[60px] truncate leading-tight" title={eventType}>
                        {eventType.split(' ').slice(0,2).join(' ')} {/* Show first two words */}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">{eventType}</p>
                  {event && (
                    <>
                      <p className="text-sm capitalize">Status: {event.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.timestamp), DATE_TIME_FORMAT)}
                      </p>
                      {event.notes && <p className="text-xs italic">Notes: {event.notes}</p>}
                    </>
                  )}
                  {!event && <p className="text-sm">Status: Pending</p>}
                </TooltipContent>
              </Tooltip>
              {!isLast && (
                <div className={cn(
                  "h-0.5 w-6 flex-shrink-0",
                  isCompletedOrActive ? 'bg-green-500' : 'bg-gray-300'
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
