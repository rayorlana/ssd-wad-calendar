import { eachDayOfInterval, endOfMonth, getDay, startOfMonth, subMonths, addMonths, subDays, addDays, format } from 'date-fns';
import { SelectOption } from '@/components/EventTimeSelect';

/**
 *
 * @param date initial calendar date to determine month/year to generate the calendar dates
 * @returns array of calendar dates per month view, including prev/next month date that may fit in the calendar grid
 */
export function getCalendarDates(date = new Date()): Date[] {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  const startDay = getDay(startDate); // 0 (Sunday) to 6 (Saturday)
  const preceedingDays = startDay; // ex: if start day = 1 (Monday), we need to display 1 preceeding day from prev month on sunday.

  if (preceedingDays > 0) {
    const prevMonth = subMonths(date, 1);
    const prevMonthEndDate = endOfMonth(prevMonth);
    const prevMonthDates = eachDayOfInterval({ start: subDays(prevMonthEndDate, preceedingDays - 1), end: prevMonthEndDate });
    dates.unshift(...prevMonthDates);
  }

  const endDateDay = endDate.getDay();
  if (endDateDay !== 6) {
    const followingDays = 6 - endDateDay;
    const nextMonth = addMonths(date, 1);
    const nextMonthStartDate = startOfMonth(nextMonth);
    const nextMonthDates = eachDayOfInterval({ start: nextMonthStartDate, end: addDays(nextMonthStartDate, followingDays - 1) });
    dates.push(...nextMonthDates);
  }

  return dates;
}

export function getEventTimeOptions(): SelectOption[] {
  const eventTimeOptions: SelectOption[] = [];
  const startTime = new Date().setHours(0, 0, 0); // 12:00 AM
  const endTime = new Date().setHours(23, 59, 59); // 11:59 PM

  const currentTime = new Date(startTime);
  while (currentTime.getTime() <= endTime) {
    const key = String(`${currentTime.getHours()}:${currentTime.getMinutes()}`);
    const value = format(currentTime, 'hh:mmaaa');
    eventTimeOptions.push({ key, value });
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return eventTimeOptions;
}

export function determineInitialEventTime(date: Date): SelectOption {
  const key = String(`${date.getHours()}:${date.getMinutes()}`);
  const value = format(date, 'hh:mmaaa');
  return { key, value };
}
