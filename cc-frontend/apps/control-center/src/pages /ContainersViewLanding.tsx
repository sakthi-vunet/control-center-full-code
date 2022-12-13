import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';
import { useLocation } from 'react-router-dom';

import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

import url_backend from '../configs/url';
import { ContainerData } from '../models/ContainerData';
import { ContainersView } from './ContainersView';

// Loading indicator for container data
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

//  id to get container data of specific container
export type ContainerInfoprops = {
  id?: string;
};

export const ContainersInfoLanding = (props: ContainerInfoprops) => {
  // container data
  const [data, setData] = React.useState<ContainerData[]>([]);
  const location = useLocation();
  const idhere = location.state as ContainerInfoprops;

  const getContainerData = async () => {
    let url = url_backend + '/api/containers/?_id=';
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<ContainerData[]>(url);

      setData(data.data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    trackPromise(getContainerData());
  }, []);

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0.05, display: 'flex' }}>
        <Toolbar />
        <ContainersView data={data} />
      </Box>
      <LoadingIndicator />
    </>
  );
};
