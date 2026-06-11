import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_WIDTH = 224;
const ACCENT = '#C8FF00';
const SURFACE = '#111111';
const BORDER = '#272727';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <SpaceDashboardOutlinedIcon /> },
  { label: 'Workouts', path: '/workouts', icon: <FitnessCenterIcon /> },
  { label: 'Exercises', path: '/exercises', icon: <FormatListBulletedIcon /> },
  { label: 'Nutrition', path: '/nutrition', icon: <RestaurantMenuOutlinedIcon /> },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: SURFACE,
          borderRight: `1px solid ${BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 200,
        }}
      >
        {/* Brand mark */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: '22px',
            textDecoration: 'none',
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              bgcolor: ACCENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Oswald", sans-serif',
                fontWeight: 700,
                fontSize: 13,
                color: '#000',
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}
            >
              S
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: 17,
              color: '#EFEFEF',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Sculpt
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ flex: 1, py: 2, px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto' }}>
          {navItems.map(({ label, path, icon }) => {
            const active = location.pathname === path;
            return (
              <Box
                key={path}
                component={Link}
                to={path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: '3px',
                  textDecoration: 'none',
                  bgcolor: active ? ACCENT : 'transparent',
                  color: active ? '#000' : '#777',
                  transition: 'background 0.12s ease, color 0.12s ease',
                  '&:hover': {
                    bgcolor: active ? ACCENT : '#1D1D1D',
                    color: active ? '#000' : '#EFEFEF',
                  },
                }}
              >
                <Box sx={{ '& svg': { fontSize: 17, display: 'block' } }}>{icon}</Box>
                <Typography
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: active ? 600 : 400,
                    fontSize: 13.5,
                    letterSpacing: '0.01em',
                    color: 'inherit',
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Logout */}
        <Box sx={{ px: 1.5, pb: 2.5, borderTop: `1px solid ${BORDER}`, pt: 2, flexShrink: 0 }}>
          <Box
            component={Link}
            to="/"
            onClick={logout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: '3px',
              textDecoration: 'none',
              color: '#555',
              transition: 'background 0.12s ease, color 0.12s ease',
              '&:hover': {
                bgcolor: '#1D1D1D',
                color: '#EFEFEF',
              },
            }}
          >
            <Box sx={{ '& svg': { fontSize: 17, display: 'block' } }}>
              <LogoutIcon />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 400,
                fontSize: 13.5,
                color: 'inherit',
              }}
            >
              Logout
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
          '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'fadeUp 0.25s ease forwards',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
