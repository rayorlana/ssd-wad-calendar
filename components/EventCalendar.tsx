import React, { useMemo, useState } from 'react';
import { formatISO, isSameDay, isToday } from 'date-fns';
import { toast } from 'react-hot-toast';
import clsxm from '@/utils/clsxm';
import { getCalendarDates } from '@/utils/date';
import { EVENT_ITEM_COLORS, generateRandomKey } from '@/utils/helper';
import { getUserCalendarEvents, setUserCalendarEvents } from '@/utils/storage';
import AddEditEventModal, { AddEditEventModalState } from './AddEditEventModal';
import CalendarEventItem, { UserCalendarEvent } from './CalendarEventItem';

const HEADER_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MAX_EVENT_PER_DAY = 3;

enum ModalType {
  addEvent,
  editEvent,
}

interface CalendarProps {
  activeMonthDate: Date;
  eventsData: UserCalendarEvent[];
  className?: string;
  onSuccessSaveData: (data: UserCalendarEvent[]) => void;
}

interface ModalInfo {
  type?: ModalType;
  data?: Partial<UserCalendarEvent>;
}

const EventCalendar = ({ activeMonthDate, eventsData, className, onSuccessSaveData }: CalendarProps) => {
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);
  const calendarDates = useMemo(() => getCalendarDates(new Date(activeMonthDate)), [activeMonthDate]);

  // @ts-expect-error filtered EVENT_ITEM_COLORS type mismatch
  const getRandomEventItemColor = existingColors => {
    const availableColors = EVENT_ITEM_COLORS.filter(color => !existingColors.includes(color));
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };

  const handleDismissModal = () => {
    setModalInfo(null);
  };

  const handleAttemptAddEvent = (date: Date) => {
    setModalInfo({
      type: ModalType.addEvent,
      data: {
        date: formatISO(date),
      },
    });
  };

  const handleAttemptEditEvent = (data: UserCalendarEvent) => {
    setModalInfo({
      type: ModalType.editEvent,
      data: {
        ...data,
      },
    });
  };

  const handleDeleteEvent = () => {
    let existingEventsData = getUserCalendarEvents();
    if (existingEventsData) {
      existingEventsData = existingEventsData?.filter(item => item.id !== modalInfo?.data?.id);
      setUserCalendarEvents(existingEventsData);
      toast('Event Deleted!');
      onSuccessSaveData(existingEventsData);
      handleDismissModal();
    }
  };

  const handleSaveEvent = (state: AddEditEventModalState) => {
    if (modalInfo?.data) {
      const isEdit = !!modalInfo.data?.id;

      // id payload
      const id = isEdit && modalInfo.data?.id ? modalInfo.data.id : generateRandomKey();
      // name payload
      const name = state?.eventName;
      // date payload
      const date = new Date(modalInfo.data?.date as string);
      if (state?.eventTime?.key) {
        const [hours, minutes] = state.eventTime.key.split(':');
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));
      }
      // color payload
      let color;
      if (isEdit) {
        color = modalInfo.data?.color;
      } else {
        // get existing color in the same event date to prevent duplicate event color
        const existingColors = eventsData?.length ? eventsData.filter(event => isSameDay(new Date(event.date), date)).map(event => event.color) : [];
        if (existingColors.length) {
          color = getRandomEventItemColor(existingColors);
        }
      }

      const eventPayload: UserCalendarEvent = {
        id,
        name,
        date: formatISO(date),
        ...(state?.eventInviteesEmail.length > 0 && { invitees: state.eventInviteesEmail.split(',') }),
        color,
      };
      let existingEventsData = getUserCalendarEvents();
      if (modalInfo?.data?.id) {
        existingEventsData = existingEventsData.map(item => {
          if (item.id === modalInfo?.data?.id) return eventPayload;
          return item;
        });
      } else {
        existingEventsData.push(eventPayload);
      }
      setUserCalendarEvents(existingEventsData);
      toast('Event Saved!');
      onSuccessSaveData(existingEventsData);
      handleDismissModal();
    }
  };

  const renderCalendarHeader = () => {
    return (
      <div className="sticky top-0 z-10 grid grid-cols-7 border border-b-0 border-gray-200 bg-primary text-center font-medium text-white">
        {HEADER_DAYS.map(day => (
          <div key={day} className="p-2.5">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarBody = () => {
    return (
      <div className="grid grid-cols-7 divide-x divide-gray-200 border border-gray-200">
        {calendarDates.map((date, index) => {
          const eventItems = eventsData?.length ? eventsData.filter(event => isSameDay(new Date(event.date), date)) : [];

          // Sort Event Items from earliest time to latest time if exists
          if (eventItems.length) {
            eventItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }

          const dateVal = date.getDate();
          return (
            <div
              key={`${index}-${generateRandomKey()}`}
              className="relative aspect-square border-b border-b-gray-200 p-1 transition-all duration-300 hover:bg-gray-100"
              onClick={() => {
                if (eventItems?.length === MAX_EVENT_PER_DAY) {
                  toast.error(`Maximum ${MAX_EVENT_PER_DAY} events per day!`);
                } else {
                  handleAttemptAddEvent(date);
                }
              }}
            >
              {date && (
                <div
                  className={clsxm('absolute left-1 top-1 flex h-6 w-6 select-none items-center justify-center text-xs font-medium', {
                    'rounded-full bg-primary p-1 text-white': isToday(date),
                  })}
                >
                  {dateVal}
                </div>
              )}
              <div className="mt-7 flex flex-col gap-y-1">
                {eventItems.map((event, index) => (
                  <CalendarEventItem key={index} event={event} onClick={() => handleAttemptEditEvent(event)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={clsxm('relative w-full', className)}>
        {renderCalendarHeader()}
        {renderCalendarBody()}
      </div>
      {(modalInfo?.type === ModalType.addEvent || modalInfo?.type === ModalType.editEvent) && (
        <AddEditEventModal
          data={modalInfo?.data as UserCalendarEvent}
          onClose={handleDismissModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  );
};

export default EventCalendar;
