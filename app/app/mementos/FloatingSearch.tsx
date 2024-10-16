import { useState } from 'react';
import { MdSearch } from 'react-icons/md';

function SearchComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`fixed top-20 right-4 sm:right-8 md:right-12 lg:right-16 z-50 bg-accent border-2 border-accent rounded-full cursor-pointer transition-all hover:scale-125 duration-300 opacity-50 hover:opacity-100 ${
          isOpen && 'right-12'
        }`}
        onMouseLeave={() => setIsOpen(false)}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
      >
        <div className="rounded-full flex">
          <div
            className={`transform transition-all duration-300 ease-in-out ${
              isOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <input
              type="text"
              className="w-full h-full py-2 px-4 text-sm rounded-full focus:outline-none bg-backgroundSecondary"
              placeholder="Search..."
            />
          </div>
          <div className="bg-transparent p-2 rounded-full">
            <MdSearch size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
