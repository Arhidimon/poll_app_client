import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Menu, MenuItem } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import PollIcon from '@mui/icons-material/Poll';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { withTheme } from '@mui/styles';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AuthDialog, { DialogMode } from './AuthDialog';

const drawerWidth = 240;

const Main = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface IAppBarWithSearchAndDrawerState {
  anchorEl: null | HTMLElement;
  mobileMoreAnchorEl: null | HTMLElement;
  isDrawerOpen: boolean;
  isAuthDialogOpen: boolean;
  authDialog: DialogMode.SignIn | DialogMode.SignUp | null;
}

class AppBarWithSearchAndDrawer extends React.Component<
  any,
  IAppBarWithSearchAndDrawerState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      isDrawerOpen: false,
      isAuthDialogOpen: false,
      authDialog: null,
    };
  }

  static contextType = AuthContext;

  handleDrawerOpen = () => {
    this.setState({ isDrawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };

  handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null, mobileMoreAnchorEl: null });
  };

  handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleSignOut = () => {
    this.handleMenuClose();
    this.context.signout();
  };

  handleSignIn = () => {
    this.handleMenuClose();
    this.setState({ authDialog: DialogMode.SignIn });
    // this.context.signin('User');
  };

  handleSignUp = () => {
    this.handleMenuClose();
    this.setState({ authDialog: DialogMode.SignUp });
    // this.context.signin('User');
  };

  handleAuthDialogClose = () => {
    this.setState({ authDialog: null });
  };

  render() {
    const isMenuOpen = Boolean(this.state.anchorEl);
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose} key="profile">
          Profile
        </MenuItem>
        <MenuItem onClick={this.handleMenuClose} key="myAccount">
          My account
        </MenuItem>
        <MenuItem onClick={this.handleSignOut} key="signOut">
          Sign out
        </MenuItem>
      </Menu>
    );
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {this.context.user && [
          <MenuItem key="mails">
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>,
          <MenuItem key="notifications">
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>,
          <MenuItem onClick={this.handleProfileMenuOpen} key="profile">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>,
        ]}
        {!this.context.user && [
          <MenuItem
            key="signIn"
            onClick={() => {
              this.handleSignIn();
            }}
          >
            Sign In
          </MenuItem>,
          <MenuItem
            key="signUp"
            onClick={() => {
              this.handleSignUp();
            }}
          >
            Sign Up
          </MenuItem>,
        ]}
      </Menu>
    );

    console.log(this.context.user);

    return (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <CssBaseline />
        <AppBar position="fixed" open={this.state.isDrawerOpen}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                ...(this.state.isDrawerOpen && {
                  display: 'none',
                }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              PollsApp
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{
                  'aria-label': 'search',
                }}
              />
            </Search>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
              }}
            >
              {!this.context.user && [
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    this.handleSignUp();
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'block',
                      },
                    }}
                  >
                    Sign Up
                  </Typography>
                </Button>,
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    this.handleSignIn();
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'block',
                      },
                    }}
                  >
                    Sign In
                  </Typography>
                </Button>,
              ]}
              {this.context.user && [
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>,
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>,
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>,
              ]}
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
          {renderMobileMenu}
          {renderMenu}
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={this.state.isDrawerOpen}
        >
          <DrawerHeader>
            <IconButton onClick={this.handleDrawerClose}>
              {this.props.theme && this.props.theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <Link
              to={'/'}
              style={{
                textDecoration: 'none',
              }}
            >
              <ListItem button key={'home'}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={'Home'} />
              </ListItem>
            </Link>
            <Link
              to={'/polls'}
              style={{
                textDecoration: 'none',
              }}
            >
              <ListItem button key={'polls'}>
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                <ListItemText primary={'Polls'} />
              </ListItem>
            </Link>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={this.state.isDrawerOpen}>
          <DrawerHeader />
          {this.state.authDialog !== null && (
            <AuthDialog
              mode={this.state.authDialog}
              onClose={this.handleAuthDialogClose}
            />
          )}
        </Main>
      </Box>
    );
  }
}

export default withTheme(AppBarWithSearchAndDrawer);
