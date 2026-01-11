import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";

const Layout = () => {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ minHeight: "100vh", pt: 10, pb: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;