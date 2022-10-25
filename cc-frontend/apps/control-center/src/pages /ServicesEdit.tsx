// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
// import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
// import MuiAccordionSummary, {
//   AccordionSummaryProps,
// } from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import DeleteIcon from '@mui/icons-material/Delete';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
// import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import { ServiceData } from './ServicesTable';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogTitle from '@mui/material/DialogTitle';
// import { HostsData } from './HostsTable';
// import axios from 'axios';
// // import { FormInputRadio } from '../form-components/FormInputRadio';
// import TextField from '@material-ui/core/TextField';
// import { Rowing } from '@material-ui/icons';

// const Accordion = styled((props: AccordionProps) => (
//   <MuiAccordion disableGutters elevation={0} square {...props} />
// ))(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   '&:not(:last-child)': {
//     borderBottom: 0,
//   },
//   '&:before': {
//     display: 'none',
//   },
// }));

// const AccordionSummary = styled((props: AccordionSummaryProps) => (
//   <MuiAccordionSummary
//     expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
//     {...props}
//   />
// ))(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === 'dark'
//       ? 'rgba(255, 255, 255, .05)'
//       : 'rgba(0, 0, 0, .03)',
//   flexDirection: 'row-reverse',
//   '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
//     transform: 'rotate(90deg)',
//   },
//   '& .MuiAccordionSummary-content': {
//     marginLeft: theme.spacing(1),
//   },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: '1px solid rgba(0, 0, 0, .125)',
// }));

// export const ServicesEdit: React.FC<{ data: ServiceData[] }> = ({ data }) => {
//   const [expanded, setExpanded] = React.useState<string | false>('panel1');
//   const [open, setOpen] = React.useState(false);
//   const [scaledinstances,setScaledInstances]=React.useState(data[0].actual_instances);

//   const [hostsdata, sethostsData] = React.useState<HostsData[]>([]);
//   const [servicePresent, setServicePresent] = React.useState(false);

//   const getProductData = async () => {
//     try {
//       const data = await axios.get<HostsData[]>(
//         `http://127.0.0.1:8000/api/hosts/`
//       );

//       sethostsData(data.data);
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   React.useEffect(() => {
//     getProductData();
//   }, []);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChange =
//     (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
//       setExpanded(newExpanded ? panel : false);
//     };

//   const handleHostDelete = (event: React.MouseEvent<unknown>, name: string) => {
//     console.log('delete host' + name);
//   };

//   const handleHostAdd = (event: React.MouseEvent<unknown>) => {
//     console.log('add host');
//   };

//   const handleScaleUp = (event: React.MouseEvent<unknown>, type: string) => {
//     console.log('scale up ' + type);
    
//     // handleClickOpen();

//     if (type === 'Free Scale') {
//       alert('no limit. increase intsance');
//     } else if (type === 'Standalone') {
//       alert('only one instance. Increase not possible');
//     } else if (type === 'Restricted Scale') {
//       alert('only 1 instance per port per node. implement port checking');
//     } else if (type === 'Stateful') {
//       alert('only 1 instance per host');
//     } else {
//       alert('type information not applicable');
//     }
//   };

//   const handleScaleDown = (event: React.MouseEvent<unknown>, type: string) => {
//     console.log('scale down ' + type);
//   };

 
//   const returnInstance = (temp: HostsData, serviceName: string) => {
//     let currentInstance = 0;
//     temp.services.forEach(({ Name, Instances }) => {
//       if (Name === serviceName) {
//         console.log(Name, Instances);
//         currentInstance = Instances;
//       }
//     });
//     return currentInstance;
//   };

//   // const name_of_service=data.map(function (e) {
//   //   return e.name
//   // })
//   // const hostsAllocate = hostsdata.map(function (e) {
//   //   return { name:e.name , instance: returnInstance(e,name_of_service[0]) }
//   // })

//   // const handleChangeInput=(event,hostName)=>{
//   //   console.log(event.target.value);
//   //   hostsAllocate.forEach(({name,instance})=>{
//   //     instance=(name===hostName)?(event.target.value):instance;
//   //     console.log(name,instance);
//   //   })
//   //   console.log(hostsAllocate);
//   // }
  


//   return (
//     <>
//       {data.map((row, index) => (
//         <div>
//           <Typography
//             sx={{ flex: '1 1 100%' }}
//             variant="h6"
//             id="tableTitle"
//             component="div"
//           >
//             Service {'>>'} {row.name}
//           </Typography>

//           <span style={{ marginLeft: '.5rem' }} />
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             <Typography>Service Type</Typography>
//             <span style={{ marginLeft: '.5rem' }} />
//             <Paper variant="outlined" elevation={8}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   paddingTop: '.3rem',
//                   paddingBottom: '.3rem',
//                   paddingRight: '0.8rem',
//                   paddingLeft: '.8rem',
//                 }}
//               >
//                 {row.type}
//               </Typography>
//             </Paper>
//           </div>
//           <span style={{ marginLeft: '.5rem' }} />
//           <Accordion
//             expanded={expanded === 'panel1'}
//             onChange={handleChange('panel1')}
//           >
//             <AccordionSummary
//               aria-controls="panel1d-content"
//               id="panel1d-header"
//             >
//               <Typography>Basic Information</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography>{row.description}</Typography>
//             </AccordionDetails>
//           </Accordion>
//           <Accordion
//             expanded={expanded === 'panel2'}
//             onChange={handleChange('panel2')}
//           >
//             <AccordionSummary
//               aria-controls="panel2d-content"
//               id="panel2d-header"
//             >
//               <Typography>Instances and Host Mapping</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <div style={{ display: 'flex' }}>
//                 <div style={{ display: 'inline-block', float: 'left' }}>
//                   <Table style={{ width: '200px', border: 1 }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Instances</TableCell>
//                         <TableCell>
//                           <Tooltip title="Scale Up">
//                             <IconButton
//                               onClick={(event) =>
//                                 handleScaleUp(event, row.type)
//                               }
//                             >
//                               <AddCircleOutlineRoundedIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                         <TableCell align="right">
//                           {row.actual_instances}
//                         </TableCell>
//                         <TableCell>
//                           <Tooltip title="Scale Down">
//                             <IconButton
//                               onClick={(event) =>
//                                 handleScaleDown(event, row.type)
//                               }
//                             >
//                               <RemoveCircleOutlineOutlinedIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                   </Table>
//                   <span style={{ marginLeft: '.5rem' }} />
//                   <Typography>Hosts</Typography>
//                   <Table style={{ width: '200px' }}>
//                     <TableBody>
//                       {row.hosts.map((row) => (
//                         <TableRow key={row}>
//                           <TableCell component="th" scope="row">
//                             {row}
//                           </TableCell>
//                           <TableCell component="th" scope="row">
//                             <Tooltip title="Delete">
//                               <IconButton
//                                 onClick={(event) =>
//                                   handleHostDelete(event, row)
//                                 }
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                   <Tooltip title="Add Host">
//                     <IconButton onClick={handleHostAdd}>
//                       <AddCircleOutlineRoundedIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </div>
//                 <div style={{ display: 'inline-block', marginInline: '250px' }}>
//                   <Typography>Current Allocation</Typography>
//                   {/* <Table>
//                     <TableBody>
//                       {row.hosts.map((row, index) => (
//                         <TableRow key={row}>
//                           <TableCell component="th" scope="row">
//                             {index}
//                           </TableCell>
//                           <TableCell align="right">{row}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table> */}
//                   {
//                     <Table style={{ width: '300px' }}>
//                       <TableBody>
//                         {hostsdata.map((tuple, index) => (
//                           <TableRow key={index}>
//                             <TableCell component="th" scope="row">
//                               {tuple.name}
//                             </TableCell>
//                             <TableCell>
//                               {returnInstance(tuple, row.name)}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   }

//                   <Stack spacing={2} direction="row" margin="75px">
//                     <Button variant="contained">Save</Button>
//                     <Button variant="contained">Discard</Button>
//                   </Stack>
//                 </div>
//               </div>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion
//             expanded={expanded === 'panel3'}
//             onChange={handleChange('panel3')}
//           >
//             <AccordionSummary
//               aria-controls="panel3d-content"
//               id="panel3d-header"
//             >
//               <Typography>Health</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography>{row.state}</Typography> 
//             </AccordionDetails>
//           </Accordion>

//           <Accordion
//             expanded={expanded === 'panel4'}
//             onChange={handleChange('panel4')}
//           >
//             <AccordionSummary
//               aria-controls="panel4d-content"
//               id="panel4d-header"
//             >
//               <Typography>Labels</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Table style={{ width: '300px' }}>
//                 <TableBody>
//                   {row.labels.map((row) => (
//                     <TableRow key={row}>
//                       <TableCell component="th" scope="row">
//                         {row}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </AccordionDetails>
//           </Accordion>
//           <div>
//             <Dialog open={open} onClose={handleClose}>
//               <DialogTitle>Scale Up / Scale Down</DialogTitle>
//               {
//                 <Table style={{ width: '300px' }}>
//                   <TableBody>
//                     {hostsdata.map((tuple, index) => (
//                       <TableRow key={index}>
//                         <TableCell component="th" scope="row">
//                           {tuple.name}
//                         </TableCell>
//                         <TableCell> 
//             <TextField
//              type="number"
//               name="instance"
//               label=""
//               variant="filled"
//               value={returnInstance(tuple,row.name)}
//               onChange={event => handleChangeInput(event,tuple.name)}
//             /></TableCell>
                        
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               }
              
            

//               <DialogActions>
//                 <Button onClick={handleClose}>Save</Button>
//               </DialogActions>
//             </Dialog>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };
