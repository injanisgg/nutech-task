import { Box, Typography, Avatar } from "@mui/material";

const ProfileCard = ({ profile }) => {
  return (
    <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
      <Avatar
        src={profile?.profile_image || "/default-avatar.png"}
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          mx: { xs: "auto", md: 0 },
        }}
      />
      <Typography variant="body1">Selamat datang,</Typography>
      <Typography variant="h4" fontWeight="bold">
        {profile?.first_name} {profile?.last_name}
      </Typography>
    </Box>
  );
};

export default ProfileCard;