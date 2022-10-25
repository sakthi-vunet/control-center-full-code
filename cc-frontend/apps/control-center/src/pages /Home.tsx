import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, List, Stack, Table, TableCell, TableRow,ListItem,ListItemText} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import axios from 'axios';
import { css, cx } from '@emotion/css';
import url_backend from '../configs/url';



export interface Settings {
  hosts: number;
  expected_instances: number;
  enabled_services: number;
}

export interface Status {
  healthy_hosts:      number;
  services_running:   number;
  instances_running:  number;
  unhealthy_hosts:    string[];
  unhealthy_services: string[];
  stopped_instances:  string[];
}

export interface VersionInfo{
  platform_version:  string;
  cc_version:        string;
  Last_upgrade_time: string;
}



export function SettingsCard() {  
  const [data, setData] = React.useState<Settings[]>([]);
  const getProductData = async () => {
  const url = url_backend+'/api/settings/';

    try {
      const data = await axios.get<Settings[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);
  

  return (
    <>
      {data.map((row) => (
        <Card sx={{ maxWidth: 350, boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table >
              <TableRow >
                <TableCell sx={{fontSize:40}} >{row.hosts}</TableCell>
                <TableCell  sx={{fontSize:40}}>
                  {row.expected_instances}
                </TableCell>
                <TableCell  sx={{fontSize:40}}>
                  {row.enabled_services}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hosts</TableCell>
                <TableCell>Expected Instances</TableCell>
                <TableCell>Enabled Services</TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small">View Details</Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

export function VersionInfoCard() {  
  const [data, setData] = React.useState<VersionInfo[]>([]);
  const getProductData = async () => {
  const url = url_backend+'/api/version_info/';

    try {
      const data = await axios.get<VersionInfo[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {data.map((row) => (
        <Card sx={{ maxWidth: 350, boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table >
              <TableRow>
                <TableCell sx={{fontSize:40}}>{row.platform_version}</TableCell>
                <TableCell  sx={{fontSize:40}}>
                  {row.cc_version}
                </TableCell>
                <TableCell  >
                  {row.Last_upgrade_time}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>vsmaps version</TableCell>
                <TableCell>cc version</TableCell>
                <TableCell>Last Upgrade</TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small">Upgrade</Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

export function StatusCard() {  
  const [data, setData] = React.useState<Status[]>([]);
  const getProductData = async () => {
  const url = url_backend+'/api/status/';

    try {
      const data = await axios.get<Status[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {data.map((row) => (
        <Card sx={{ boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table>
            
              <TableRow sx={{}}>
                <TableCell sx={{fontSize:40}}>{row.healthy_hosts}</TableCell>
                <TableCell sx={{fontSize:40}}>
                {row.instances_running}
                </TableCell>
                <TableCell sx={{fontSize:40}}>
                  {row.services_running}
                </TableCell>
                <TableCell sx={{fontSize:40}}>
                  {row.unhealthy_hosts.length}
                </TableCell>
                <TableCell sx={{fontSize:40}}>
                  {row.unhealthy_services.length}
                </TableCell>
                
              </TableRow>
             
              <TableRow>
                <TableCell> Healthy Hosts</TableCell>
                <TableCell>Running Instances</TableCell>
                <TableCell>Running Services</TableCell>
                <TableCell>Unhealthy Hosts</TableCell>
                <TableCell>Unhealthy Services</TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small">View Details</Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

export function NotificationsCard() {
  return (
    <Card sx={{ width:500 , boxShadow: 3, m: 1 }}>
      <CardContent>
        <Stack direction="row">
      <IconButton>
        <NotificationsActiveIcon/>
        </IconButton>
        <Typography gutterBottom variant="h5" component="div">
          Important Notifications
        </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          <List>
            <ListItem>
            <ListItemText>
           License expiring in 3 Weeks
           </ListItemText>
           </ListItem>
           <ListItem>
           <ListItemText>
          Service XXX having frequent restarts
          </ListItemText>
          </ListItem>
          </List>
        </Typography>
      </CardContent>
    </Card>
  );
}

export function HealthCard() {
  return (
    <Card sx={{ width: 680, boxShadow: 3, m: 1 }}>
      <CardContent>
    
        <Stack direction="row">
      <IconButton>
        <HealthAndSafetyIcon/>
        </IconButton>
        <Typography gutterBottom variant="h5" component="div" >
          System Health Check
        </Typography>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          System HEalth Summary appears here
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small">Dashboards</Button>
      </CardActions>
    </Card>
  );
}

export const Home = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 0,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Toolbar />
      <Stack direction="column">
        <Stack direction="row">
          <SettingsCard />
          <StatusCard />
          <VersionInfoCard />
        </Stack>
        <Stack direction="row">
          <NotificationsCard />
          <HealthCard />
        </Stack>
      </Stack>
    </Box>
  );
};
