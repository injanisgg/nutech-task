import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Top Up', path: '/topup' },
    { label: 'Transaction', path: '/transaction' },
    { label: 'Akun', path: '/profile' },
  ];

  return (
    <AppBar position="fixed" color="transparent" elevation={0} 
      sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          SIMS PPOB
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;