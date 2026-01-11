import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

import ProfileCard from "../../components/home/ProfileCard";
import BalanceCard from "../../components/home/BalanceCard";
import ServiceList from "../../components/home/ServiceList";
import BannerList from "../../components/home/BannerList";

import { fetchProfile } from "../../features/profile/profileSlice";
import { fetchBalance } from "../../features/balance/balanceSlice";
import {
  fetchServices,
  fetchBanners,
} from "../../features/transaction/transactionSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(true);

  const { data: profile } = useSelector((state) => state.profile);
  const { balance } = useSelector((state) => state.balance);
  const { services, banners } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      {/* PROFILE & BALANCE */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <ProfileCard profile={profile} />
        </Grid>

        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <BalanceCard
            balance={balance}
            showBalance={showBalance}
            onToggle={() => setShowBalance(!showBalance)}
          />
        </Grid>
      </Grid>

      {/* SERVICES */}
      <Box sx={{ mb: 4 }}>
        <ServiceList services={services} spacing={2} />
      </Box>

      {/* BANNERS */}
      <BannerList banners={banners} />
    </Container>
  );
};

export default Home;