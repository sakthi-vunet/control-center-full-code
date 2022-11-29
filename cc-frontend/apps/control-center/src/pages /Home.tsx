import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Badge from '@mui/material/Badge';
import {
  IconButton,
  List,
  Stack,
  Table,
  TableCell,
  TableRow,
  ListItem,
  ListItemText,
 
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import axios from 'axios';
import { css, cx } from '@emotion/css';
import url_backend from '../configs/url';
import BookIcon from '@mui/icons-material/Book';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();
  const [openloading, setopenloading] = React.useState(!promiseInProgress);

  const handleCloseLoading = () => {
    setopenloading(false);
  };
  return promiseInProgress ? (
    <div>
      <Dialog open={openloading} onClose={handleCloseLoading} maxWidth="sm">
        <DialogTitle>
          {' '}
          <Typography>Loading ...</Typography>
          <LinearProgress />{' '}
        </DialogTitle>
      </Dialog>
    </div>
  ) : (
    <></>
  );
};

export interface Settings {
  hosts: string[];
  expected_instances: number;
  enabled_services: string[];
}

export interface Status {
  healthy_hosts: number;
  services_running: number;
  instances_running: number;
  unhealthy_hosts: string[];
  unhealthy_services: string[];
  stopped_instances: string[];
}

export interface VersionInfo {
  platform_version: string;
  cc_version: string;
  Last_upgrade_time: string;
}

export function SettingsCard() {
  const [data, setData] = React.useState<Settings[]>([]);
  const getProductData = async () => {
    const url = url_backend + '/api/settings/';

    try {
      const data = await axios.get<Settings[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  const [open,setOpen]=React.useState(false)

  const handleClose=()=>{
    setOpen(false)
  }
  const handleOpen=()=>{
    setOpen(true)
  }
  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {data.map((row) => (
        <Card sx={{ maxWidth: 350, boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell sx={{ fontSize: 40 }}>{row.hosts.length}</TableCell>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.expected_instances}
                </TableCell>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.enabled_services.length}
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
            <Button size="small" onClick={(event) => handleOpen()}>View Details</Button>
          </CardActions>
        </Card>
      ))}

<div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle> Hosts</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
                 <Typography 
          sx={{whiteSpace:'pre-line',fontFamily:'monospace',flex:1,flexWrap:'wrap',wordWrap:'break-word',fontSize:'15px'}} 
          color="red" >
               {data.map((row) => (JSON.stringify(row.hosts)))}</Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogTitle> Services Enabled</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
              <Typography 
          sx={{whiteSpace:'pre-line',fontFamily:'monospace',flex:1,flexWrap:'wrap',wordWrap:'break-word',fontSize:'15px'}} 
          color="red" >
               {data.map((row) => (JSON.stringify(row.enabled_services)))}
               </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
           
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export function VersionInfoCard() {
  const [data, setData] = React.useState<VersionInfo[]>([]);

  const getProductData = async () => {
    const url = url_backend + '/api/version_info/';

    try {
      const data = await axios.get<VersionInfo[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  const timerRef = React.useRef<number>();

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  const [openupdates, setOpenUpdates] = React.useState(false);
  const [query, setQuery] = React.useState('idle');

  const handleClickQuery = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query !== 'idle') {
      setQuery('idle');
      return;
    }

    setQuery('progress');
    timerRef.current = window.setTimeout(() => {
      setQuery('success');
    }, 2000);
  };

  const handleClickOpenUpdates = () => {
    setOpenUpdates(true);
    handleClickQuery();
  };

  const handleCloseUpdates = () => {
    setOpenUpdates(false);
    setQuery('idle');
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {data.map((row) => (
        <Card sx={{ maxWidth: 350, boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.platform_version}
                </TableCell>
                <TableCell sx={{ fontSize: 40 }}>{row.cc_version}</TableCell>
                <TableCell sx={{fontSize: 10}}>{row.Last_upgrade_time}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>vsmaps version</TableCell>
                <TableCell>cc version</TableCell>
                <TableCell>Last Upgrade</TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={(event) => handleClickOpenUpdates()}>
              Upgrade
            </Button>
          </CardActions>
        </Card>
      ))}
      <div>
        <Dialog
          open={openupdates}
          onClose={handleCloseUpdates}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle> Control Center Application Update</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              {query === 'success' ? (
                <DialogContentText
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    flex: 1,
                    flexWrap: 'wrap',
                  }}
                  color="black"
                >
                  <Typography>Application is up-to-date.</Typography>
                </DialogContentText>
              ) : (
                <Fade
                  in={query === 'progress'}
                  style={{
                    transitionDelay: query === 'progress' ? '800ms' : '0ms',
                  }}
                  unmountOnExit
                >
                  <DialogContentText
                    sx={{
                      whiteSpace: 'pre-line',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      flex: 1,
                      flexWrap: 'wrap',
                    }}
                    color="black"
                  >
                    <Typography>Checking for updates</Typography>
                    <LinearProgress />
                  </DialogContentText>
                </Fade>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdates}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export function StatusCard() {

  const [data, setData] = React.useState<Status[]>([]);

  const getProductData = async () => {
    const url = url_backend + '/api/status/';

    try {
      const data = await axios.get<Status[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    trackPromise(getProductData());
  }, []);
  const [open,setOpen]=React.useState(false)

  const handleClose=()=>{
    setOpen(false)
  }
  const handleOpen=()=>{
    setOpen(true)
  }

  return (
    <>
      <LoadingIndicator />
      {data.map((row) => (
        <Card sx={{ boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table>
              <TableRow sx={{}}>
                <TableCell sx={{ fontSize: 40 }}>{row.healthy_hosts}</TableCell>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.instances_running}
                </TableCell>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.services_running}
                </TableCell>
                <TableCell sx={{ fontSize: 40 }}>
                  {row.unhealthy_hosts.length}
                </TableCell>
                <TableCell sx={{ fontSize: 40 }}>
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
            <Button size="small" onClick={handleOpen}>View Details</Button>
          </CardActions>
        </Card>
      ))}
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Unhealthy Hosts</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
                 <Typography 
          sx={{whiteSpace:'pre-line',fontFamily:'monospace',flex:1,flexWrap:'wrap',wordWrap:'break-word',fontSize:'15px'}} 
          color="red" >
               {data.map((row) => (JSON.stringify(row.unhealthy_hosts)))}</Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogTitle>Disabled Services</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
              <Typography 
          sx={{whiteSpace:'pre-line',fontFamily:'monospace',flex:1,flexWrap:'wrap',wordWrap:'break-word',fontSize:'15px'}} 
          color="red" >
               {data.map((row) => (JSON.stringify(row.unhealthy_services)))}
               </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogTitle>Disabled Services</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
              <Typography 
          sx={{whiteSpace:'pre-line',fontFamily:'monospace',flex:1,flexWrap:'wrap',wordWrap:'break-word',fontSize:'15px'}} 
          color="red" >
               {data.map((row) => (JSON.stringify(row.stopped_instances)))}
               </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
           
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export function NotificationsCard() {
  const [data, setData] = React.useState('');

  const getProductData = async () => {
    const url = url_backend + '/api/notifications/';

    try {
      const data = await axios.get(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);


  setInterval(getProductData, 6000000);

  const notifyData= data.split(",");

  return (
    <Card sx={{ width: 500, boxShadow: 3, m: 1 }}>
      <CardContent>
        <Stack direction="row">
          
          <Typography gutterBottom variant="h5" component="div">
          <IconButton>
          <Badge badgeContent={notifyData.length} color="primary"  anchorOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}>
            <NotificationsActiveIcon sx={{ color: 'black' }}/>
          </Badge>
          </IconButton>
            Important Notifications
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary">
        <List >
          {notifyData.map((item,index)=>{
            return(
            <ListItem sx={{paddingTop: '2px'}}>
              <ListItemText>{item}</ListItemText>
            </ListItem>)
          })}
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
          
          <Typography gutterBottom variant="h5" component="div">
          <IconButton>
            <HealthAndSafetyIcon  sx={{ color: 'black' }}/>
          </IconButton>
            System Health Check
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          System Health Summary appears here
        </Typography>

      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small">Dashboards</Button>
      </CardActions>
    </Card>
  );
}


export const Home = () => {
  const [openlogs, setOpenLogs] = React.useState(false);
  const handleClickOpenLogs = () => {
    setOpenLogs(true);
    getAPIData();
  };

  const handleCloseLogs = () => {
    setOpenLogs(false);
  };

  const handleRefreshLogs =() =>{
    setAuditLogdata('');
    getAPIData();
  }

  const request_url = url_backend + '/api/auditlogs/';

  const getAPIData = async () => {
    try {
      const data = await axios.get<Record<string, unknown>>(request_url);

      setAuditLogdata(JSON.parse(JSON.stringify(data.data)));
    } catch (e) {
      console.log(e);
    }
  };
  const [auditlogdata, setAuditLogdata] = React.useState('');

  

  return (
    // <>

    <Box
      component="main"
      sx={{
        flexGrow: 0,
        p: 0.05,
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

        <Stack direction="row" justifyContent="flex-end" sx={{p:1}}>
          <Button
            size="small"
            variant="contained"
            onClick={(event) => handleClickOpenLogs()}
          >
            <BookIcon></BookIcon>View Logs
          </Button>
        </Stack>
      </Stack>

      <div>
        <Dialog
          open={openlogs}
          onClose={handleCloseLogs}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle> Application Audit Logs</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText
                sx={{
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
                color="black"
              >
                {auditlogdata?auditlogdata:<ThreeDots 
	color={'red'} 
	height={80} 
	width={80} 
	/>
  }
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLogs}>Close</Button>
            <Button onClick={handleRefreshLogs}>Refresh</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>

    // </>
  );
};
