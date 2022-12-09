import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";
import { ContainerData } from "../models/ContainerData";
import { ContainerTable } from "./ContainerInstancesNew";
import axios from 'axios';
import * as React from 'react';
import url_backend from "../configs/url";
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
	// color={'#2196f3'} 
  color='blue'
	height={150} 
	width={150} 
	/>
    </div>
  ):(<></>)
  
  );  
}


export const ContainersInstances=()=>{

  const [data,setData]=React.useState<ContainerData[]>([]);
  const request_url=url_backend+'/api/containers/'

  const getProductData = async () => {
      try {
        const data = await axios.get<ContainerData[]>(
         request_url
        );
        
        setData(data.data);
        console.log(data);
        console.log('container fetch');
      } catch (e) {
        console.log(e);
      }
    };
  React.useEffect(() => {
      trackPromise(getProductData());
  },[]);

  return (
<>
    <Box
    component="main"
    sx={{ flexGrow: 1, p: 0.05,display:'flex'}}>
    <Toolbar />
    <ContainerTable data={data}/>
    </Box>
    <LoadingIndicator/>
    </>
    
  );
  }