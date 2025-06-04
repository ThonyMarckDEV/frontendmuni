import React from 'react';
import { Search, Building } from 'lucide-react';

const UserSearch = ({ searchTerm, setSearchTerm, selectedRole, setSelectedRole, roles, loadingRoles }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, email o DNI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={loadingRoles}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
            loadingRoles ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {loadingRoles ? (
            <option value="" disabled>
              CARGANDO...
            </option>
          ) : (
            <>
              <option value="">TODOS LOS ROLES</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre.toUpperCase()}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="absolute right-3 top-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;