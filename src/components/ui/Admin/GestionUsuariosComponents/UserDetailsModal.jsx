import React from 'react';
import { X } from 'lucide-react';

const UserDetailsModal = ({ user, roles, setDetailsModalOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            DETALLES DEL USUARIO
          </h2>
          <button onClick={() => setDetailsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Nombre:</strong> {user.datos?.nombre || '-'}
          </p>
          <p>
            <strong>Apellido:</strong> {user.datos?.apellido || '-'}
          </p>
          <p>
            <strong>Email:</strong> {user.datos?.email || '-'}
          </p>
          <p>
            <strong>DNI:</strong> {user.datos?.dni || '-'}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.datos?.telefono || '-'}
          </p>
          <p>
            <strong>Rol:</strong>{' '}
            {roles.find((rol) => rol.id === user.idRol)?.nombre.toUpperCase() || '-'}
          </p>
          <p>
            <strong>Estado:</strong>{' '}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {user.estado ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </p>
          {user.idRol === 3 && (
            <p>
              <strong>Especialización:</strong> {user.datos?.especializacion || '-'}
            </p>
          )}
          {user.idRol === 2 && (
            <p>
              <strong>Área:</strong> {user.datos?.area || '-'}
            </p>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setDetailsModalOpen(false)}
            className="bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-lg shadow-lg hover:bg-gray-400"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;