import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { Tooltip } from '@mui/material';

const drawerWidth = 200;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <Link to="/app/controlcenter"  style={{ textDecoration: 'none',color:'black' }}>
        
        <Tooltip title="Home">
          <ListItem disablePadding>
          <ListItemButton >
            <ListItemText primary={'Home'}/>
            
          </ListItemButton>
        </ListItem>
        </Tooltip>
        </Link>
        <Divider/>
        <Link to="/app/controlcenter/Hosts"  style={{ textDecoration: 'none',color:'black'}}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'Hosts'}/>
          </ListItemButton>
        </ListItem>
        </Link>
      
      <Divider />
      <Link to="/app/controlcenter/Monitor"  style={{ textDecoration: 'none',color:'black' }}>
      <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'Monitor'}/>
          </ListItemButton>
        </ListItem>
        </Link>
        
        <Divider/>
        <Link to="/app/controlcenter/Services"  style={{ textDecoration: 'none',color:'black' }}>
      <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'Services'}/>
          </ListItemButton>
        </ListItem>
        </Link>
        
        <Divider/>
        <Link to="/app/controlcenter/Setupwizard"  style={{ textDecoration: 'none',color:'black'}}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'SetUp Wizard'}/>
          </ListItemButton>
        </ListItem>
        </Link>
        <Divider/>
        <Link to="/app/controlcenter/Upgradewizard"  style={{ textDecoration: 'none',color:'black' }}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'Upgrade Wizard'}/>
          </ListItemButton>
        </ListItem>
        </Link>
        <Divider/>
        <Link to="/app/controlcenter/Backup"  style={{ textDecoration: 'none',color:'black'}}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary={'Backup'}/>
          </ListItemButton>
        </ListItem>
        </Link>
        <Divider/>
        </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Control Center
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"    
      >
          <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
