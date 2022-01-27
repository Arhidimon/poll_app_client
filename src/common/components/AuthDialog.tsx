// import {
//   TextField,
//   Button,
//   Checkbox,
//   Typography,
//   FormControlLabel,
//   withStyles,
// } from '@mui/material/';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import React from 'react';
import { AnyNsRecord } from 'dns';
import { isReturnStatement } from 'typescript';

import { AuthContext } from '../AuthContext';
import { Checkbox } from '@mui/material';

const styles = (theme: any) => ({
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:enabled:hover': {
      color: theme.palette.primary.dark,
    },
    '&:enabled:focus': {
      color: theme.palette.primary.dark,
    },
  },
  disabledText: {
    cursor: 'auto',
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
});

export enum DialogMode {
  SignIn,
  SignUp,
  Terms,
}
// interface ILoginDialogProps {};
interface ILoginDialogState {
  mode: DialogMode;
  email: { value: string; isValid: boolean };
  login: { value: string; isValid: boolean };
  password: { value: string; isValid: boolean };
  isTermsAccepted: boolean;
}

class AuthDialog extends React.Component<any, ILoginDialogState> {
  fields: {
    email: { value: string; isValid: boolean };
    login: { value: string; isValid: boolean };
    password: { value: string; isValid: boolean };
  };

  static contextType = AuthContext;

  constructor(props: any) {
    super(props);
    this.state = {
      mode: props.mode,
      email: { value: '', isValid: false },
      login: { value: '', isValid: false },
      password: { value: '', isValid: false },
      isTermsAccepted: false,
    };
    this.fields = {
      email: { value: '', isValid: false },
      login: { value: '', isValid: false },
      password: { value: '', isValid: false },
    };
  }

  // handleClose = () => {
  //   this.setState({ isOpen: false });
  // };
  validate = (field: string, value: string) => {
    switch (field) {
      case 'email': {
        this.fields.email.value = value;
        this.fields.email.isValid =
          /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)*\w[\w-]{0,66}\.[a-z]{2,6}(?:\.[a-z]{2})?$/.test(
            value,
          );
        break;
      }
      case 'password': {
        this.fields.password.value = value;
        this.fields.password.isValid = value.length > 0;
        break;
      }
      case 'login': {
        this.fields.login.value = value;
        this.fields.login.isValid = value.length > 0;
        break;
      }
    }
    this.setState({ ...this.fields });
    console.log(this.fields);
    return;
  };

  onSignInClick = async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.login.value,
        password: this.state.password.value,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log('SignIn');
      console.log(json);
      this.context.signin({ user: { login: this.state.login.value } });
      localStorage.setItem('username', this.state.login.value);
      localStorage.setItem('user', JSON.stringify(json));
    } else {
      alert('SigIn error: ' + response.status);
    }
    this.props.onClose();
  };

  onTermsDecline = () => {
    this.setState({ mode: DialogMode.SignUp, isTermsAccepted: false });
  };

  onTermsAccept = () => {
    this.setState({ mode: DialogMode.SignUp, isTermsAccepted: true });
  };

  onSignUpSubmit = async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.login.value,
        password: this.state.password.value,
        email: this.state.email.value,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log('SignUp');
      console.log(json);
    } else {
      alert('SignUp error: ' + response.status);
    }
    this.props.onClose();
  };

  render() {
    switch (this.state.mode) {
      case DialogMode.SignIn: {
        const showLoginError =
          this.state.login.value !== '' && !this.state.login.isValid;
        const showPasswordError =
          this.state.password.value !== '' && !this.state.password.isValid;
        return (
          <div>
            <Dialog
              // open={this.props.mode !== null}
              open
              onClose={this.props.onClose}
            >
              <DialogTitle>Sign In</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  By continuing, you agree to our User Agreement and Privacy
                  Policy.
                </DialogContentText>
                <TextField
                  error={showLoginError}
                  helperText={showLoginError ? 'Invalid login!' : ''}
                  autoFocus
                  margin="dense"
                  id="login"
                  label="Login"
                  type="login"
                  fullWidth
                  variant="outlined"
                  onBlur={(event) => {
                    this.validate('login', event.target.value);
                  }}
                />
                <TextField
                  error={showPasswordError}
                  helperText={showPasswordError ? 'Invalid password!' : ''}
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onBlur={(event) => {
                    this.validate('password', event.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose}>Cancel</Button>
                <Button onClick={this.onSignInClick}>Sign in</Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
      case DialogMode.SignUp: {
        const showEmailError =
          this.state.email.value !== '' && !this.state.email.isValid;
        const showPasswordError =
          this.state.password.value !== '' && !this.state.password.isValid;
        const showLoginError =
          this.state.login.value !== '' && !this.state.login.isValid;
        return (
          <div>
            <Dialog open onClose={this.props.onClose}>
              <DialogTitle>Sign Up</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  By continuing, you are setting up a PollApp account and agree
                  to our User Agreement and Privacy Policy.
                </DialogContentText>
                <TextField
                  autoFocus
                  error={showEmailError}
                  helperText={showEmailError ? 'Invalid email!' : ''}
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  onBlur={(event) => {
                    this.validate('email', event.target.value);
                  }}
                />
                <TextField
                  error={showLoginError}
                  helperText={showLoginError ? 'Invalid login!' : ''}
                  autoFocus
                  margin="dense"
                  id="login"
                  label="Login"
                  type="login"
                  fullWidth
                  variant="outlined"
                  onBlur={(event) => {
                    this.validate('login', event.target.value);
                  }}
                />
                <TextField
                  margin="dense"
                  error={showPasswordError}
                  helperText={showPasswordError ? 'Invalid password!' : ''}
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onBlur={(event) => {
                    this.validate('password', event.target.value);
                  }}
                />
                <Checkbox
                  checked={this.state.isTermsAccepted}
                  onChange={(event) =>
                    this.setState({ isTermsAccepted: event.target.checked })
                  }
                />{' '}
                <span>I read and accepted</span>
                <Button
                  style={{ textTransform: 'none' }}
                  onClick={() => this.setState({ mode: DialogMode.Terms })}
                >
                  user agreement
                </Button>
                .
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose}>Cancel</Button>
                <Button onClick={this.onSignUpSubmit}>Sign Up</Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
      case DialogMode.Terms: {
        return (
          <div>
            <Dialog
              open
              onClose={this.props.onClose}
              scroll="paper"
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              <DialogTitle id="scroll-dialog-title">Terms of Use</DialogTitle>
              <DialogContent dividers>
                <DialogContentText
                  id="scroll-dialog-description"
                  // ref={descriptionElementRef}
                  tabIndex={-1}
                >
                  `Generic Terms of Use Please read these terms of use carefully
                  before using service operated by PollsApp. Conditions of use
                  By using this website, you certify that you have read and
                  reviewed this Agreement and that you agree to comply with its
                  terms. If you do not want to be bound by the terms of this
                  Agreement, you are advised to leave the website accordingly.
                  PollsApp only grants use and access of this website, its
                  products, and its services to those who have accepted its
                  terms. Privacy policy Before you continue using our website,
                  we advise you to read our privacy policy [link to privacy
                  policy] regarding our user data collection. It will help you
                  better understand our practices. Age restriction You must be
                  at least 18 (eighteen) years of age before you can use this
                  website. By using this website, you warrant that you are at
                  least 18 years of age and you may legally adhere to this
                  Agreement. PollsApp assumes no responsibility for liabilities
                  related to age misrepresentation. Intellectual property You
                  agree that all materials, products, and services provided on
                  this website are the property of PollsApp, its affiliates,
                  directors, officers, employees, agents, suppliers, or
                  licensors including all copyrights, trade secrets, trademarks,
                  patents, and other intellectual property. You also agree that
                  you will not reproduce or redistribute the PollsApp’s
                  intellectual property in any way, including electronic,
                  digital, or new trademark registrations. You grant PollsApp a
                  royalty-free and non-exclusive license to display, use, copy,
                  transmit, and broadcast the content you upload and publish.
                  For issues regarding intellectual property claims, you should
                  contact the company in order to come to an agreement. User
                  accounts As a user of this website, you may be asked to
                  register with us and provide private information. You are
                  responsible for ensuring the accuracy of this information, and
                  you are responsible for maintaining the safety and security of
                  your identifying information. You are also responsible for all
                  activities that occur under your account or password. If you
                  think there are any possible issues regarding the security of
                  your account on the website, inform us immediately so we may
                  address it accordingly. We reserve all rights to terminate
                  accounts, edit or remove content and cancel orders in their
                  sole discretion. Terms of use template by WebsitePolicies.com
                  Applicable law By visiting this website, you agree that the
                  laws of the [location], without regard to principles of
                  conflict laws, will govern these terms and conditions, or any
                  dispute of any sort that might come between PollsApp and you,
                  or its business partners and associates. Disputes Any dispute
                  related in any way to your visit to this website or to
                  products you purchase from us shall be arbitrated by state or
                  federal court [location] and you consent to exclusive
                  jurisdiction and venue of such courts. Indemnification You
                  agree to indemnify PollsApp and its affiliates and hold
                  PollsApp harmless against legal claims and demands that may
                  arise from your use or misuse of our services. We reserve the
                  right to select our own legal counsel. Limitation on liability
                  PollsApp is not liable for any damages that may occur to you
                  as a result of your misuse of our website. PollsApp reserves
                  the right to edit, modify, and change this Agreement any time.
                  We shall let our users know of these changes through
                  electronic mail. This Agreement is an understanding between
                  PollsApp and the user, and this supersedes and replaces all
                  prior agreements regarding the use of this website.`
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.onTermsDecline}>Decline</Button>
                <Button onClick={this.onTermsAccept}>Accept</Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
    }
  }
}

export default AuthDialog;
