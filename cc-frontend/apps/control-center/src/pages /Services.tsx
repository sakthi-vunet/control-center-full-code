import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';

import { ServiceData } from './ServicesTable';
import { ServicesTableActions } from './ServicesTable';
import axios from 'axios';
import * as React from 'react';
import url_backend from '../configs/url';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import {ThreeDots} from 'react-loader-spinner';


export const LoadingIndicator = () => {

  const { promiseInProgress } = usePromiseTracker();
  
 return (
  
  promiseInProgress ? (
  // <h1>Hey some async call in progress ! </h1>
  <div
     style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
     <ThreeDots 
	color={'blue'} 
	height={150} 
	width={150} 
	/>
    </div>
  ):(<></>)
  
  );  
}

export const Services = () => {
  const [data, setData] = React.useState<ServiceData[]>([]);
  const request_url=url_backend+'/api/services/';
  const getProductData = async () => {
    try {
      const data = await axios.get<ServiceData[]>(
        request_url
      );

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
      {/* marginLeft: {  sm: `200px`, md: `200px`}}}> */}
      <Toolbar />

      <ServicesTableActions data={data} />
    </Box>
    <LoadingIndicator/>
    </>
  );
};
