import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';

// Page to be used for monitor component
export const Monitor = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, marginLeft: { sm: `200px`, md: `200px` } }}
    >
      <Toolbar />
      <h1>Monitor</h1>
    </Box>
  );
};
