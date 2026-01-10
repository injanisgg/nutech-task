import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getServicesAPI, transactionAPI, getTransactionsHistoryAPI, getBannerAPI } from "../../services/api";

export const fetchServices = createAsyncThunk(
    'transaction/fetchServices',
    async () => {
        const response = await getServicesAPI();
        return response.data.data;
    }
);

export const fetchBanners = createAsyncThunk(
    'transaction/fetchBanners',
    async () => {
        const response = await getBannerAPI();
        return response.data.data;
    }
);

export const makeTransaction = createAsyncThunk(
    'transaction/make',
    async(serviceCode, { rejectWithValue, dispacth }) => {
        try {
            const response = await transactionAPI(serviceCode);
            dispacth(fetchTransactionHistory({ offset: 0, limit: 5 }));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchTransactionHistory = createAsyncThunk(
    'transaction/fetchHistory',
    async({ offset, limit }, { rejectWithValue }) => {
        try {
            const response = await getTransactionsHistoryAPI(offset, limit);
            return {
                records: response.data.data.records,
                offset,
                limit
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        services: [],
        banners: [],
        history: [],
        currentOffset: 0,
        hasMore: true,
        loading: false,
        error: null,
    },
    reducers: {
        resetHistory: (state) => {
            state.history = [];
            state.currentOffset = 0;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchServices.fulfilled, (state, action) => {
            state.services = action.payload;
        })
        .addCase(fetchBanners.fulfilled, (state, action) => {
            state.banners = action.payload;
        })
        .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
            const { records, offset } = action.payload;

            if (offset === 0) {
                state.history = records;
            } else {
                state.history = [...state.history, ...records];
            }

            state.currentOffset = offset;
            state.hasMore = records.length > 0;
            state.loading = false;
        })
        .addCase(fetchTransactionHistory.pending, (state) => {
            state.loading = true;
        });
    },
});

export const { resetHistory } = transactionSlice.actions;
export default transactionSlice.reducer;