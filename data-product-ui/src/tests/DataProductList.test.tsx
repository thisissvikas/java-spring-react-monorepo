import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { DataProductList } from '../components/DataProductList';
import dataProductReducer from '../store/dataProductSlice';

// Mock the API service
jest.mock('../services/dataProductApi', () => ({
  dataProductApi: {
    getAllDataProducts: jest.fn(() => Promise.resolve({
      data: {
        content: [
          {
            id: '1',
            name: 'Test Data Product',
            portfolio: 'Test Portfolio',
            source: 'Test Source',
            sensitivityCategory: 'INTERNAL',
            isActive: true,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          }
        ],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }
    })),
  },
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      dataProducts: dataProductReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('DataProductList', () => {
  test('renders data product list', async () => {
    renderWithProviders(<DataProductList />);
    
    expect(screen.getByText('Data Products')).toBeInTheDocument();
    expect(screen.getByText('Manage your enterprise data products and their metadata.')).toBeInTheDocument();
  });

  test('displays filters', () => {
    renderWithProviders(<DataProductList />);
    
    expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
    expect(screen.getByLabelText('Sensitivity Category')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  test('displays data products after loading', async () => {
    renderWithProviders(<DataProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Data Product')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
  });

  test('filter functionality works', async () => {
    renderWithProviders(<DataProductList />);
    
    const portfolioSelect = screen.getByLabelText('Portfolio');
    fireEvent.change(portfolioSelect, { target: { value: 'Marketing Analytics' } });
    
    await waitFor(() => {
      expect(portfolioSelect).toHaveValue('Marketing Analytics');
    });
  });
});