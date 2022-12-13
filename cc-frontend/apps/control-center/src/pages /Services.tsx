import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';

import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

import url_backend from '../configs/url';
import { ServiceData } from '../models/ServiceData';
import { ServicesTableActions } from './ServicesTable';

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

export const Services = () => {
  // get all service data
  const [data, setData] = React.useState<ServiceData[]>([]);
  const request_url = url_backend + '/api/services/';
  const getServiceData = async () => {
    try {
      const data = await axios.get<ServiceData[]>(request_url);

      setData(data.data);
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

        <ServicesTableActions data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
