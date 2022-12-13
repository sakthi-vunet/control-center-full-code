import * as React from 'react';
import { RotatingLines } from 'react-loader-spinner';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
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

// for accordions style
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

// for accordion summary style
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

// for accordion details style
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const ServicesView: React.FC<{ data: ServiceData[] }> = ({ data }) => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // get host data to map current allocation of the particular service
  // on differenyt hosts
  const [hostsdata, sethostsData] = React.useState<HostsData[]>([]);
  const request_url = url_backend + '/api/hosts/';
  const getHostsData = async () => {
    try {
      const data = await axios.get<HostsData[]>(request_url);

      sethostsData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getHostsData();
  }, []);

  // function to map between host name and the number of instances of the
  //  service running on the host
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
            Service {'>>'} {row.name}
            {/* Icon to indicate whether service is enabled or diabled */}
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
            {/* Service type display */}
          </Typography>
          <span style={{ marginLeft: '.5rem' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
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
          </Box>
          <span style={{ marginLeft: '.5rem' }} />

          {/* Basic Information */}
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

          {/* Instances and Host Mapping */}
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
              <Box sx={{ display: 'flex' }}>
                {/* No. of instances of service running on swarm */}
                <Box
                  sx={{
                    display: 'inline-block',
                    float: 'left',
                    width: '100px',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Instances</TableCell>
                        <TableCell align="right">
                          {row.actual_instances}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </Box>

                {/* Instances of services on each host */}
                <Box sx={{ display: 'inline-block', marginInline: '250px' }}>
                  <Typography>Current Allocation</Typography>
                  {
                    <Box sx={{ width: '300px' }}>
                      <Table>
                        <TableBody>
                          {hostsdata ? (
                            hostsdata.map((tuple, index) =>
                              // only hosts that has at least 1 instance of the service running is displayed
                              returnInstance(tuple, row.name) > 0 ? (
                                <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {tuple.name}
                                  </TableCell>
                                  <TableCell>
                                    {returnInstance(tuple, row.name)}
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <></>
                              )
                            )
                          ) : (
                            // Loading indicator for current allocation
                            <RotatingLines strokeColor="blue" />
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  }
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Labels associated with the service from db */}
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
              <Box sx={{ width: '300px' }}>
                <Table>
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
              </Box>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
};
