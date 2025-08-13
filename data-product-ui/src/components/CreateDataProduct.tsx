import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { createDataProduct } from '../store/dataProductSlice';

export const CreateDataProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    portfolio: '',
    source: '',
    sensitivityCategory: 'INTERNAL' as const,
    dataFormat: '',
    owner: '',
    tags: '',
    retentionPeriodDays: 365,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataProduct = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        retentionPeriodDays: formData.retentionPeriodDays || undefined,
      };

      await dispatch(createDataProduct(dataProduct));
      navigate('/data-products');
    } catch (err) {
      setError('Failed to create data product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'retentionPeriodDays' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Data Product</h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter data product name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe this data product"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                    Portfolio *
                  </label>
                  <input
                    type="text"
                    id="portfolio"
                    name="portfolio"
                    required
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Business portfolio"
                  />
                </div>

                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                    Source *
                  </label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    required
                    value={formData.source}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Data source system"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sensitivityCategory" className="block text-sm font-medium text-gray-700">
                    Sensitivity Category *
                  </label>
                  <select
                    id="sensitivityCategory"
                    name="sensitivityCategory"
                    required
                    value={formData.sensitivityCategory}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="INTERNAL">Internal</option>
                    <option value="CONFIDENTIAL">Confidential</option>
                    <option value="RESTRICTED">Restricted</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dataFormat" className="block text-sm font-medium text-gray-700">
                    Data Format
                  </label>
                  <input
                    type="text"
                    id="dataFormat"
                    name="dataFormat"
                    value={formData.dataFormat}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="JSON, CSV, Parquet, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                    Owner
                  </label>
                  <input
                    type="email"
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="owner@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="retentionPeriodDays" className="block text-sm font-medium text-gray-700">
                    Retention Period (Days)
                  </label>
                  <input
                    type="number"
                    id="retentionPeriodDays"
                    name="retentionPeriodDays"
                    min="1"
                    max="3650"
                    value={formData.retentionPeriodDays}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Data Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};