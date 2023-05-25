import { Listbox } from '@headlessui/react';

export interface SelectOption {
  key: string;
  value: string;
}

interface EventTimeSelectProps {
  value: SelectOption | null;
  onSelect: (val: SelectOption) => void;
  options: SelectOption[];
}

const EventTimeSelect = ({ value: selected, onSelect, options }: EventTimeSelectProps) => {
  return (
    <Listbox value={selected} onChange={onSelect} className="relative" as="div">
      <Listbox.Button className="border-b border-b-gray-400/60 p-1.5 hover:border-b-gray-400 hover:bg-gray-200/50">
        {selected?.value ?? ''}
      </Listbox.Button>
      <Listbox.Options className="absolute left-0 z-20 max-h-60 w-28 overflow-auto bg-white py-1 text-gray-500 shadow-md outline-none">
        {options.map((opt, index) => (
          <Listbox.Option key={index} value={opt} className="relative cursor-pointer select-none px-2.5 py-1.5 hover:bg-gray-200/50">
            {opt.value}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default EventTimeSelect;
