import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";

export const UpgradeWizard=()=> {
  return (
      <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, marginLeft: {  sm: `200px`, md: `200px`}}}>
      <Toolbar />
     <h1>Upgrade Wizard</h1>
      </Box>
    

  );
};

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
// import { green } from '@mui/material/colors';
// import Button from '@mui/material/Button';


// export default function CircularIntegration() {
//   const [loading, setLoading] = React.useState(false);
//   const [success, setSuccess] = React.useState(false);
//   const timer = React.useRef<number>();

//   const buttonSx = {
//     ...(success && {
//       bgcolor: green[500],
//       '&:hover': {
//         bgcolor: green[700],
//       },
//     }),
//   };

//   React.useEffect(() => {
//     return () => {
//       clearTimeout(timer.current);
//     };
//   }, []);

//   const handleButtonClick = () => {
//     if (!loading) {
//       setSuccess(false);
//       setLoading(true);
//       timer.current = window.setTimeout(() => {
//         setSuccess(true);
//         setLoading(false);
//       }, 2000);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
     
//       <Box sx={{ m: 1, position: 'relative' }}>
//         <Button
//           variant="contained"
//           sx={buttonSx}
//           disabled={loading}
//           onClick={handleButtonClick}
//         >
//           Accept terms
//         </Button>
//         {loading && (
//           <CircularProgress
//             size={24}
//             sx={{
//               color: green[500],
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               marginTop: '-12px',
//               marginLeft: '-12px',
//             }}
//           />
//         )}
//       </Box>
//     </Box>
//   );
// }


// export const UpgradeWizard=()=> {
//   return (
//     <Box  sx={{ flexGrow: 1, p: 3, marginLeft: {  sm: `200px`, md: `200px`}}}>
     
//       <CircularIntegration/>
//     </Box>
//   );
// }
