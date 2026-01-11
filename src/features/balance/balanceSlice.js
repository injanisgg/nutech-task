import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBalanceAPI, topUpAPI } from "../../services/api";

export const fetchBalance = createAsyncThunk(
    'balance/fetch',
    async(_, { rejectWithValue }) => {
        try {
            const response = await getBalanceAPI();
            return response.data.data.balance;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const topUp = createAsyncThunk(
    'balance/topUp',
    async(amount, { rejectWithValue }) => {
        try {
            const response = await topUpAPI(amount);
            dispatch(fetchBalance());
            return response.data.data.balance;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        balance: 0,
        loading: false,
        error: null,
        topUpSuccess: false,
    },
    reducers: {
        clearTopUpSuccess: (state) => {
            state.topUpSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchBalance.fulfilled, (state, action) => {
            state.balance = action.payload;
            state.loading = false;
        })
        .addCase(topUp.fulfilled, (state, action) => {
            state.topUpSuccess = true;
            state.loading = false;
        })
        .addCase(topUp.pending, (state, action) => {
            state.loading = true;
        });
    },
});

export const { clearTopUpSuccess } = balanceSlice.actions;
export default balanceSlice.reducer;