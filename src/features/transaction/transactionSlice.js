import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getServicesAPI,
  transactionAPI,
  getTransactionsHistoryAPI,
  getBannerAPI
} from "../../services/api";

// services
export const fetchServices = createAsyncThunk(
  "transaction/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getServicesAPI();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Gagal mengambil services" }
      );
    }
  }
);

// banners
export const fetchBanners = createAsyncThunk(
  "transaction/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBannerAPI();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Gagal mengambil banner" }
      );
    }
  }
);

// make transaction
export const makeTransaction = createAsyncThunk(
  "transaction/make",
  async (serviceCode, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionAPI(serviceCode);

      dispatch(fetchTransactionHistory({ offset: 0, limit: 5 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Transaksi gagal" }
      );
    }
  }
);

// history
export const fetchTransactionHistory = createAsyncThunk(
  "transaction/fetchHistory",
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await getTransactionsHistoryAPI(offset, limit);
      return {
        records: response.data.data.records,
        offset,
        limit
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Gagal mengambil riwayat" }
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    services: [],
    banners: [],
    history: [],
    currentOffset: 0,
    hasMore: true,
    loading: false,
    error: null
  },
  reducers: {
    resetHistory: (state) => {
      state.history = [];
      state.currentOffset = 0;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      /* service */
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
      })

      /* banners */
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
      })

      /* transaction */
      .addCase(makeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(makeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* history */
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        const { records, offset } = action.payload;

        if (offset === 0) {
          state.history = records;
        } else {
          state.history.push(...records);
        }

        state.currentOffset = offset;
        state.hasMore = records.length > 0;
        state.loading = false;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetHistory } = transactionSlice.actions;
export default transactionSlice.reducer;