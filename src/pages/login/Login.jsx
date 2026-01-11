import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AlternateEmail,
  Lock,
} from "@mui/icons-material";
import { login, clearError } from "../../features/auth/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Login gagal!");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success("Login berhasil!");
      navigate("/");
    } catch (_) {}
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 4, md: 8 },
          py: { xs: 6, md: 0 },
        }}
      >
        {/* FORM */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              SIMS PPOB
            </Typography>
            <Typography variant="body1">
              Masuk atau buat akun untuk memulai
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              placeholder="Masukan email anda"
              type="email"
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email tidak valid",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              placeholder="Masukan password anda"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password wajib diisi",
                minLength: {
                  value: 8,
                  message: "Password minimal 8 karakter",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
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
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? "Loading..." : "Masuk"}
            </Button>

            <Typography variant="body2" align="center">
              Belum punya akun?{" "}
              <Link
                to="/register"
                style={{
                  color: "#f42619",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Registrasi
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* ILUSTRASI */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Box
            component="img"
            src="/login-ilustration.png"
            alt="login"
            sx={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;