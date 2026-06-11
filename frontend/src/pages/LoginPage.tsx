import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { UserLogin } from '../types';

const ACCENT = '#C8FF00';
const BG = '#0A0A0A';
const BORDER = '#272727';
const SURFACE = '#111111';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const credentials: UserLogin = { email: email.trim(), password };
      await login(credentials);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: BG,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${BORDER} 1px, transparent 1px),
            linear-gradient(90deg, ${BORDER} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          maskImage: 'radial-gradient(ellipse 50% 70% at 50% 50%, black 20%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Accent glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: 400,
          height: 300,
          background: `radial-gradient(ellipse, ${ACCENT}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top nav */}
      <Box
        sx={{
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${BORDER}`,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
        >
          <Box
            sx={{
              width: 22,
              height: 22,
              bgcolor: ACCENT,
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Oswald", sans-serif',
                fontWeight: 700,
                fontSize: 11,
                color: '#000',
                lineHeight: 1,
              }}
            >
              S
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: 15,
              color: '#EFEFEF',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Sculpt
          </Typography>
        </Box>
      </Box>

      {/* Form area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          position: 'relative',
          zIndex: 10,
          '@keyframes formIn': {
            from: { opacity: 0, transform: 'translateY(16px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'formIn 0.3s ease forwards',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: '"Oswald", sans-serif',
                fontWeight: 600,
                fontSize: 32,
                color: '#EFEFEF',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Welcome back
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 300,
                fontSize: 14,
                color: '#666',
              }}
            >
              Sign in to continue your progress
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form card */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              bgcolor: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1 }}
            >
              Sign In
            </Button>
          </Box>

          {/* Footer link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: 13,
                color: '#555',
              }}
            >
              No account yet?{' '}
              <Box
                component={Link}
                to="/register"
                sx={{
                  color: ACCENT,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Create one
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
