import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container, Box, TextField, Button, Typography, Avatar, IconButton
} from '@mui/material';
import { Edit, Person, AlternateEmail } from '@mui/icons-material';
// import Layout from '../../components/layout/Layout';
import { 
  fetchProfile, 
  updateProfile, 
  updateProfileImage,
  clearUpdateSuccess 
} from '../../features/profile/profileSlice';
import { logout } from '../../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { data: profile, updateSuccess } = useSelector((state) => state.profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
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
      toast.success('Profile berhasil diupdate!');
      setIsEditing(false);
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // validasi ukuran (max 100KB)
    if (file.size > 100 * 1024) {
      toast.error('Ukuran file maksimal 100KB!');
      return;
    }

    // validasi format
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar!');
      return;
    }

    try {
      await dispatch(updateProfileImage(file)).unwrap();
      dispatch(fetchProfile());
    } catch (error) {
      toast.error(error.message || 'Gagal upload foto!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
    } catch (error) {
      toast.error(error.message || 'Gagal update profile!');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.info('Anda telah logout');
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
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, textAlign: 'center' }}>
        {/* profile picture */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
          <Avatar
            src={profile.profile_image || '/default-avatar.png'}
            sx={{ width: 120, height: 120, mx: 'auto' }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'white',
              border: 2,
              borderColor: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
            component="label"
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

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
          {profile.first_name} {profile.last_name}
        </Typography>

        {/* form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={profile.email || ''}
            disabled
            InputProps={{
              startAdornment: <AlternateEmail sx={{ mr: 1, color: 'action.disabled' }} />,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Nama Depan"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            disabled={!isEditing}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.disabled' }} />,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Nama Belakang"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            disabled={!isEditing}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.disabled' }} />,
            }}
          />

          {!isEditing ? (
            <>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setIsEditing(true)}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Edit Profile
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ py: 1.5 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Simpan
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1.5 }}
              >
                Batalkan
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;