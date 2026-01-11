import { Card, CardContent, Typography, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const BalanceCard = ({ balance, showBalance, onToggle }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #f42619, #d32f2f)",
        color: "white",
        p: 2,
      }}
    >
      <CardContent>
        <Typography variant="body2" mb={1}>
          Saldo anda
        </Typography>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          {showBalance ? formatCurrency(balance) : "Rp •••••••"}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer", width: "fit-content" }}
          onClick={onToggle}
        >
          <Typography variant="body2">
            {showBalance ? "Sembunyikan" : "Lihat"} Saldo
          </Typography>
          {showBalance ? <Visibility /> : <VisibilityOff />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;