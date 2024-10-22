import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { mementosState } from './recoil';
import { getMementos } from '@/lib/api/momento';
import { LoadingSpinner } from '@/components/LoadingSpinner';

function SearchComponent() {
  const [mementos, setMementos] = useRecoilState(mementosState);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const handleGetMementos = async () => {
      if (!search) {
        return;
      }

      setSearchLoading(true);

      try {
        const res = await getMementos(0, search);

        setMementos({
          status: 'success',
          results: res,
        });
        setSearchLoading(false);
      } catch (error) {
        console.error(error);
        setMementos({
          status: 'error',
          results: null,
        });
        setSearchLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleGetMementos();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value) {
      try {
        setSearchLoading(true);
        const res = await getMementos(0);

        setMementos({
          status: 'success',
          results: res,
        });
        setSearchLoading(false);
      } catch (error) {
        console.error(error);
        setMementos({
          status: 'error',
          results: null,
        });
        setSearchLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className={`fixed top-20 right-4 sm:right-8 md:right-12 lg:right-16 z-40 bg-accent border-2 border-accent rounded-full cursor-pointer transition-all hover:scale-125 duration-300 opacity-50 hover:opacity-100 ${
          isOpen && 'right-[56px] md:right-12'
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
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="bg-transparent p-2 rounded-full">
            {searchLoading ? <LoadingSpinner /> : <MdSearch size={20} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
