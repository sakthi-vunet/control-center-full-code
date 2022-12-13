import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AuthContext } from '../context/AuthContext';

// login page
export const LoginPage = () => {
  // lods login function from context
  const loginUser = useContext(AuthContext);

  // handles login form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const username1 = e.target.username.value;
    const password1 = e.target.password.value;

    console.log(username1 + password1);
    if (username1.length > 0) loginUser.loginUser(username1, password1);
    else alert('enter username and password');
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
      <Stack spacing={2}>
        <Paper
          style={{
            display: 'grid',
            gridRowGap: '20px',
            padding: '20px',
            margin: '10px 300px',
          }}
          elevation={3}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack spacing={2}>
                <Typography variant="h6">Login</Typography>

                <TextField
                  label="Enter Username"
                  id="username"
                  type="text"
                  variant="outlined"
                />

                <TextField
                  type="password"
                  id="password"
                  label="Enter Password"
                />
              </Stack>

              <Button type="submit" variant="contained">
                Login
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* On click text links to the register page */}
        <Link
          to="/app/controlcenter/Register"
          style={{ textDecoration: 'none', color: 'blue' }}
        >
          <div
            style={{
              display: 'grid',
              gridRowGap: '20px',
              padding: '20px',
              margin: '10px 300px',
            }}
          >
            Click here to Register
          </div>
        </Link>
      </Stack>
    </Box>
  );
};
