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
