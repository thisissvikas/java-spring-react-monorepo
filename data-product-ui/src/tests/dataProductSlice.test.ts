import { configureStore } from '@reduxjs/toolkit';
import dataProductReducer, {
  fetchDataProducts,
  setFilters,
  clearCurrentDataProduct,
  DataProduct,
} from '../store/dataProductSlice';

// Mock the API service
jest.mock('../services/dataProductApi', () => ({
  dataProductApi: {
    getAllDataProducts: jest.fn(),
  },
}));

describe('dataProductSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        dataProducts: dataProductReducer,
      },
    });
  });

  test('should handle initial state', () => {
    const state = store.getState().dataProducts;
    expect(state.dataProducts).toEqual([]);
    expect(state.currentDataProduct).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('should handle setFilters', () => {
    const filters = { portfolio: 'Test Portfolio', sensitivityCategory: 'INTERNAL' };
    store.dispatch(setFilters(filters));
    
    const state = store.getState().dataProducts;
    expect(state.filters).toEqual(filters);
  });

  test('should handle clearCurrentDataProduct', () => {
    store.dispatch(clearCurrentDataProduct());
    
    const state = store.getState().dataProducts;
    expect(state.currentDataProduct).toBeNull();
  });

  test('should handle fetchDataProducts.pending', () => {
    store.dispatch(fetchDataProducts.pending('test', { page: 0 }));
    
    const state = store.getState().dataProducts;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchDataProducts.fulfilled', () => {
    const mockResponse = {
      content: [
        {
          id: '1',
          name: 'Test Product',
          portfolio: 'Test',
          source: 'Test',
          sensitivityCategory: 'INTERNAL' as const,
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        } as DataProduct,
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    };

    store.dispatch(fetchDataProducts.fulfilled(mockResponse, 'test', { page: 0 }));
    
    const state = store.getState().dataProducts;
    expect(state.loading).toBe(false);
    expect(state.dataProducts).toEqual(mockResponse.content);
    expect(state.pageInfo.totalElements).toBe(1);
  });

  test('should handle fetchDataProducts.rejected', () => {
    const error = new Error('Network error');
    store.dispatch(fetchDataProducts.rejected(error, 'test', { page: 0 }));
    
    const state = store.getState().dataProducts;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});