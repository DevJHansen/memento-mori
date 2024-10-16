import { useState } from 'react';
import { MdTornado, MdClose } from 'react-icons/md';

interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (newDate: string) => void;
  setEndDate: (newDate: string) => void;
  handleReset: () => void;
}

function ToolsComponent({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleReset,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`fixed top-20 right-4 sm:right-8 md:right-12 lg:right-16 z-40 bg-accent border-2 border-accent rounded-full cursor-pointer transition-all hover:scale-125 duration-300 opacity-50 hover:opacity-100 ${
          isOpen && 'right-16'
        }`}
        onMouseLeave={() => setIsOpen(false)}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
      >
        <div className="rounded-full flex">
          <div
            className={`transform transition-all duration-300 ease-in-out flex ${
              isOpen ? 'w-fit opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <div
              className="bg-transparent p-2 rounded-l-full z-50"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              <MdClose size={20} />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full h-full py-2 px-4 text-sm rounded-none focus:outline-none border-r-[1px] border-accent bg-backgroundSecondary ${
                !isOpen && 'hidden'
              }`}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full h-full py-2 px-4 text-sm rounded-l-none rounded-r-full focus:outline-none bg-backgroundSecondary ${
                !isOpen && 'hidden'
              }`}
              placeholder="End Date"
            />
          </div>
          <div className="bg-transparent p-2 rounded-full">
            <MdTornado size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsComponent;
