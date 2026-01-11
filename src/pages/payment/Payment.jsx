import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { Payment as PaymentIcon, CheckCircle } from "@mui/icons-material";
import { makeTransaction } from "../../features/transaction/transactionSlice";
import { fetchBalance } from "../../features/balance/balanceSlice";

const Payment = () => {
  const { serviceCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const { services } = useSelector((state) => state.transaction);
  const { balance } = useSelector((state) => state.balance);

  const service = services?.find(
    (s) => s.service_code === serviceCode
  );

  useEffect(() => {
    if (!service) navigate("/");
  }, [service, navigate]);

  const handleConfirmPayment = async () => {
    setOpenConfirm(false);
    try {
      await dispatch(makeTransaction(serviceCode)).unwrap();
      dispatch(fetchBalance());
      setOpenSuccess(true);
    } catch (_) {
      toast.error("Pembayaran gagal!");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  if (!service) return null;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          py: { xs: 3, md: 5 },
        }}
      >
        {/* TITLE */}
        <Typography variant="h5" mb={3}>
          Pembayaran
        </Typography>

        {/* SERVICE INFO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={service.service_icon}
            alt={service.service_name}
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="h6" fontWeight="bold">
            {service.service_name}
          </Typography>
        </Box>

        {/* BALANCE */}
        <Card sx={{ mb: 4, bgcolor: "grey.100" }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Saldo Anda
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>

        {/* AMOUNT */}
        <TextField
          fullWidth
          disabled
          value={formatCurrency(service.service_tariff)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PaymentIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* ACTION */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{ backgroundColor: "#f42619" }}
          disabled={balance < service.service_tariff}
          onClick={() => setOpenConfirm(true)}
        >
          Bayar
        </Button>

        {balance < service.service_tariff && (
          <Typography
            variant="body2"
            color="error"
            mt={2}
            textAlign="center"
          >
            Saldo tidak mencukupi
          </Typography>
        )}
      </Box>

      {/* CONFIRMATION */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} disableRestoreFocus>
        <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        <DialogContent>
          <Typography>
            Anda yakin melakukan pembayaran sebesar{" "}
            <strong>{formatCurrency(service.service_tariff)}</strong>{" "}
            untuk <strong>{service.service_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Batal</Button>
          <Button variant="contained" onClick={handleConfirmPayment}>
            Ya, Bayar
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS */}
      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircle
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />
          <Typography variant="h6" mb={1}>
            Pembayaran Berhasil
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {service.service_name}
          </Typography>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            {formatCurrency(service.service_tariff)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Payment;