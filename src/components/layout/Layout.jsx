import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";

const Layout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      <Box
        component="main"
        sx={{
          pt: { xs: 8, md: 10 },
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;