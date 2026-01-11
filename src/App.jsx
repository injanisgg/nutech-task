import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import TopUp from "./pages/topUp/TopUp";
import Payment from "./pages/payment/Payment";
import Transaction from "./pages/transaction/Transaction";
import Profile from "./pages/profile/Profile";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Layout from "./components/layout/Layout";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected */}
      <Route element={<ProtectedRoute />}>
        {/* layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/payment/:serviceCode" element={<Payment />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;