import React from 'react';
import { format } from 'date-fns';

export interface CalendarEvent {
  name: string;
  date: string;
  invitees?: string[];
}

export interface UserCalendarEvent extends CalendarEvent {
  id: string;
  color?: '#157F1F' | '#FF4242' | '#FB62F6' | '#2E4057' | '#4C2E05';
}

interface CalendarEventItemProps {
  event: UserCalendarEvent;
  onClick: () => void;
}

function CalendarEventItem({ event, onClick }: CalendarEventItemProps) {
  return (
    <div
      className="flex flex-col gap-y-0.5 overflow-hidden rounded-lg px-2.5 py-1 text-xs text-white hover:opacity-90"
      style={{ backgroundColor: event?.color }}
      onClick={evt => {
        evt.preventDefault();
        evt.stopPropagation();
        onClick();
      }}
    >
      <div className="line-clamp-1">{event?.name ?? ''}</div>
      {event?.invitees?.length && <div className="line-clamp-1">{event?.invitees.join()}</div>}
      {event?.date && <div className="line-clamp-1">{event?.date ? format(new Date(event?.date), 'hh:mmaaa') : ''}</div>}
    </div>
  );
}

export default CalendarEventItem;
