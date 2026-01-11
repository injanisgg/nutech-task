import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBalanceAPI, topUpAPI } from "../../services/api";

export const fetchBalance = createAsyncThunk(
  "balance/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBalanceAPI();
      return response.data.data.balance;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const topUp = createAsyncThunk(
  "balance/topUp",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await topUpAPI(amount);
      return response.data.data.balance; // ⬅️ return balance baru
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
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
        // fetch balance
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.loading = false;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // top up balance
      .addCase(topUp.pending, (state) => {
        state.loading = true;
        state.topUpSuccess = false;
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
        state.topUpSuccess = true;
      })
      .addCase(topUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTopUpSuccess } = balanceSlice.actions;
export default balanceSlice.reducer;