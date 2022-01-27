import React from 'react';
import Poll from './Polls/Poll';
import Polls from './Polls/Polls';
import AppBarWithSearchAndDrawer from './common/components/AppBarWithSearchAndDrawer';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Box, Container, Typography } from '@mui/material';
import PageNotFound from './PageNotFound/PageNotFound';
import NewPoll from './Polls/NewPoll';
import LoginDialog from './common/components/AuthDialog';
import IUser from './common/interfaces/IUser';
import { AuthContext } from './common/AuthContext';

// interface IProps {}

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>That feels like an existential question, don't you think?</p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
        PollsApp
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
interface IAppState {
  user: null | IUser;
}

class App extends React.Component<any, IAppState> {
  constructor(props: any) {
    super(props);
    const userCredentials = localStorage.getItem('user');
    const username = localStorage.getItem('username');
    this.state = {
      user: username && userCredentials ? { login: username } : null,
    };
  }
  signin = (login: string) => {
    this.setState({ user: { login } });
  };

  signout = () => {
    this.setState({ user: null });
    localStorage.clear();
  };

  componentDidMount() {
    const user = localStorage.getItem('user');
    const username = localStorage.getItem('username');
    if (user && username) {
      this.signin(username);
    }
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          signin: this.signin,
          signout: this.signout,
        }}
      >
        <div className="App">
          <header className="App-header">
            {/* <PrimarySearchAppBar /> */}
            <AppBarWithSearchAndDrawer />
          </header>
          <Container maxWidth="md">
            <Box sx={{ minHeight: 500 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="/polls/new" element={<NewPoll />} />
                <Route path="/polls/:id" element={<Poll />} />
                <Route path="/404" element={<PageNotFound />} />
              </Routes>
            </Box>
          </Container>
          <footer>
            <Copyright />
          </footer>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
