import { Box, Card, CardMedia, Typography } from "@mui/material";

const BannerList = ({ banners }) => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Temukan promo menarik
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
        }}
      >
        {banners?.map((banner, index) => (
          <Card
            key={index}
            sx={{
              minWidth: { xs: 260, md: 320 },
              flexShrink: 0,
            }}
          >
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
  );
};

export default BannerList;