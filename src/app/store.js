import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import balanceReducer from "../features/balance/balanceSlice";
import transactionReducer from "../features/transaction/transactionSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        balance: balanceReducer,
        transaction: transactionReducer,
    }
});