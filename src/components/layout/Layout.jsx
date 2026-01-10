import { Box } from "@mui/material";
import Header from "../header/Header";

const Layout = ({ childern }) => {
    return (
        <Box>
            <Header />
            <Box component="main" sx={{ minHeight: '100vh', pt: 10, pb: 4 }}>
                {childern}
            </Box>
        </Box>
    )
}

export default Layout;