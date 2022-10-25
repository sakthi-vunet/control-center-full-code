import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { ControlledAccordions } from './ServicesView';
import { useLocation } from 'react-router-dom';
import { ServiceData } from './ServicesTable';
import { ServicesEdit } from './ServicesEditnew';

type ServicesInfoprops = {
  id?: string;
};
export const ServicesEditLanding = (props: ServicesInfoprops) => {
  const [data, setData] = React.useState<ServiceData[]>([]);
  const location = useLocation();
  const idhere = location.state as ServicesInfoprops;

  const getProductData = async () => {
    let url = '/api/services/?_id=';
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<ServiceData[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
      {/* marginLeft: { sm: `200px`, md: `200px` } }}> */}
      <Toolbar />

      <ServicesEdit data={data} />
    </Box>
  );
};
