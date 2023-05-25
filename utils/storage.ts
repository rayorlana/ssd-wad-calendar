import { UserCalendarEvent } from '@/components/CalendarEventItem';

const USER_CALENDAR_EVENTS_KEY = 'ssd_uce';

export const getUserCalendarEvents = (): UserCalendarEvent[] => {
  const data = localStorage.getItem(USER_CALENDAR_EVENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const setUserCalendarEvents = (data: UserCalendarEvent[]) => {
  localStorage.setItem(USER_CALENDAR_EVENTS_KEY, JSON.stringify(data));
};
