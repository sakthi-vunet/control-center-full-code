import * as React from 'react';
import { RotatingLines } from 'react-loader-spinner';

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import url_backend from '../configs/url';
import { HostsData } from '../models/HostData';
import { ServiceData } from '../models/ServiceData';

// makes the migrate service from a speacific host request
async function handleHostMigrate(hostobj) {
  const request_url = url_backend + '/api/hostmigrate/';
  try {
    const response = await axios({
      method: 'put',
      url: request_url,
      data: JSON.stringify(hostobj),
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert(response.data);
  } catch (error) {
    console.log(error);
    alert('error while making request');
  }
}

// checks whether any other host is able to handle the migration of the service
async function checkHostMigrate(hostobj) {
  const request_url = url_backend + '/api/hostmigrate/';
  let result = false;
  try {
    const response = await axios({
      method: 'post',
      url: request_url,
      data: JSON.stringify(hostobj),
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    result = response.data;
  } catch (error) {
    console.log(error);
  }
  return result;
}

// style for accordion head
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

// style for accordion summary
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
// style for accordion details
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const ServicesEdit: React.FC<{ data: ServiceData[] }> = ({ data }) => {
  // accordions expanded one at a time
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  // instances that have to scaled parameter
  const [scaledinstances, setScaledInstances] = React.useState(0);
  // returns the actual instances value
  const get_instances = () => {
    setScaledInstances(
      data.map((obj) => {
        return obj.actual_instances;
      })[0]
    );
  };
  React.useEffect(() => {
    get_instances();
  }, [data]);

  // host data for current allocation of instances on each host
  const [hostsdata, sethostsData] = React.useState<HostsData[]>([]);

  const request_url = url_backend + '/api/hosts/';

  // gets hostdata
  const getHostData = async () => {
    try {
      const data = await axios.get<HostsData[]>(request_url);

      sethostsData(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    getHostData();
  }, []);

  // accordion panel expansion handler
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // handles scale up value
  const handleScaleUp = (event: React.MouseEvent<unknown>, type: string) => {
    console.log('scale up ' + type);
    setScaledInstances(scaledinstances + 1);
  };
  // hanles scale down value
  const handleScaleDown = (event: React.MouseEvent<unknown>, type: string) => {
    console.log('scale down ' + type);
    if (scaledinstances === 0) alert('minimum instances limit reached');
    else setScaledInstances(scaledinstances - 1);
  };
  // scaling reset function
  const handleDiscard = (event: React.MouseEvent<unknown>) => {
    get_instances();
  };
  // function to implement the scaling value given
  const handleSave = async (
    event: React.MouseEvent<unknown>,
    type: string,
    serviceName: string
  ) => {
    console.log(scaledinstances);
    const scalingRequest = { scale: '', instances: 0 };
    const request_url = url_backend + '/api/services/';

    const x = data.map((obj) => {
      return obj.actual_instances;
    })[0];
    const temp = scaledinstances - x;

    if (temp > 0) {
      if (type === 'Free Scale') {
        alert('no limitations. ' + temp + ' instances will be added');
      } else if (type === 'Standalone') {
        const number_of_hosts = hostsdata.length;
        if (scaledinstances <= number_of_hosts) {
          alert('only 1 instance per node.' + temp + 'instances will be added');
        } else {
          alert(
            'max limit:' +
              number_of_hosts +
              ' current scale up value not possible'
          );
        }
      } else if (type === 'Stateful') {
        const labelHosts = checkLabel(serviceName);
        if (scaledinstances <= labelHosts) {
          alert('only 1 instance per node.' + temp + 'instances will be added');
        } else {
          alert(
            'max limit:' + labelHosts + ' current scale up value not possible'
          );
        }
      } else {
        // Restricted Scale
        const labelHosts = checkLabel(serviceName);
        if (scaledinstances <= labelHosts) {
          alert('only 1 instance per node.' + temp + 'instances will be added');
        } else {
          alert(
            'max limit:' + labelHosts + ' current scale up value not possible'
          );
        }
      }
      scalingRequest['scale'] = 'up';
      scalingRequest['instances'] = temp;
    } else if (temp === 0) {
      alert('No scale up or scale down');
    } else {
      const scaledown = Math.abs(temp);
      alert(' Scale down ' + scaledown + ' instances');
      scalingRequest['scale'] = 'down';
      scalingRequest['instances'] = scaledown;
    }
    if (scalingRequest['scale'] !== '') {
      console.log(scalingRequest);

      try {
        const response = await axios({
          method: 'post',
          url: request_url,
          data: JSON.stringify(scalingRequest),
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // checks which host has given service label
  const checkLabel = (serviceName) => {
    let temp = 0;
    hostsdata.map((row, index) =>
      row.labels.forEach(function (value) {
        if (value === serviceName) {
          temp += 1;
        }
      })
    );
    return temp;
  };

  // returns number of instances of service running on each host
  const returnInstance = (temp: HostsData, serviceName: string) => {
    let currentInstance = 0;
    temp.services.forEach(({ Name, Instances }) => {
      if (Name === serviceName) {
        console.log(Name, Instances);
        currentInstance = Instances;
      }
    });
    return currentInstance;
  };

  // service migrateion from one host
  const [migrate, setMigrate] = React.useState(false);

  //  checks if the service migration can be enabled or not
  function returnMigrateCheck(hostname: string, serviceName: string) {
    const migrateobj = {
      host: hostname,
      service: serviceName,
    };
    // resolves Promise boolean value
    checkMig(migrateobj).then(function (data) {
      setMigrate(data);
    });
    return migrate;
  }

  // function return the Promise boolean var of migration enable
  async function checkMig(migrateobj) {
    const getvalue = await checkHostMigrate(migrateobj);
    console.log(getvalue, 'check');
    return getvalue;
  }

  // handles host migration
  async function makeMigrations(hostname: string, serviceName: string) {
    const migrateobj = {
      host: hostname,
      service: serviceName,
    };
    handleHostMigrate(migrateobj);
  }

  return (
    <>
      {data.map((row, index) => (
        <div>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {/* service name */}
            Service {'>>'} {row.name}
            {/* Service icon is green for enabled and grey for disabled */}
            {row.state === 'enabled' ? (
              <Tooltip title="enabled">
                <IconButton>
                  <HealthAndSafetyIcon color="success" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="disabled">
                <IconButton>
                  <HealthAndSafetyIcon color="disabled" />
                </IconButton>
              </Tooltip>
            )}
          </Typography>

          <span style={{ marginLeft: '.5rem' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* service type */}
            <Typography>Service Type</Typography>
            <span style={{ marginLeft: '.5rem' }} />
            <Paper variant="outlined" elevation={8}>
              <Typography
                variant="subtitle1"
                sx={{
                  paddingTop: '.3rem',
                  paddingBottom: '.3rem',
                  paddingRight: '0.8rem',
                  paddingLeft: '.8rem',
                }}
              >
                {row.type}
              </Typography>
            </Paper>
          </div>
          <span style={{ marginLeft: '.5rem' }} />

          {/* Basic Information accordion */}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{row.description}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Instances and Host mapping */}
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography>Instances and Host Mapping</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'inline-block', float: 'left' }}>
                  <Table style={{ width: '200px', border: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Instances</TableCell>
                        <TableCell>
                          <Tooltip title="Scale Up">
                            {/* increase scale up value */}
                            <IconButton
                              onClick={(event) =>
                                handleScaleUp(event, row.type)
                              }
                            >
                              <AddCircleOutlineRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{scaledinstances}</TableCell>
                        <TableCell>
                          <Tooltip title="Scale Down">
                            {/* for scale down */}
                            <IconButton
                              onClick={(event) =>
                                handleScaleDown(event, row.type)
                              }
                            >
                              <RemoveCircleOutlineOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <Stack spacing={2} direction="row" margin="75px">
                    {/* saves the scled value mentioned */}
                    <Button
                      variant="contained"
                      onClick={(event) => handleSave(event, row.type, row.name)}
                    >
                      Save
                    </Button>
                    {/* resets the scaling component to original value */}
                    <Button
                      variant="contained"
                      onClick={(event) => handleDiscard(event)}
                    >
                      Discard
                    </Button>
                  </Stack>
                </div>
                {/* Current allocation table */}
                <div style={{ display: 'inline-block', marginInline: '250px' }}>
                  <Typography>Current Allocation</Typography>
                  {
                    <Table style={{ width: '300px' }}>
                      <TableBody>
                        {hostsdata ? (
                          hostsdata.map((tuple, index) =>
                            returnInstance(tuple, row.name) > 0 ? (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {tuple.name}
                                </TableCell>
                                <TableCell>
                                  {returnInstance(tuple, row.name)}
                                </TableCell>
                                <TableCell>
                                  {/* Migration button enabled only for certain hosts */}
                                  <Button
                                    variant="contained"
                                    onClick={(event) =>
                                      makeMigrations(tuple.name, row.name)
                                    }
                                    disabled={
                                      !returnMigrateCheck(tuple.name, row.name)
                                    }
                                  >
                                    Migrate
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <></>
                            )
                          )
                        ) : (
                          <RotatingLines strokeColor="blue" />
                        )}
                      </TableBody>
                    </Table>
                  }
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          {/* Service label information */}
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <Typography>Labels</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table style={{ width: '300px' }}>
                <TableBody>
                  {row.labels.map((row) => (
                    <TableRow key={row}>
                      <TableCell component="th" scope="row">
                        {row}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
};
