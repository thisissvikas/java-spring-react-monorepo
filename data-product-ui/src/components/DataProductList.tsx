import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchDataProducts, setFilters, DataProduct } from '../store/dataProductSlice';

export const DataProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataProducts, pageInfo, filters, loading, error } = useSelector(
    (state: RootState) => state.dataProducts
  );

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(fetchDataProducts({
      page: currentPage,
      size: pageInfo.size,
      ...filters,
    }));
  }, [dispatch, currentPage, pageInfo.size, filters]);

  const handleFilterChange = (newFilters: { portfolio?: string; sensitivityCategory?: string }) => {
    dispatch(setFilters(newFilters));
    setCurrentPage(0);
  };

  const getSensitivityBadgeColor = (category: string) => {
    const colors = {
      PUBLIC: 'bg-green-100 text-green-800',
      INTERNAL: 'bg-yellow-100 text-yellow-800',
      CONFIDENTIAL: 'bg-orange-100 text-orange-800',
      RESTRICTED: 'bg-red-100 text-red-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Data Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your enterprise data products and their metadata.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio</label>
            <select
              value={filters.portfolio || ''}
              onChange={(e) => handleFilterChange({ ...filters, portfolio: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Portfolios</option>
              <option value="Marketing Analytics">Marketing Analytics</option>
              <option value="Sales Operations">Sales Operations</option>
              <option value="Research">Research</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sensitivity Category</label>
            <select
              value={filters.sensitivityCategory || ''}
              onChange={(e) => handleFilterChange({ ...filters, sensitivityCategory: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="PUBLIC">Public</option>
              <option value="INTERNAL">Internal</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="RESTRICTED">Restricted</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                handleFilterChange({});
                setCurrentPage(0);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Products Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataProducts.map((dataProduct: DataProduct) => (
          <div key={dataProduct.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {dataProduct.name}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSensitivityBadgeColor(dataProduct.sensitivityCategory)}`}>
                  {dataProduct.sensitivityCategory}
                </span>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {dataProduct.description || 'No description available'}
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Portfolio:</span>{' '}
                  <span className="text-gray-900">{dataProduct.portfolio}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Source:</span>{' '}
                  <span className="text-gray-900">{dataProduct.source}</span>
                </div>
                {dataProduct.tags && dataProduct.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dataProduct.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                    {dataProduct.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{dataProduct.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Link
                    to={`/data-products/${dataProduct.id}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/data-products/${dataProduct.id}/edit`}
                    className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  dataProduct.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dataProduct.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageInfo.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {pageInfo.page * pageInfo.size + 1} to{' '}
            {Math.min((pageInfo.page + 1) * pageInfo.size, pageInfo.totalElements)} of{' '}
            {pageInfo.totalElements} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= pageInfo.totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};