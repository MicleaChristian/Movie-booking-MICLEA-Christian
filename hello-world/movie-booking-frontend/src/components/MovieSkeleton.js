import React from 'react';

const MovieSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="animate-pulse">
      {/* Image placeholder */}
      <div className="bg-gray-200 h-64 w-full"></div>
      
      {/* Content placeholder */}
      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Footer placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

export default MovieSkeleton; 