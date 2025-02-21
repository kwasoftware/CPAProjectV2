/*
This file allows us to have see a list of job suggestions on the website as we type in job inputs
*/

import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { Search, Check } from 'lucide-react';
import debounce from 'lodash/debounce';
import CareerCallAPI from './CareerCallAPI';

const api = new CareerCallAPI();

const JobSearchInput = ({ value, onChange, placeholder, disabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = debounce(async (searchText) => {
    if (!searchText || searchText.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.getJobSuggestions(searchText);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  return (
    <Combobox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <div className="relative w-full">
          <Combobox.Input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder={placeholder}
            displayValue={(job) => job || query}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(event.target.value);
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>
          ) : suggestions.length === 0 && query !== '' ? (
            <div className="px-4 py-2 text-sm text-gray-700">No results found</div>
          ) : (
            suggestions.map((job) => (
              <Combobox.Option
                key={job}
                value={job}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {job}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default JobSearchInput;