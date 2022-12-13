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
import { ControlledAccordions } from './HostsView';

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

// props to get host data of specific id
export type HostsInfoprops = {
  id?: string;
};

export const HostsInfoLanding = (props: HostsInfoprops) => {
  // get host data of specific id obtained using location.state
  const [data, setData] = React.useState<HostsData[]>([]);
  const location = useLocation();
  const idhere = location.state as HostsInfoprops;

  const request_url = url_backend + '/api/hosts/?name=';

  const getHostData = async () => {
    let url = request_url;
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

        <ControlledAccordions data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
