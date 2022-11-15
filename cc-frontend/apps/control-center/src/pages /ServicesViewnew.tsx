import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ServiceData } from './ServicesTable';
import { HostsData } from './HostsTable';
import axios from 'axios';

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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const ControlledAccordions: React.FC<{ data: ServiceData[] }> = ({
  data,
}) => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const [hostsdata, sethostsData] = React.useState<HostsData[]>([]);
  const request_url = '/api/hosts/';
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
          </Typography>

          <span style={{ marginLeft: '.5rem' }} />
          <div
            style={{
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
          </div>
          <span style={{ marginLeft: '.5rem' }} />
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
                        <TableCell align="right">
                          {row.actual_instances}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <span style={{ marginLeft: '.5rem' }} />
                  <Typography>Hosts</Typography>
                  <Table style={{ width: '200px' }}>
                    <TableBody>
                      {row.hosts.map((row) => (
                        <TableRow key={row}>
                          <TableCell component="th" scope="row">
                            {row}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ display: 'inline-block', marginInline: '250px' }}>
                  <Typography>Current Allocation</Typography>
                  {
                    <Table style={{ width: '300px' }}>
                      <TableBody>
                        {hostsdata.map((tuple, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {tuple.name}
                            </TableCell>
                            <TableCell>
                              {returnInstance(tuple, row.name)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  }
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <Typography>Health</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{row.state}</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
};
