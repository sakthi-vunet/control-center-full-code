import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';
import { useLocation } from 'react-router-dom';

import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

import url_backend from '../configs/url';
import { HostsData } from '../models/HostData';
import { EditHosts } from './HostsEdit';

// Loading indicator for host data
export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress ? (
    // <h1>Hey some async call in progress ! </h1>
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

// id props to get host data with given id
export type HostsInfoprops = {
  id?: string;
};

export const HostsEditLanding = (props: HostsInfoprops) => {
  // get Host data of the given host id obtained via location.state
  const [data, setData] = React.useState<HostsData[]>([]);
  const location = useLocation();
  const idhere = location.state as HostsInfoprops;

  const getHostData = async () => {
    let url = url_backend + '/api/hosts/?name=';
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<HostsData[]>(url);

      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    trackPromise(getHostData());
  }, []);

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
        <Toolbar />

        <EditHosts data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
