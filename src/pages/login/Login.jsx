import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Container, Box, TextField, Button, Typography, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, AlternateEmail, Lock } from '@mui/icons-material';
import { login, clearError, register } from '../../features/auth/authSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    // redirect kalau sudah login 
    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    // error notif
    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Login gagal!');
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(login(data)).unwrap();
            toast.success('Login berhasil!');
            navigate('/')
        } catch (error) {
            
        }
    }

return (
    <Container maxWidth='lg'>
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center'
        }}>
            <Box sx={{ flex: 1, pr: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 1 }}>
                        SIMS PPOB
                    </Typography>
                    <Typography variant='h5'>
                        Masuk atau buat akun untuk memulai
                    </Typography>
                </Box>

                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <TextField 
                        fullWidth
                        margin='normal'
                        placeholder='Masukan email anda'
                        type='email'
                        {...register('email', {
                            required: 'Email wajib diisi',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email tidak valid'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <AlternateEmail />
                                </InputAdornment>
                            ),
                        }}
                     />

                    <TextField 
                        fullWidth
                        margin='normal'
                        placeholder='Masukan password anda'
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                            required: 'Password wajib diisi',
                            minLength: {
                                value: 8,
                                message: 'Password minimal 8 karakter'
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        variant='contained'
                        type='submit'
                        disabled={loading}
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        {loading ? 'Loading...' : 'Masuk'}
                    </Button>

                    <Typography variant='body2' align='center'>
                        Belum punya akun? registrasi{' '}
                        <Link to='/register' style={{ color: '#f42619', textDecoration: 'none' }}>
                        di sini
                        </Link>
                    </Typography>
                </Box>
            </Box>
            
            <Box sx={{ flex: 1, textAlign: 'center' }}>
                <img
                    src='public/login-ilustration.png'
                    alt='login'
                    style={{ maxWidth: '100%', height: 'auto' }}/>
            </Box>
        </Box>
    </Container>
    )
};

export default Login;