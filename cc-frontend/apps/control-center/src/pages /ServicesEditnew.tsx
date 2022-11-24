import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ServiceData } from './ServicesTable';
import { HostsData } from './HostsTable';
import axios from 'axios';
import url_backend from '../configs/url';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';



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

export const ServicesEdit: React.FC<{ data: ServiceData[] }> = ({ data }) => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const [scaledinstances, setScaledInstances] = React.useState(0);
  const get_instances = () => {
    setScaledInstances(
      data.map((obj) => {
        return obj.actual_instances;
      })[0]
    );
  };

  const [hostsdata, sethostsData] = React.useState<HostsData[]>([]);
  // const [increment,setIncremet]=React.useState(false);

  React.useEffect(() => {
    get_instances();
  }, [data]);

  const request_url=url_backend+'/api/hosts/';

  const getProductData = async () => {
    try {
      const data = await axios.get<HostsData[]>(
        request_url
      );

      sethostsData(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    getProductData();
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleHostDelete = (event: React.MouseEvent<unknown>, name: string) => {
    console.log('delete host' + name);
  };

  const handleHostAdd = (event: React.MouseEvent<unknown>) => {
    console.log('add host');
  };

  const handleScaleUp = (event: React.MouseEvent<unknown>, type: string) => {
    console.log('scale up ' + type);
    setScaledInstances(scaledinstances + 1);

    // if (type === 'Free Scale') {
    //   alert('no limit. increase intsance');
    // } else if (type === 'Standalone') {
    //   alert('only one instance. Increase not possible');
    // } else if (type === 'Restricted Scale') {
    //   alert('only 1 instance per port per node. implement port checking');
    // } else if (type === 'Stateful') {
    //   alert('only 1 instance per host');
    // } else {
    //   alert('type information not applicable');
    // }
  };

  const handleScaleDown = (event: React.MouseEvent<unknown>, type: string) => {
    console.log('scale down ' + type);
    if (scaledinstances === 0) alert('minimum instances limit reached');
    else setScaledInstances(scaledinstances - 1);
  };

  const handleDiscard =(event: React.MouseEvent<unknown>)=>{
   get_instances();
  }
  const handleSave = async(
    event: React.MouseEvent<unknown>,
    type: string,
    serviceName: string
  ) => {
    console.log(scaledinstances);
    const scalingRequest ={ scale: '', instances: 0 };
    const request_url=url_backend+'/api/services/';

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
      } else { // Restricted Scale
        const labelHosts = checkLabel(serviceName);
        if (scaledinstances <= labelHosts) {
          alert('only 1 instance per node.' + temp + 'instances will be added');
        } else {
          alert(
            'max limit:' + labelHosts + ' current scale up value not possible'
          );
        }
      }
      scalingRequest['scale']="up";
      scalingRequest['instances']=temp;
    }
    else if (temp === 0) {
      alert('No scale up or scale down');
    }
    else {
      const scaledown = Math.abs(temp);
      alert(' Scale down ' + scaledown + ' instances');
      scalingRequest['scale']="down";
      scalingRequest['instances']=scaledown;
    }
    if(scalingRequest['scale']!==""){
    console.log(scalingRequest);
    

    try {

      const response = await axios({
      method: "post",
      url: request_url,
      data: JSON.stringify(scalingRequest),
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
  
  } catch(error) {
  
    console.log(error);
  }}

  };

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
                        <TableCell>
                          <Tooltip title="Scale Up">
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
                  {/* <span style={{ marginLeft: '.5rem' }} />
                  <Typography>Hosts</Typography>
                  <Table style={{ width: '200px' }}>
                    <TableBody>
                      {row.hosts.map((row) => (
                        <TableRow key={row}>
                          <TableCell component="th" scope="row">
                            {row}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={(event) =>
                                  handleHostDelete(event, row)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Tooltip title="Add Host">
                    <IconButton onClick={handleHostAdd}>
                      <AddCircleOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip> */}
                   <Stack spacing={2} direction="row" margin="75px">
                    <Button
                      variant="contained"
                      onClick={(event) => handleSave(event, row.type, row.name)}
                    >
                      Save
                    </Button>
                    <Button variant="contained"
                    onClick={(event) => handleDiscard(event)}>Discard</Button>
                  </Stack>
                </div>
                <div style={{ display: 'inline-block', marginInline: '250px' }}>
                  <Typography>Current Allocation</Typography>
                  {
                    <Table style={{ width: '300px' }}>
                      <TableBody>
                      {hostsdata.map((tuple, index) => (
                          (returnInstance(tuple, row.name)>0?
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {tuple.name}
                            </TableCell>
                            <TableCell>
                              {returnInstance(tuple, row.name)}
                            </TableCell>
                          </TableRow>:<></>)
                        ))}
                      </TableBody>
                    </Table>
                  }
              
             
                 
                  </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* <Accordion
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
          </Accordion> */}

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
