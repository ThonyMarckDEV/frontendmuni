import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const PaginationComponent = ({ currentPage, totalPages, setCurrentPage }) => {
  // Función para generar los números de página a mostrar
  const getPageNumbers = () => {
    const delta = 2; // Páginas a mostrar alrededor de la página actual
    const range = [];
    const rangeWithDots = [];

    // Calcular el rango de páginas a mostrar
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Agregar primera página
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Agregar páginas del rango
    rangeWithDots.push(...range);

    // Agregar última página
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Eliminar duplicados
    return rangeWithDots.filter((page, index, array) => {
      if (typeof page === 'number') {
        return array.indexOf(page) === index;
      }
      return true;
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Botón Anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        Siguiente
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>

      {/* Información de página actual */}
      <div className="hidden sm:flex items-center ml-4">
        <span className="text-sm text-gray-700">
          Página <span className="font-medium">{currentPage}</span> de{' '}
          <span className="font-medium">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};

export { PaginationComponent };