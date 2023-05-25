import { useMemo, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import clsxm from '@/utils/clsxm';
import { determineInitialEventTime, getEventTimeOptions } from '@/utils/date';
import { UserCalendarEvent } from './CalendarEventItem';
import EventTimeSelect, { SelectOption } from './EventTimeSelect';
import { IconClose } from './icons/IconClose';

export interface AddEditEventModalState {
  eventName: string;
  eventTime: SelectOption | null;
  eventInviteesEmail: string;
}

interface AddEditEventModalProps {
  onClose: () => void;
  data: UserCalendarEvent;
  onSave: (state: AddEditEventModalState) => void;
  onDelete: () => void;
}

const AddEditEventModal = ({ onClose, data, onSave, onDelete }: AddEditEventModalProps) => {
  const [eventName, setEventName] = useState(data?.name ?? '');
  const [eventTime, setEventTime] = useState<SelectOption | null>(data?.date ? determineInitialEventTime(new Date(data?.date)) : null);
  const [eventInviteesEmail, setEventInviteesEmail] = useState(data?.invitees?.length ? data?.invitees.join() : '');
  const focusRef = useRef<HTMLInputElement | null>(null);

  const timeOptions = useMemo(() => getEventTimeOptions(), []);

  const renderEventNameInput = () => (
    <div className="flex items-center">
      <label className="mr-5 w-14 font-medium text-primary">Name</label>
      <input
        ref={focusRef}
        className="flex-1 border-b border-b-gray-400/60 p-1.5 pl-0 text-sm outline-none transition-all duration-150 hover:bg-gray-200/50 focus:border-b-primary focus:bg-transparent"
        placeholder="Event name / title"
        value={eventName}
        onChange={evt => setEventName(evt.target.value)}
        // removes starting whitespace from input val
        onBlur={evt => setEventName(evt.target.value.trim())}
      />
    </div>
  );

  const renderEventDatetimeInput = () => (
    <div className="flex items-center text-sm">
      <label className="mr-5 w-14 font-medium text-primary">Date</label>
      <div className="mr-1">{data?.date ? format(new Date(data?.date), 'E, d MMM') : ''}</div>
      <EventTimeSelect value={eventTime ?? null} onSelect={setEventTime} options={timeOptions} />
    </div>
  );

  const renderEventInviteesInput = () => (
    <div className="flex items-center">
      <label className="mr-5 w-14 font-medium text-primary">Invitees</label>
      <input
        className="flex-1 border-b border-b-gray-400/60 p-1.5 pl-0 text-sm outline-none transition-all duration-150 hover:bg-gray-200/50 focus:border-b-primary focus:bg-transparent"
        placeholder="Invitees email (separate by comma for multiple invitee)"
        value={eventInviteesEmail}
        onChange={evt => setEventInviteesEmail(evt.target.value)}
      />
    </div>
  );

  const renderModalBody = () => {
    const isDisabled = !eventName;
    return (
      <form className="mt-7 flex flex-col gap-y-2.5">
        {renderEventNameInput()}
        {renderEventDatetimeInput()}
        {renderEventInviteesInput()}
        <div className="mt-5 flex justify-between">
          <div>
            {!!data?.id && (
              <button
                type="button"
                className={clsxm(
                  'w-[100px] rounded bg-red-500 px-4 py-1.5 text-center text-sm font-medium uppercase text-white shadow-md transition-all duration-150 hover:opacity-90',
                  {
                    'cursor-not-allowed bg-gray-400': isDisabled,
                  }
                )}
                disabled={!eventName}
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
          <button
            type="submit"
            className={clsxm(
              'w-[100px] rounded bg-primary px-4 py-1.5 text-center text-sm font-medium uppercase text-white shadow-md transition-all duration-150 hover:opacity-90',
              {
                'cursor-not-allowed bg-gray-400': isDisabled,
              }
            )}
            disabled={!eventName}
            onClick={() => onSave({ eventName, eventTime, eventInviteesEmail })}
          >
            Save
          </button>
        </div>
      </form>
    );
  };
  return (
    <Dialog open={true} onClose={onClose} className="relative z-40" initialFocus={focusRef}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative mx-auto w-full max-w-xl rounded-3xl bg-white p-12 pb-7">
          <Dialog.Title className="text-green absolute left-12 top-5 text-left text-2xl font-bold uppercase tracking-wide text-primary">
            {data?.id ? 'Edit Event' : 'Add Event'}
          </Dialog.Title>
          <button className="absolute right-12 top-5" onClick={onClose}>
            <IconClose className="h-4 w-4" />
          </button>
          {renderModalBody()}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddEditEventModal;
