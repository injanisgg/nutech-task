import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Grid, Card, CardContent, CardMedia, Avatar
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { fetchProfile } from '../../features/profile/profileSlice';
import { fetchBalance } from '../../features/balance/balanceSlice';
import { fetchServices, fetchBanners } from '../../features/transaction/transactionSlice';
import { useState } from 'react';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  const { data: profile } = useSelector((state) => state.profile);
  const { balance } = useSelector((state) => state.balance);
  const { services, banners } = useSelector((state) => state.transaction);

  // fetch semua data saat component mount
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
    dispatch(fetchBanners());
  }, [dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* profile & balance Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* profile */}
          <Grid item xs={12} md={6}>
            <Box>
              <Avatar
                src={profile?.profile_image || '/default-avatar.png'}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="body1">Selamat datang,</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {profile?.first_name} {profile?.last_name}
              </Typography>
            </Box>
          </Grid>

          {/* balance card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f42619 0%, #d32f2f 100%)',
                color: 'white',
                p: 2
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Saldo anda
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {showBalance ? formatCurrency(balance) : 'Rp •••••••'}
                </Typography>
                <Box 
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setShowBalance(!showBalance)}
                >
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {showBalance ? 'Sembunyikan' : 'Lihat'} Saldo
                  </Typography>
                  {showBalance ? <VisibilityOff /> : <Visibility />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* services section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {services.map((service) => (
              <Grid item xs={6} sm={4} md={2} key={service.service_code}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => navigate(`/payment/${service.service_code}`)}
                >
                  <CardMedia
                    component="img"
                    height="60"
                    image={service.service_icon}
                    alt={service.service_name}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption">
                      {service.service_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* banner section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Temukan promo menarik
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {banners.map((banner, index) => (
              <Card key={index} sx={{ minWidth: 300, flexShrink: 0 }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={banner.banner_image}
                  alt={banner.banner_name}
                />
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;