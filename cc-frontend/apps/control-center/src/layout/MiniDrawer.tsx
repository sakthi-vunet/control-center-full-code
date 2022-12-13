import * as React from 'react';
import { Link } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BackupIcon from '@mui/icons-material/Backup';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MonitorIcon from '@mui/icons-material/Monitor';
import PersonIcon from '@mui/icons-material/Person';
import SourceIcon from '@mui/icons-material/Source';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import axios from 'axios';

import url_backend from '../configs/url';
import { AuthContext } from '../context/AuthContext';

// set drawer menu width
const drawerWidth = 200;

// css object for open state of drawer
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// css object for drawer close state
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// drawer header style
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// props for open state app bar
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// styling for app bar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// styling for drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
  // );
}));

// props for drawer open or close
interface miniDrawerProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

// styling for the page content to be aligned with the drawer
export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 5,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth - 60}px`,
  }),
}));

export default function MiniDrawer(props: miniDrawerProps) {
  const theme = useTheme();
  const { user, authTokens, logoutUser } = React.useContext(AuthContext);

  // User data for authentication
  const [data, setData] = React.useState('');
  const getUserData = async () => {
    const url = url_backend + '/api/user/';
    console.log(authTokens);
    try {
      const data = await axios({
        method: 'get',
        url: url,
        headers: { Authorization: `Bearer ${authTokens['access']}` },
      });

      setData(data.data);
      console.log('user', JSON.stringify(data.data));
    } catch (e) {
      console.log(e);
    }
  };

  // Appbar icon check
  const open = props.open;
  const setOpen = props.setOpen;

  // Drawer open helper function
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Drawer close helper function
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // user data dialog components
  const [userOpen, setUserOpen] = React.useState(false);

  // logout page redirection

  // user dialog box close helper function
  const handleUserClose = () => {
    setUserOpen(false);
  };

  // user dialog box close helper function
  const handleUserOpen = () => {
    setUserOpen(true);
    getUserData();
  };
  const handleUserLogout = () => {
    setUserOpen(false);
    logoutUser();
  };

  // User dialog box component
  const UserDialog = () => {
    return (
      <div>
        <Dialog open={userOpen} onClose={handleUserClose}>
          <DialogTitle> Current User</DialogTitle>
          <List sx={{ pt: 0 }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user ? user['username'] : 'Admin'} />
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={handleUserClose}>Close</Button>
            <Button onClick={handleUserLogout}>Logout</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  if (user?.username)
    return (
      <>
        <UserDialog />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar>
              {/* Hamburger menu icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              {/* Close icon ehen drawer is open */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerClose}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(!open && { display: 'none' }),
                }}
              >
                {theme.direction === 'rtl' ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>

              {/* Title component */}
              <Grid>
                <Typography variant="h6" noWrap component="div">
                  Control Center
                </Typography>
              </Grid>
              <Grid container justifyContent="flex-end">
                {/* User Dialog Icon */}
                <IconButton>
                  <AccountCircleIcon onClick={(event) => handleUserOpen()} />
                </IconButton>
              </Grid>
            </Toolbar>
          </AppBar>

          {/* Drawer components */}
          <Drawer variant="permanent" open={open}>
            <DrawerHeader></DrawerHeader>
            <Divider />

            {/* Menu List */}
            <List>
              <Link
                to="/app/controlcenter/Home"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Home"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link
                to="/app/controlcenter/Hosts"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <SourceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Hosts"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link
                to="/app/controlcenter/Monitor"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    {/* <MenuListIconButton open> */}
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <MonitorIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Monitor"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                  {/* </MenuListIconButton> */}
                </ListItem>
              </Link>
              <Link
                to="/app/controlcenter/Services"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <MiscellaneousServicesIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Services"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/app/controlcenter/Setupwizard"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <DesignServicesIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Setup Wizard"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/app/controlcenter/Upgradewizard"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <UpgradeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Upgrade Wizard"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/app/controlcenter/Backup"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <BackupIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="BackUp"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>

              <Divider />
            </List>
          </Drawer>

          <DrawerHeader />
        </Box>
      </>
    );
  else return <></>;
}
