import { createTheme } from '@mui/material/styles';

const ACCENT = '#C8FF00';
const BG = '#0A0A0A';
const SURFACE = '#111111';
const SURFACE_RAISED = '#191919';
const BORDER = '#272727';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: BG,
      paper: SURFACE_RAISED,
    },
    primary: {
      main: ACCENT,
      contrastText: '#000000',
    },
    secondary: {
      main: '#888888',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4545',
    },
    text: {
      primary: '#EFEFEF',
      secondary: '#888888',
    },
    divider: BORDER,
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h1: { fontFamily: '"Oswald", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h2: { fontFamily: '"Oswald", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontFamily: '"Oswald", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Oswald", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Oswald", sans-serif', fontWeight: 500 },
    h6: { fontFamily: '"Oswald", sans-serif', fontWeight: 500 },
    button: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG,
          scrollbarWidth: 'thin',
          scrollbarColor: `${BORDER} ${BG}`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: BG },
          '&::-webkit-scrollbar-thumb': { background: BORDER, borderRadius: 3 },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${BORDER}`,
          backgroundColor: SURFACE_RAISED,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          fontWeight: 600,
          padding: '10px 22px',
          fontSize: '0.8rem',
        },
        containedPrimary: {
          backgroundColor: ACCENT,
          color: '#000',
          '&:hover': {
            backgroundColor: '#AEDD00',
          },
        },
        outlinedPrimary: {
          borderColor: BORDER,
          color: '#EFEFEF',
          '&:hover': {
            borderColor: '#444',
            backgroundColor: SURFACE_RAISED,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#404040',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ACCENT,
            borderWidth: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#666',
          '&.Mui-focused': {
            color: ACCENT,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: SURFACE_RAISED,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 500,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          border: `1px solid`,
        },
        standardError: {
          borderColor: '#FF454540',
          backgroundColor: '#FF45451A',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          '&:hover': {
            backgroundColor: '#1F1F1F',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: SURFACE,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: `${ACCENT}22`,
            '&:hover': {
              backgroundColor: `${ACCENT}33`,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiCollapse: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

export default theme;
export { ACCENT, BG, SURFACE, SURFACE_RAISED, BORDER };
