import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { ServicesView } from './ServicesViewnew';
import { useLocation } from 'react-router-dom';
import { ServiceData } from './ServicesTable';
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

type ServicesInfoprops = {
  id?: string;
};

export const ServicesInfoLanding = (props: ServicesInfoprops) => {
  const [data, setData] = React.useState<ServiceData[]>([]);
  const location = useLocation();
  const idhere = location.state as ServicesInfoprops;

  const getProductData = async () => {
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

  React.useEffect(() => {
    trackPromise(getProductData());
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
