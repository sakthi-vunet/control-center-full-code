import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { HostsTable } from './HostsTable';
import { HostsData } from './HostsTable';

export const Hosts = () => {
  const [data, setData] = React.useState<HostsData[]>([]);
  const request_url = '/api/hosts/';

  const getProductData = async () => {
    try {
      const data = await axios.get<HostsData[]>(request_url);

      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
      {/* marginLeft: {  sm: `200px`, md: `200px`}}}> */}
      <Toolbar />
      <HostsTable data={data} />
    </Box>
  );
};
