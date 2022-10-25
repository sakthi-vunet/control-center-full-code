import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";
import * as React from 'react';


export const SetupWizard=()=> {
  return (
      <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, marginLeft: {  sm: `200px`, md: `200px`}}}>
      <Toolbar />
     <h1>Setup Wizard</h1>
      </Box> 
   
   
  );
};
  

// export const SetupWizard=()=>{
//   const [data,setData]=React.useState([]);
//   const getData=()=>{
//     fetch('/home/sakthi/vunet/apps/control-center/src/pages /data.json'
//     ,{
//       headers : { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//        }
//     }
//     )
//       .then(function(response){
//         console.log(response)
//         return response.json();
//       })
//       .then(function(myJson) {
//         console.log(myJson);
//         setData(myJson)
//       });
//   }
//   React.useEffect(()=>{
//     getData()
//   },[]);
//   console.log(data);
//   return(
//     <h6>Set up</h6>
//   )
// }