import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';

import BookIcon from '@mui/icons-material/Book';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
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
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import url_backend from '../configs/url';

// Home page cards loading indicator
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

// settings card props
export interface Settings {
  hosts: string[];
  expected_instances: number;
  enabled_services: string[];
}

// status card props
export interface Status {
  healthy_hosts: number;
  services_running: number;
  instances_running: number;
  unhealthy_hosts: string[];
  unhealthy_services: string[];
  stopped_instances: string[];
}

// version info card props
export interface VersionInfo {
  platform_version: string;
  cc_version: string;
  Last_upgrade_time: string;
}

//  settings card component
export function SettingsCard() {
  const [data, setData] = React.useState<Settings[]>([]);
  const getSettingsData = async () => {
    const url = url_backend + '/api/settings/';

    try {
      const data = await axios.get<Settings[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  // handles view details dialog
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    getSettingsData();
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
            <Button size="small" onClick={(event) => handleOpen()}>
              View Details
            </Button>
          </CardActions>
        </Card>
      ))}

      {/* view details dialog lists host and enabled services */}
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          {/* Host List */}
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
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {data.map((row) => row.hosts + ' ')}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          {/* Services Enabled List */}
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
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {data.map((row) => row.enabled_services + ' ')}
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

// Version info component
export function VersionInfoCard() {
  const [data, setData] = React.useState<VersionInfo[]>([]);

  const getVersionData = async () => {
    const url = url_backend + '/api/version_info/';

    try {
      const data = await axios.get<VersionInfo[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  // updates loading component
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
    getVersionData();
  }, []);

  return (
    <>
      {data.map((row) => (
        <Card sx={{ maxWidth: 350, boxShadow: 3, m: 1 }}>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell sx={{ fontSize: 40 }}>
                  {/* vsmaps version */}
                  {row.platform_version}
                </TableCell>
                {/* control center version */}
                <TableCell sx={{ fontSize: 40 }}>{row.cc_version}</TableCell>
                {/* last upgrade time */}
                <TableCell sx={{ fontSize: 10 }}>
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
            <Button size="small" onClick={(event) => handleClickOpenUpdates()}>
              Upgrade
            </Button>
          </CardActions>
        </Card>
      ))}
      {/* Upgrades dialog box */}
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

// Status card component

export function StatusCard() {
  const [data, setData] = React.useState<Status[]>([]);

  const getStatusData = async () => {
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
    trackPromise(getStatusData());
  }, []);

  // handles view details dialog
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

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
            <Button size="small" onClick={handleOpen}>
              View Details
            </Button>
          </CardActions>
        </Card>
      ))}

      {/* view details dialog lists unhealthy hosts,disabled services and failed instances */}
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {data.map((row) => row.unhealthy_hosts + ' ')}
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
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {data.map((row) => row.unhealthy_services + ' ')}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogTitle>Failed Instances</DialogTitle>
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
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {data.map((row) => row.stopped_instances + ' ')}
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

// Notifications card component
export function NotificationsCard() {
  const [data, setData] = React.useState('');

  const getNotificationsData = async () => {
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
    getNotificationsData();
  }, []);

  // Notifications updated every 1000 seconds
  setInterval(getNotificationsData, 1000000);

  // notifications data split based on comma
  const notifyData = data.split(',');

  return (
    <Card sx={{ width: 500, boxShadow: 3, m: 1 }}>
      <CardContent>
        <Stack direction="row">
          <Typography gutterBottom variant="h5" component="div">
            <IconButton>
              <Badge
                badgeContent={notifyData.length}
                color="primary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <NotificationsActiveIcon sx={{ color: 'black' }} />
              </Badge>
            </IconButton>
            Important Notifications
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary">
          <List>
            {notifyData.map((item, index) => {
              return (
                <ListItem sx={{ paddingTop: '2px' }}>
                  <ListItemText>{item}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Typography>
      </CardContent>
    </Card>
  );
}

// Health Card Component
// has to be connected to the internal monitoring system
// not yet hadled
export function HealthCard() {
  return (
    <Card sx={{ width: 680, boxShadow: 3, m: 1 }}>
      <CardContent>
        <Stack direction="row">
          <Typography gutterBottom variant="h5" component="div">
            <IconButton>
              <HealthAndSafetyIcon sx={{ color: 'black' }} />
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

//  Home component
export const Home = () => {
  //  handles audit log dialog
  const [openlogs, setOpenLogs] = React.useState(false);
  const handleClickOpenLogs = () => {
    setOpenLogs(true);
    getAuditLogData();
  };

  const handleCloseLogs = () => {
    setOpenLogs(false);
  };

  const handleRefreshLogs = () => {
    setAuditLogdata('');
    getAuditLogData();
  };

  // get request for audit log
  const request_url = url_backend + '/api/auditlogs/';

  const getAuditLogData = async () => {
    try {
      const data = await axios.get<Record<string, unknown>>(request_url);

      setAuditLogdata(JSON.parse(JSON.stringify(data.data)));
    } catch (e) {
      console.log(e);
    }
  };
  const [auditlogdata, setAuditLogdata] = React.useState('');

  return (
    // Used Box for all cards
    // Stack to arrange cards horizontally
    // Vertical Stack to arrange cards on top of eachother
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

        <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={(event) => handleClickOpenLogs()}
          >
            <BookIcon></BookIcon>View Logs
          </Button>
        </Stack>
      </Stack>
      {/* Audit Logs Dialog */}
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
                {auditlogdata ? (
                  auditlogdata
                ) : (
                  <ThreeDots color={'red'} height={80} width={80} />
                )}
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
  );
};
