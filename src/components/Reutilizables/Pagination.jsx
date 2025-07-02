import React from 'react';

const Pagination = ({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  hasMorePages,
  onPageChange,
  onPerPageChange,
  loading,
  showPerPageSelector,
  perPageOptions,
}) => {
  if (lastPage <= 1 && !showPerPageSelector) return null;

  // Calculate page numbers to display
  const getPageRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    
    // Always include page 1
    pages.push(1);

    // Calculate start and end of page range
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(lastPage - 1, currentPage + delta);

    // Add ellipsis after page 1 if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < lastPage - 1) {
      pages.push('...');
    }

    // Always include last page if > 1
    if (lastPage > 1) {
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:justify-end">
        <div className="mr-4">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{from || 0}</span> a{' '}
            <span className="font-medium">{to || 0}</span> de{' '}
            <span className="font-medium">{total || 0}</span> resultados
          </p>
        </div>
        {showPerPageSelector && (
          <div className="mr-4">
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {(perPageOptions || [5, 8, 10, 15, 20, 25]).map((option) => (
                <option key={option} value={option}>
                  {option} por página
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {getPageRange().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === page ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasMorePages || loading}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;