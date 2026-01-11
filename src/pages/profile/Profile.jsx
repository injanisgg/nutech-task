import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import { Edit, Person, AlternateEmail } from "@mui/icons-material";
import {
  fetchProfile,
  updateProfile,
  updateProfileImage,
  clearUpdateSuccess,
} from "../../features/profile/profileSlice";
import { logout } from "../../features/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: profile, updateSuccess } = useSelector(
    (state) => state.profile
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile berhasil diupdate!");
      setIsEditing(false);
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 100 * 1024) {
      toast.error("Ukuran file maksimal 100KB");
      return;
    }

    try {
      await dispatch(updateProfileImage(file)).unwrap();
      dispatch(fetchProfile());
      toast.success("Foto profil berhasil diubah");
    } catch (err) {
      toast.error(err?.message || "Upload gagal");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
    } catch (error) {
      toast.error(error.message || "Gagal update profile!");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.info("Anda telah logout");
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
    setIsEditing(false);
  };

  if (!profile || !profile.email) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          textAlign: "center",
        }}
      >
        {/* AVATAR */}
        <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
          <Avatar
            src={profile.profile_image || "/default-avatar.png"}
            sx={{
              width: { xs: 96, md: 120 },
              height: { xs: 96, md: 120 },
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: 2,
              borderColor: "primary.main",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <Edit />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </IconButton>
        </Box>

        {/* NAME */}
        <Typography variant="h5" fontWeight="bold" mb={4}>
          {profile.first_name} {profile.last_name}
        </Typography>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
              InputProps={{
                startAdornment: (
                  <AlternateEmail sx={{ mr: 1, color: "action.disabled" }} />
                ),
              }}
            />

            <TextField
              fullWidth
              label="Nama Depan"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  first_name: e.target.value,
                })
              }
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: "action.disabled" }} />
                ),
              }}
            />

            <TextField
              fullWidth
              label="Nama Belakang"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  last_name: e.target.value,
                })
              }
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: "action.disabled" }} />
                ),
              }}
            />

            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  type="button"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  type="button"
                >
                  Simpan
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleCancel}
                  type="button"
                >
                  Batalkan
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
