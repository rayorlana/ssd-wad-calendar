import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { addMonths, subMonths } from 'date-fns';
import { Fjalla_One } from 'next/font/google';
import { UserCalendarEvent } from '@/components/CalendarEventItem';
import EventCalendar from '@/components/EventCalendar';
import { getUserCalendarEvents } from '@/utils/storage';

const fjallaOne = Fjalla_One({
  subsets: ['latin'],
  weight: '400',
});

export default function Home() {
  const [activeMonthDate, setActiveMonthDate] = useState<Date>(new Date());
  const [eventsData, setEventsData] = useState<UserCalendarEvent[]>([]);

  useEffect(() => {
    const data = getUserCalendarEvents();
    setEventsData(data);
  }, []);

  const handleNavPrevMonth = () => {
    setActiveMonthDate(subMonths(activeMonthDate, 1));
  };

  const handleNavNextMonth = () => {
    setActiveMonthDate(addMonths(activeMonthDate, 1));
  };

  // for mobile viewport experience, we will serve the desktop version since we are not doing responsive calendar view yet.
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (metaViewport) {
      metaViewport.content = 'shrink-to-fit=no, maximum-scale=1.75, user-scalable=yes';
      document.body.classList.add('min-w-[1000px]');
    }
    return () => {
      metaViewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no';
      document.body.classList.remove('min-w-[1000px]');
    };
  }, []);

  const renderCalendarMonthNav = () => {
    const activeCalendarMonth = activeMonthDate.toLocaleString('default', { month: 'long' });
    const activeCalendarYear = activeMonthDate.toLocaleString('default', { year: 'numeric' });
    return (
      <div className="flex items-center gap-2.5">
        <button
          className="w-10 select-none rounded border border-gray-200 p-1 shadow-sm transition-shadow duration-150 hover:shadow-lg"
          onClick={handleNavPrevMonth}
        >
          {`<`}
        </button>
        <button
          className="w-10 select-none rounded border border-gray-200 p-1 shadow-sm transition-shadow duration-150 hover:shadow-lg"
          onClick={handleNavNextMonth}
        >
          {`>`}
        </button>
        <div className="text-lg font-medium">{`${activeCalendarMonth} ${activeCalendarYear}`}</div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[60px] w-full items-center bg-white px-10 py-4 shadow-md">
        <div className="flex items-center gap-x-5">
          <h1 className={clsx(fjallaOne.className, 'select-none text-2xl font-bold text-primary')}>SSDCALENDAR</h1>
          {renderCalendarMonthNav()}
        </div>
      </header>
      <main className="px-6">
        <EventCalendar activeMonthDate={activeMonthDate} className="mt-2.5" eventsData={eventsData} onSuccessSaveData={setEventsData} />
      </main>
    </div>
  );
}
