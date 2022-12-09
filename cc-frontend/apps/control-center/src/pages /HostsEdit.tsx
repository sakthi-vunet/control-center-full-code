import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { FormInputMultiCheckbox } from '../form-components/FormMultiCheckbox';
import {useForm } from "react-hook-form";
import axios from 'axios';
import url_backend from '../configs/url';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Tooltip from '@mui/material/Tooltip';
import {IconButton} from '@mui/material';
import { HostsData } from '../models/HostData';

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

export interface IFormInput{
    labels:string[]
}



export const EditHosts: React.FC<{data:HostsData[]}>=({data})=> {

   
    const defaultValues={labels:[]};
    const methods = useForm<IFormInput>({ defaultValues: defaultValues });
    const { handleSubmit, control, setValue} = methods;
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [isShown, setIsShown] = React.useState(false);
  
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  
  const handleHostConnect=()=>{
    console.log(" connect to host");
  }

  const handleLabelsEdit=()=>{
    console.log("edit labels");
    setIsShown(true);

  }
 
  const onSubmit = async (editdata: IFormInput) =>{
 
    data[0].labels=editdata.labels;
    const temp=JSON.stringify(data[0]);
    console.log(temp);
    setIsShown(false);
    const request_url=url_backend+'/api/hosts/';
    try {
        // make axios put request
        const response = await axios({
          method: "put",
          url: request_url,
          data:temp,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
      
      } catch(error) {
      
        console.log(error);
      }
}


  return <>{
   
    data.map((row,index)=><div>
    <Typography
    sx={{ flex: '1 1 100%' }}
    variant="h6"
    id="tableTitle"
    component="div"
  >
   Hosts {'>>'} {row.name}
   {row.health_status === 'Healthy' ? (
              <Tooltip title="Healthy">
                <IconButton>
                  <HealthAndSafetyIcon color="success" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Not Healthy">
                <IconButton>
                  <HealthAndSafetyIcon color="disabled" />
                </IconButton>
              </Tooltip>
            )}
  </Typography>

<span style={{marginLeft:'.5rem'}}/>

     
    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>Basic Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <Paper>
     
    <Table >
      <TableHead>
        <TableRow>
          <TableCell>OS</TableCell>
          <TableCell align="right">{row.OS}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>Processors</TableCell>
          <TableCell align="right">{row.processor_type}</TableCell>
          </TableRow>
         
          <TableRow>
          <TableCell>Memory</TableCell>
          <TableCell align="right">{row.memory}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>Storage</TableCell>
          <TableCell align="right">{row.total_storage}</TableCell>
        
        </TableRow>
      </TableHead>
     </Table>
  </Paper>
       
      </AccordionDetails>
    </Accordion>
    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
      <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
        <Typography>Services</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Services assigned</TableCell>
          <TableCell align="right"># of instances running</TableCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
        {row.services.map(row => (
          <TableRow key={row.Name}>
            <TableCell component="th" scope="row">
              {row.Name}
            </TableCell>
            <TableCell align="right">{row.Instances}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </Paper>
        
      </AccordionDetails>
    </Accordion>
    
    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
      <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
        <Typography>Labels</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <Box
        component="span"
        m={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center" 
        
      >
        <Box>
        <Typography >
            {/* {row.labels} */}
        {row.labels.map(row => (
          <TableRow key={row}>
            <TableCell component="th" scope="row">
              {row}
            </TableCell>
            </TableRow>
        ))}
        {/* Expanding this table will show the server health dashboard for the host. */}
        </Typography>
        </Box>
        <Box sx={{m:1,p:1}}>
        {isShown && (
          <FormInputMultiCheckbox
          control={control}
          setValue={setValue}
          name={"labels"}
          label={"Labels"}
          list={row.labels}
        />
      )}
      
        {isShown?<Button variant="contained" onClick={handleSubmit(onSubmit)} size="small">Save</Button>:<Button variant="contained" onClick={handleLabelsEdit} size="small">Edit</Button>}
        </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
    
   
   
    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
      <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
        <Typography>Connect</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
         Expanding this provides a button to initiate SSH Connection to the host through the browser
        </Typography>
        <Button variant="contained" onClick={handleHostConnect}>Connect to Host</Button>
      </AccordionDetails>
    </Accordion>
  
  </div>
  
  )
    
        }</>
}
