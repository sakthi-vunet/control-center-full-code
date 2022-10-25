import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';

import { ServiceData } from './ServicesTable';
import { ServicesTableActions } from './ServicesTable';
import axios from 'axios';
import * as React from 'react';
import url_backend from '../configs/url';

export const Services = () => {
  const [data, setData] = React.useState<ServiceData[]>([]);
  const request_url=url_backend+'/api/services/';
  const getProductData = async () => {
    try {
      const data = await axios.get<ServiceData[]>(
        request_url
      );

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

      <ServicesTableActions data={data} />
    </Box>
  );
};
