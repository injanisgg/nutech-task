import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

const ServiceList = ({ services }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {services?.map((service) => (
        <Grid
          key={service.service_code}
          size={{ xs: 4, sm: 3, md: 2, lg: 1.2 }}
        >
          <Card
            onClick={() => navigate(`/payment/${service.service_code}`)}
            sx={{
              textAlign: "center",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              "&:hover": { 
                boxShadow: 4,
                transform: "translateY(-4px)",
                transition: "all 0.3s ease"
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={service.service_icon}
                alt={service.service_name}
                sx={{ 
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                }}
              />
            </Box>
            <CardContent sx={{ p: 1, flexGrow: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  lineHeight: 1.2,
                  display: "block"
                }}
              >
                {service.service_name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceList;