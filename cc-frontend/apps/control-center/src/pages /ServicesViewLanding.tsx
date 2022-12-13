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
import { ServicesView } from './ServicesViewnew';

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

// service props id to get service data of the mentioned id
type ServicesInfoprops = {
  id?: string;
};

export const ServicesInfoLanding = (props: ServicesInfoprops) => {
  const [data, setData] = React.useState<ServiceData[]>([]);

  // service id passes via location state
  const location = useLocation();
  const idhere = location.state as ServicesInfoprops;

  // gets service data of specific id axios request
  const getServiceData = async () => {
    let url = url_backend + '/api/services/?_id=';
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<ServiceData[]>(url, { timeout: 9000 });
      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // set service data state
  // trackPromise for loading indicator
  React.useEffect(() => {
    trackPromise(getServiceData());
  }, []);

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
        <Toolbar />
        <ServicesView data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
