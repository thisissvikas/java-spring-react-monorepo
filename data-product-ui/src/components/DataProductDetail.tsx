import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchDataProductById, deleteDataProduct, clearCurrentDataProduct } from '../store/dataProductSlice';

export const DataProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentDataProduct, loading, error } = useSelector(
    (state: RootState) => state.dataProducts
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDataProductById(id));
    }
    return () => {
      dispatch(clearCurrentDataProduct());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this data product?')) {
      await dispatch(deleteDataProduct(id));
      navigate('/data-products');
    }
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

  if (!currentDataProduct) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Data Product Not Found</h2>
        <Link to="/data-products" className="text-blue-600 hover:text-blue-500">
          Back to Data Products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/data-products" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Data Products
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentDataProduct.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSensitivityBadgeColor(currentDataProduct.sensitivityCategory)}`}>
                  {currentDataProduct.sensitivityCategory}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentDataProduct.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentDataProduct.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/data-products/${currentDataProduct.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {currentDataProduct.description && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{currentDataProduct.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Portfolio</dt>
                  <dd className="text-sm text-gray-900">{currentDataProduct.portfolio}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="text-sm text-gray-900">{currentDataProduct.source}</dd>
                </div>
                {currentDataProduct.dataFormat && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data Format</dt>
                    <dd className="text-sm text-gray-900">{currentDataProduct.dataFormat}</dd>
                  </div>
                )}
                {currentDataProduct.owner && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Owner</dt>
                    <dd className="text-sm text-gray-900">{currentDataProduct.owner}</dd>
                  </div>
                )}
                {currentDataProduct.retentionPeriodDays && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Retention Period</dt>
                    <dd className="text-sm text-gray-900">{currentDataProduct.retentionPeriodDays} days</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(currentDataProduct.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(currentDataProduct.updatedAt).toLocaleString()}
                  </dd>
                </div>
                {currentDataProduct.tags && currentDataProduct.tags.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {currentDataProduct.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};