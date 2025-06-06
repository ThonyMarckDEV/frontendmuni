import React from 'react';
import { Search } from 'lucide-react';

const AreaSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h- tann5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre del área"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default AreaSearch;
