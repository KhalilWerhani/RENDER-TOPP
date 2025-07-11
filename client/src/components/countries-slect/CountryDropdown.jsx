import React, { useRef, useState } from 'react'

function CountryDropdown() {
      const countries = [
        { code: '+33', name: 'France', flag: '🇫🇷' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' },
        { code: '+49', name: 'Germany', flag: '🇩🇪' },
        { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
      ];
    
      const [selected, setSelected] = useState(countries[0]);
      const [open, setOpen] = useState(false);
      const dropdownRef = useRef(null);
    
      const handleSelect = (country) => {
        setSelected(country);
        setOpen(false);
        console.log('Code sélectionné:', country.code);
      };
    
      const toggleDropdown = () => setOpen(!open);
    return (
        <div className="relative ">
          <div className="flex items-center text-indigo-100 bg-[#333A5C] rounded-md border border-gray-300 ">
            <button
              onClick={toggleDropdown}
              id="dropdown-phone-button"
              className=" shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-[#333A5C] border border-gray-300 rounded-s-lg hover:bg-[#333A5C] focus:ring-4 focus:outline-none focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              <span className="me-2">{selected.flag}</span> {selected.code}
              <svg className="w-4 h-4 ms-2" aria-hidden="true" fill="none" viewBox="0 0 20 12">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 1 10 10 1 1" />
              </svg>
            </button>
          </div>
    
          {open && (
            <ul
              ref={dropdownRef}
              className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg overflow-auto max-h-60 border border-gray-200"
            >
              {countries.map((country, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(country)}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                >
                  <span className="me-2 text-lg">{country.flag}</span>
                  {country.name} ({country.code})
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };


export default CountryDropdown

