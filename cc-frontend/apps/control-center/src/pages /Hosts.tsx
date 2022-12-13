import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';

import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

import url_backend from '../configs/url';
import { HostsData } from '../models/HostData';
import { HostsTable } from './HostsTable';

// Loading indicator for host data
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

export const Hosts = () => {
  // get hosts data
  const [data, setData] = React.useState<HostsData[]>([]);
  const request_url = url_backend + '/api/hosts/';

  const getProductData = async () => {
    try {
      const data = await axios.get<HostsData[]>(request_url);

      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    trackPromise(getProductData());
  }, []);

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
        <Toolbar />

        <HostsTable data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
