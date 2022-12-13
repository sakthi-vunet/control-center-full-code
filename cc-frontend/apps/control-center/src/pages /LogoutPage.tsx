import { useNavigate } from 'react-router-dom';

import { Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';

// Logout Page
export const LogOutPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/app/controlcenter/Login');
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, marginLeft: { sm: `200px`, md: `200px` } }}
    >
      <Toolbar />
      <h1>You are Logged Out!!</h1>
      <Button onClick={(event) => handleLogin()}>Login</Button>
    </Box>
  );
};
