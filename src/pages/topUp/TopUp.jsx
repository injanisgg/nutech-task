import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { fetchProfile } from "../../features/profile/profileSlice";
import { fetchBalance, topUp, clearTopUpSuccess } from "../../features/balance/balanceSlice";

const TopUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const { data: profile } = useSelector((state) => state.profile);
  const { balance, loading, topUpSuccess, error } = useSelector(
    (state) => state.balance
  );

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  useEffect(() => {
    if (topUpSuccess) {
      toast.success("Top up berhasil 🎉");
      dispatch(clearTopUpSuccess());
      navigate("/");
    }
  }, [topUpSuccess, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Top up gagal");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);

    if (!num) return toast.error("Masukkan nominal");
    if (num < 10000) return toast.error("Minimal Rp 10.000");
    if (num > 1000000) return toast.error("Maksimal Rp 1.000.000");

    try {
      await dispatch(topUp(num)).unwrap();
    } catch (_) {}
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("id-ID").format(num || 0);

  return (
    <Container maxWidth="md">
      <Box py={{ xs: 3, md: 5 }}>
        <Grid container spacing={3} mb={5}>
          {/* PROFILE */}
          <Grid size={{ xs:12, md:5 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
              }}
            >
              <Avatar
                src={profile?.profile_image || "/default-avatar.png"}
                sx={{ width: 72, height: 72 }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Selamat datang,
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {profile?.first_name} {profile?.last_name}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* BALANCE */}
          <Grid size={{ xs: 12, md: 5}}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                color: "white",
                background: "linear-gradient(135deg, #f42619, #d32f2f)",
              }}
            >
              <CardContent>
                <Typography variant="body2">Saldo Anda</Typography>
                <Typography variant="h4" fontWeight={700} mt={1}>
                  Rp {formatCurrency(balance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TOP UP FORM */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                type="number"
                placeholder="Masukkan nominal Top Up"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceWalletOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ py: 1.5, backgroundColor: "#f42619" }}
              >
                {loading ? "Processing..." : "Top Up"}
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2}>
                {quickAmounts.map((val) => (
                  <Grid size={{ xs: 6, sm: 4, md: 6 }} key={val}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setAmount(val.toString())}
                      sx={{ py: 1.2 }}
                    >
                      Rp {formatCurrency(val)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default TopUp;