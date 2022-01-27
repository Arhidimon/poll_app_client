import { Home } from '@mui/icons-material';
import { Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

class PageNotFound extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Paper
        sx={{
          backgroundColor: (t) => t.palette.background.default,
          margin: 0,
          height: `calc(100vh - 64px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: `100%`,
          }}
        >
          <Typography variant="h4">404</Typography>
          <Typography variant="subtitle1">
            <span>Page Not Found</span>
          </Typography>
          <Link to="/">
            <Home />
          </Link>
        </div>
      </Paper>
    );
  }
}

export default PageNotFound;
