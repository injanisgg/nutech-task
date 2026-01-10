import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container, Box, TextField, Button, Typography, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment
} from '@mui/material';
import { Payment as PaymentIcon, CheckCircle } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { makeTransaction } from '../../features/transaction/transactionSlice';
import { fetchBalance } from '../../features/balance/balanceSlice';

const Payment = () => {
  const { serviceCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const { services } = useSelector((state) => state.transaction);
  const { balance } = useSelector((state) => state.balance);

  const service = services.find((s) => s.service_code === serviceCode);

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
  }, [service, navigate]);

  const handleConfirmPayment = async () => {
    setOpenConfirm(false);
    
    try {
      const result = await dispatch(makeTransaction(serviceCode)).unwrap();
      setTransactionResult(result.data);
      dispatch(fetchBalance());
      setOpenSuccess(true);
    } catch (error) {
      toast.error(error.message || 'Pembayaran gagal!');
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!service) return null;

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Pembayaran
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <img 
              src={service.service_icon} 
              alt={service.service_name}
              style={{ width: 40, height: 40, marginRight: 16 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {service.service_name}
            </Typography>
          </Box>

          {/* Balance Display */}
          <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Saldo Anda
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(balance)}
              </Typography>
            </CardContent>
          </Card>

          <TextField
            fullWidth
            value={formatCurrency(service.service_tariff)}
            disabled
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaymentIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenConfirm(true)}
            disabled={balance < service.service_tariff}
            sx={{ py: 1.5 }}
          >
            Bayar
          </Button>

          {balance < service.service_tariff && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ mt: 2, textAlign: 'center' }}
            >
              Saldo tidak mencukupi
            </Typography>
          )}
        </Box>
      </Container>

      {/* confirmation dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        <DialogContent>
          <Typography>
            Anda yakin untuk melakukan pembayaran sebesar{' '}
            <strong>{formatCurrency(service.service_tariff)}</strong> untuk{' '}
            <strong>{service.service_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Batalkan</Button>
          <Button onClick={handleConfirmPayment} variant="contained">
            Ya, Bayar
          </Button>
        </DialogActions>
      </Dialog>

      {/* success dialog */}
      <Dialog open={openSuccess} onClose={handleCloseSuccess}>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Pembayaran Berhasil!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {service.service_name}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            {formatCurrency(service.service_tariff)}
          </Typography>
          <Button onClick={handleCloseSuccess} variant="contained">
            Kembali ke Beranda
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Payment;