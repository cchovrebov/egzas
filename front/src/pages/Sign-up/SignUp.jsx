import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { setUser, setError, initialError, setToken } from '../../userSlice';
import { signUpReq, signInReq } from '../../services/user'
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const SignUp = () => {
  const navigate = useNavigate();
  const userReducer = useSelector((state) => state.userReducer);
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      username,
      email,
      password,
      repeatPassword
    } = userReducer.user

    const error = { ...initialError };
    let hasError = false;
    if (!username) {
      error.username = { ...initialError.username, show: true };
      hasError = true;
    }
    if (!email) {
      error.email = { ...initialError.email, show: true };
      hasError = true;
    }
    if (!password) {
      error.password = { ...initialError.password, show: true };
      hasError = true;
    }
    if (password && password !== repeatPassword) {
      error.repeatPassword = { ...initialError.repeatPassword, show: true };
      hasError = true;
    }

    if (hasError) {
      return dispatch(setError(error))
    }

    await signUpReq(userReducer.user);
    const signInRes = await signInReq(userReducer.user);
    localStorage.setItem('token', signInRes.token);
    dispatch(setToken(signInRes.token));
    navigate('/');
  };

  const handleInputChange = (value, inputName) => {
    dispatch(setUser({ value, inputName }))
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                error={userReducer?.error?.username?.show}
                helperText={userReducer?.error?.username?.show ? userReducer.error.username.message : ''}
                onInput={(e) => handleInputChange(e.target.value, 'username')}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={userReducer.error?.email?.show}
                helperText={userReducer?.error?.email?.show ? userReducer.error.email.message : ''}
                onInput={(e) => handleInputChange(e.target.value, 'email')}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={userReducer?.error?.password?.show}
                helperText={userReducer?.error?.password?.show ? userReducer.error.password.message : ''}
                onInput={(e) => handleInputChange(e.target.value, 'password')}
                id="password"
                autoComplete="current-password"
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="repeatPassword"
                label="Repeat password"
                type="password"
                id="repeatPassword"
                error={userReducer?.error?.repeatPassword?.show}
                helperText={userReducer?.error?.repeatPassword?.show ? userReducer.error.repeatPassword.message : ''}
                onInput={(e) => handleInputChange(e.target.value, 'repeatPassword')}
                autoFocus
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                </Grid>
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have account? Sign In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignUp;
