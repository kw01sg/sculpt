import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const ACCENT = '#C8FF00';
const BG = '#0A0A0A';
const BORDER = '#272727';

const HomePage: React.FC = () => {
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
      {/* Minimal top bar */}
      <Box
        sx={{
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${BORDER}`,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.72rem', py: 0.75 }}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="small"
            sx={{ fontSize: '0.72rem', py: 0.75 }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4,
          pt: 8,
          pb: 16,
          position: 'relative',
          textAlign: 'center',
          '@keyframes heroIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'heroIn 0.5s ease forwards',
        }}
      >
        {/* Decorative grid lines */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${BORDER} 1px, transparent 1px),
              linear-gradient(90deg, ${BORDER} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.35,
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
          }}
        />

        {/* Accent glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 300,
            background: `radial-gradient(ellipse, ${ACCENT}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 3,
              px: 1.5,
              py: 0.5,
              border: `1px solid ${BORDER}`,
              borderRadius: '3px',
              '@keyframes tagIn': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'tagIn 0.4s 0.1s ease both',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: ACCENT,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#888',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Fitness Tracker
            </Typography>
          </Box>

          {/* Main headline */}
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(64px, 10vw, 120px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#EFEFEF',
              mb: 0.5,
              '@keyframes headlineIn': {
                from: { opacity: 0, transform: 'translateY(16px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'headlineIn 0.45s 0.15s ease both',
            }}
          >
            TRACK.
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(64px, 10vw, 120px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: ACCENT,
              mb: 0.5,
              '@keyframes accentIn': {
                from: { opacity: 0, transform: 'translateY(16px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'accentIn 0.45s 0.22s ease both',
            }}
          >
            LIFT.
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(64px, 10vw, 120px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#EFEFEF',
              mb: 4,
              '@keyframes lastIn': {
                from: { opacity: 0, transform: 'translateY(16px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'lastIn 0.45s 0.29s ease both',
            }}
          >
            GROW.
          </Typography>

          {/* Subheadline */}
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#666',
              mb: 5,
              maxWidth: 440,
              mx: 'auto',
              lineHeight: 1.6,
              '@keyframes subIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
              animation: 'subIn 0.5s 0.4s ease both',
            }}
          >
            Log workouts, track nutrition, and watch your progress compound over time.
          </Typography>

          {/* CTA buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              '@keyframes ctaIn': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'ctaIn 0.4s 0.5s ease both',
            }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/register"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '0.82rem' }}
            >
              Start for free
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/login"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '0.82rem' }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bottom feature strip */}
      <Box
        sx={{
          borderTop: `1px solid ${BORDER}`,
          px: 4,
          py: 2,
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          flexWrap: 'wrap',
          '@keyframes stripIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animation: 'stripIn 0.5s 0.6s ease both',
        }}
      >
        {['Workout Logging', 'Exercise Library', 'Nutrition Tracking', 'Progress History'].map((feature) => (
          <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: ACCENT }} />
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '0.72rem',
                color: '#555',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
