import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ACCENT = '#C8FF00';
const BORDER = '#272727';
const SURFACE = '#191919';

const quickActions = [
  {
    label: 'Log Workout',
    description: 'Record today\'s session',
    path: '/workouts',
    icon: <FitnessCenterIcon />,
  },
  {
    label: 'Log Nutrition',
    description: 'Track your macros',
    path: '/nutrition',
    icon: <RestaurantMenuOutlinedIcon />,
  },
  {
    label: 'Exercise Library',
    description: 'Manage your exercises',
    path: '/exercises',
    icon: <FormatListBulletedIcon />,
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const emailHandle = user?.email?.split('@')[0] ?? 'Athlete';

  return (
    <Layout>
      <Box sx={{ px: { xs: 3, md: 5 }, pt: 5, pb: 6, maxWidth: 800 }}>
        {/* Greeting */}
        <Box sx={{ mb: 6 }}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 300,
              fontSize: 13,
              color: '#555',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            Welcome back
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#EFEFEF',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            {emailHandle}
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              display: 'inline-block',
              width: 40,
              height: 3,
              bgcolor: ACCENT,
              borderRadius: '2px',
            }}
          />
        </Box>

        {/* Quick actions */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 11,
              fontWeight: 500,
              color: '#555',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {quickActions.map(({ label, description, path, icon }) => (
              <Box
                key={path}
                component={Link}
                to={path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  p: 2.5,
                  bgcolor: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                  '&:hover': {
                    borderColor: '#404040',
                    bgcolor: '#1F1F1F',
                    '& .arrow-icon': {
                      transform: 'translateX(3px)',
                      color: ACCENT,
                    },
                  },
                  '@keyframes cardIn': {
                    from: { opacity: 0, transform: 'translateX(-8px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                {/* Icon box */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#111',
                    border: `1px solid ${BORDER}`,
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    '& svg': { fontSize: 18, color: '#666' },
                  }}
                >
                  {icon}
                </Box>

                {/* Text */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#EFEFEF',
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 300,
                      fontSize: 12,
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    {description}
                  </Typography>
                </Box>

                {/* Arrow */}
                <Box
                  className="arrow-icon"
                  sx={{
                    '& svg': { fontSize: 16, color: '#444' },
                    transition: 'transform 0.15s ease, color 0.15s ease',
                  }}
                >
                  <ArrowForwardIcon />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
