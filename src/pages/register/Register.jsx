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
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AlternateEmail,
  Lock,
  Person,
} from "@mui/icons-material";
import {
  register as registerAction,
  clearError,
} from "../../features/auth/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Registrasi gagal!");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      await dispatch(registerAction(userData)).unwrap();
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {}
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: { xs: 4, md: 0 },
        }}
      >
        {/* FORM */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 420,
            mx: "auto",
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              SIMS PPOB
            </Typography>
            <Typography variant="h6">
              Lengkapi data untuk membuat akun
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                placeholder="Masukan email anda"
                type="email"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value:
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
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
                placeholder="Masukan nama depan anda"
                {...register("first_name", {
                  required: "Nama depan wajib diisi",
                })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                placeholder="Masukan nama belakang anda"
                {...register("last_name", {
                  required: "Nama belakang wajib diisi",
                })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                placeholder="Buat password"
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
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                placeholder="Konfirmasi password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Konfirmasi password wajib diisi",
                  validate: (value) =>
                    value === password ||
                    "Password tidak cocok",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={loading}
              >
                {loading ? "Loading..." : "Registrasi"}
              </Button>

              <Typography variant="body2" align="center">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#f42619",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Login di sini
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* IMAGE */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <img
            src="/login-ilustration.png"
            alt="Register"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Register;