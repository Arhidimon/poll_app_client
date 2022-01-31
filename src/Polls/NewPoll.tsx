import {
  Breadcrumbs,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

class NewPoll extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { options: ['', ''], name: '' };
  }

  addOption = () => {
    const options = this.state.options;
    options.push('');
    this.setState(options);
  };

  create = async () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).access_token;
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.REACT_APP_HOST}/api/polls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: this.state.name,
        options: this.state.options,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log('polls');
      console.log(json);
    } else {
      alert('poll create error: ' + response.status);
    }
  };

  removeOption = () => {
    const options = this.state.options;
    if (options.length <= 2) {
      return;
    }
    options.splice(-1);
    this.setState(options);
  };

  render() {
    const options = this.state.options.map((option: string, index: number) => (
      <TextField
        autoFocus
        margin="dense"
        id={`option-${index}`}
        label={`Option ${index}`}
        onChange={(event) => {
          const options = this.state.options;
          options[index] = event.target.value;
          this.setState(options);
        }}
        value={option}
        type="text"
        variant="outlined"
      />
    ));
    return (
      <main>
        <div className="NewPoll">
          <h1>Create new poll.</h1>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/polls">
              Polls
            </Link>
            <Typography color="text.primary">Create new poll</Typography>
          </Breadcrumbs>
          <Paper elevation={3}>
            <FormControl>
              <TextField
                autoFocus
                margin="dense"
                id="poll-name"
                label="Poll name"
                type="text"
                onChange={(event) => {
                  this.setState({ name: event.target.value });
                }}
                variant="outlined"
              />
              {options}
              <Button
                variant="contained"
                color="secondary"
                onClick={this.addOption}
              >
                Add option
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.removeOption}
              >
                Remove option
              </Button>
              <Button variant="contained" color="primary" onClick={this.create}>
                Create
              </Button>
            </FormControl>
          </Paper>
        </div>
      </main>
    );
  }
}

export default NewPoll;
