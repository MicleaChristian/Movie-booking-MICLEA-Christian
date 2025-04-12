import React, { useState } from 'react';

const MoviesSearchPagination = ({ onSearch, onPageChange, onPageSizeChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    onPageSizeChange(newPageSize);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    onPageChange(currentPage + 1);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Search
          </button>
        </div>
      </form>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-3 md:mb-0">
          <label htmlFor="pageSize" className="mr-2 text-gray-700">
            Results per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md mr-2 ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 mx-2">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesSearchPagination; 