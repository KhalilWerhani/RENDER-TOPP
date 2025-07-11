import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';
import { debounce } from 'lodash';

const SearchEntreprise = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimeoutRef = useRef(null);

  // Single moving spinner component
  const ElegantSpinner = () => (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-[#f4d47c] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Debounced search function with extended spinner
  const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSpinner(false);
      return;
    }

    setIsLoading(true);
    setShowSpinner(true);
    
    try {
      const response = await axios.get(`/api/entreprise/rechercher`, {
        params: { query: searchQuery },
      });

      // Minimum spinner display time (1.5 seconds)
      spinnerTimeoutRef.current = setTimeout(() => {
        if (typeof response.data === 'string' && response.data.startsWith('<!DOCTYPE html')) {
          setResults([]);
        } else {
          setResults(Array.isArray(response.data) ? response.data : []);
        }
        setShowSpinner(false);
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      console.error("Search error:", err);
      spinnerTimeoutRef.current = setTimeout(() => {
        setResults([]);
        setShowSpinner(false);
        setIsLoading(false);
      }, 1500);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
      if (spinnerTimeoutRef.current) {
        clearTimeout(spinnerTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (entreprise) => {
    setSelectedItem(entreprise);
    onSelect(entreprise);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedItem(null);
    setShowSpinner(false);
    if (spinnerTimeoutRef.current) {
      clearTimeout(spinnerTimeoutRef.current);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search Form */}
      <div className="relative">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Rechercher par nom, SIREN ou dirigeant..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={selectedItem}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-16 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Selected Item */}
      {selectedItem && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" size={20} />
                <h3 className="font-bold text-lg text-gray-800">{selectedItem.nom}</h3>
              </div>
              <div className="ml-7 mt-1 text-sm text-gray-600">
                <p>SIRET: {selectedItem.siret}</p>
                <p>Adresse: {selectedItem.adresse}</p>
              </div>
            </div>
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Search Results Container */}
      {!selectedItem && query && (
        <div className="mt-2 border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200">
          {/* Show spinner during loading or minimum display time */}
          {(showSpinner || isLoading) && <ElegantSpinner />}

          {/* Results List */}
          {!showSpinner && results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((entreprise) => (
                <div
                  key={entreprise.siret}
                  onClick={() => handleSelect(entreprise)}
                  onMouseEnter={() => setHoveredItem(entreprise.siret)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                    hoveredItem === entreprise.siret 
                      ? 'bg-[#f4d47c]/20' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-800">{entreprise.nom}</h4>
                  <div className="mt-1 text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">SIRET:</span> {entreprise.siret}</p>
                    <p><span className="font-medium">Adresse:</span> {entreprise.adresse}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchEntreprise;