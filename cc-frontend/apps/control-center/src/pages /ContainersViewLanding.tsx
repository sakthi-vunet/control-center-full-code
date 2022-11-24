import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { ContainerData } from './ContainerInstancesNew';
import { ContainersView } from './ContainersView';
import url_backend from '../configs/url';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

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

export type ContainerInfoprops = {
  id?: string;
};

export const ContainersInfoLanding = (props: ContainerInfoprops) => {
  const [data, setData] = React.useState<ContainerData[]>([]);
  const location = useLocation();
  const idhere = location.state as ContainerInfoprops;

  const getProductData = async () => {
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
    trackPromise(getProductData());
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
