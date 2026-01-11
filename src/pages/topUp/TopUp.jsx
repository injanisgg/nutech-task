import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container, Box, TextField, Button, Typography, Grid, Card, CardContent,
  InputAdornment
} from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import { topUp, clearTopUpSuccess } from '../../features/balance/balanceSlice';

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, topUpSuccess, balance } = useSelector((state) => state.balance);

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    if (topUpSuccess) {
      toast.success('Top up berhasil!');
      dispatch(clearTopUpSuccess());
      navigate('/');
    }
  }, [topUpSuccess, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const numAmount = Number(amount);
    
    // validasi
    if (!amount || numAmount <= 0) {
      toast.error('Masukkan nominal top up');
      return;
    }
    
    if (numAmount < 10000) {
      toast.error('Nominal minimal Rp 10.000');
      return;
    }
    
    if (numAmount > 1000000) {
      toast.error('Nominal maksimal Rp 1.000.000');
      return;
    }

    dispatch(topUp(numAmount));
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const isValidAmount = () => {
    const num = Number(amount);
    return num >= 10000 && num <= 1000000;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Silakan masukkan
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Nominal Top Up
        </Typography>

        {/* balance display */}
        <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Saldo Saat Ini
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Rp {formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="number"
            placeholder="masukan nominal Top Up"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWallet />
                </InputAdornment>
              ),
            }}
          />

          {/* quick amount buttons */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {quickAmounts.map((quickAmount) => (
              <Grid item xs={4} key={quickAmount}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setAmount(quickAmount.toString())}
                  sx={{ py: 1.5 }}
                >
                  Rp {formatCurrency(quickAmount)}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={!isValidAmount() || loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Processing...' : 'Top Up'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TopUp;