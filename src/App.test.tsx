import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

test('renders learn react link', () => {
  render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
  expect(screen).toBeDefined();
});
