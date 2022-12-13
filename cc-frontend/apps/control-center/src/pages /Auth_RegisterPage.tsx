import { useState, useContext } from 'react';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
} from '@mui/material';

import { AuthContext } from '../context/AuthContext';

// page to register a user to the application
export const Register = () => {
  // default values for username ad pwd
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const { registerUser } = useContext(AuthContext);

  //  handles regietr form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, password, password2);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
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
          <Stack spacing={2}>
            <Typography variant="h6">Register</Typography>

            <TextField
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              required
            />
            <TextField
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
            />
            <TextField
              id="confirm-password"
              type="password"
              onChange={(e) => setPassword2(e.target.value)}
              label="Confirm Password"
              required
            />
            {/*  check for confirm password */}
            <Typography>
              {password2 !== password ? 'Passwords do not match' : ''}
            </Typography>
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
