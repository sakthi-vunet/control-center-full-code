import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { ControlledAccordions } from './ServicesViewnew';
import { useLocation } from 'react-router-dom';
import { ServiceData } from './ServicesTable';
import url_backend from '../configs/url';

type ServicesInfoprops = {
  id?: string;
};

export const ServicesInfoLanding = (props: ServicesInfoprops) => {
  const [data, setData] = React.useState<ServiceData[]>([]);
  const location = useLocation();
  const idhere = location.state as ServicesInfoprops;

  const getProductData = async () => {
    // let url ='https://my-json-server.typicode.com/sakthi-vunet/dummyservicesnew/list?_id=';
    let url=url_backend+'/api/services/?_id='
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<ServiceData[]>(url,{timeout:9000});

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  console.log('After use effect' + data);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3,display:'flex'}}>
         {/* marginLeft: { sm: `200px`, md: `200px` } }}> */}
      <Toolbar />

      <ControlledAccordions data={data} />
    </Box>
  );
};
