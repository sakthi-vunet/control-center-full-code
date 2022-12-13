import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';
import { useLocation } from 'react-router-dom';

import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

import url_backend from '../configs/url';
import { ServiceData } from '../models/ServiceData';
import { ServicesEdit } from './ServicesEditnew';

// Loading indicator for service data
export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress ? (
    <div
      style={{
        width: '100%',
        height: '100',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThreeDots color={'blue'} height={150} width={150} />
    </div>
  ) : (
    <></>
  );
};

// service id prop to get service data for specific id
type ServicesInfoprops = {
  id?: string;
};

export const ServicesEditLanding = (props: ServicesInfoprops) => {
  // get service data of specific id
  const [data, setData] = React.useState<ServiceData[]>([]);
  const location = useLocation();

  // get id props using location.state
  const idhere = location.state as ServicesInfoprops;

  const getServiceData = async () => {
    let url = url_backend + '/api/services/?_id=';
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
    trackPromise(getServiceData());
  }, []);

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
        <Toolbar />

        <ServicesEdit data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
