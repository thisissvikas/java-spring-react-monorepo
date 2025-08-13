import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dataProductApi } from '../services/dataProductApi';

export interface DataProduct {
  id: string;
  name: string;
  description?: string;
  portfolio: string;
  source: string;
  sensitivityCategory: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  dataFormat?: string;
  owner?: string;
  tags?: string[];
  isActive: boolean;
  retentionPeriodDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DataProductPageResponse {
  content: DataProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface DataProductState {
  dataProducts: DataProduct[];
  currentDataProduct: DataProduct | null;
  pageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  filters: {
    portfolio?: string;
    sensitivityCategory?: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: DataProductState = {
  dataProducts: [],
  currentDataProduct: null,
  pageInfo: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchDataProducts = createAsyncThunk(
  'dataProducts/fetchDataProducts',
  async (params: { page?: number; size?: number; portfolio?: string; sensitivityCategory?: string }) => {
    const response = await dataProductApi.getAllDataProducts(
      params.page,
      params.size,
      params.portfolio,
      params.sensitivityCategory
    );
    return response.data;
  }
);

export const fetchDataProductById = createAsyncThunk(
  'dataProducts/fetchDataProductById',
  async (id: string) => {
    const response = await dataProductApi.getDataProductById(id);
    return response.data;
  }
);

export const createDataProduct = createAsyncThunk(
  'dataProducts/createDataProduct',
  async (dataProduct: Omit<DataProduct, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const response = await dataProductApi.createDataProduct(dataProduct);
    return response.data;
  }
);

export const updateDataProduct = createAsyncThunk(
  'dataProducts/updateDataProduct',
  async ({ id, data }: { id: string; data: Partial<DataProduct> }) => {
    const response = await dataProductApi.updateDataProduct(id, data);
    return response.data;
  }
);

export const deleteDataProduct = createAsyncThunk(
  'dataProducts/deleteDataProduct',
  async (id: string) => {
    await dataProductApi.deleteDataProduct(id);
    return id;
  }
);

const dataProductSlice = createSlice({
  name: 'dataProducts',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ portfolio?: string; sensitivityCategory?: string }>) => {
      state.filters = action.payload;
    },
    clearCurrentDataProduct: (state) => {
      state.currentDataProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch data products
      .addCase(fetchDataProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as DataProductPageResponse;
        state.dataProducts = payload.content;
        state.pageInfo = {
          page: payload.page,
          size: payload.size,
          totalElements: payload.totalElements,
          totalPages: payload.totalPages,
        };
      })
      .addCase(fetchDataProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data products';
      })
      // Fetch single data product
      .addCase(fetchDataProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDataProduct = action.payload as DataProduct;
      })
      .addCase(fetchDataProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data product';
      })
      // Create data product
      .addCase(createDataProduct.fulfilled, (state, action) => {
        state.dataProducts.unshift(action.payload as DataProduct);
      })
      // Update data product
      .addCase(updateDataProduct.fulfilled, (state, action) => {
        const updated = action.payload as DataProduct;
        const index = state.dataProducts.findIndex(dp => dp.id === updated.id);
        if (index !== -1) {
          state.dataProducts[index] = updated;
        }
        if (state.currentDataProduct?.id === updated.id) {
          state.currentDataProduct = updated;
        }
      })
      // Delete data product
      .addCase(deleteDataProduct.fulfilled, (state, action) => {
        state.dataProducts = state.dataProducts.filter(dp => dp.id !== action.payload);
        if (state.currentDataProduct?.id === action.payload) {
          state.currentDataProduct = null;
        }
      });
  },
});

export const { setFilters, clearCurrentDataProduct, clearError } = dataProductSlice.actions;
export default dataProductSlice.reducer;