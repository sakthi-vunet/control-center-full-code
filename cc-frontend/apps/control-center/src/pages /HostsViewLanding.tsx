import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";
import axios from 'axios';
import * as React from 'react';
// import { HostsData } from "./HostsInfo";
import { ControlledAccordions } from "./HostsView";
import { Typography } from "@material-ui/core";
import {useLocation} from 'react-router-dom';
import url_backend from "../configs/url";
import { request } from "https";
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import {ThreeDots} from 'react-loader-spinner';


export const LoadingIndicator = () => {

  const { promiseInProgress } = usePromiseTracker();
  
 return (
  
  promiseInProgress ? (
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

export interface HostsData{
  _id:               string;
  name:              string;
  description:       string;
  OS:                string;
  Running_services:  number;
  Running_instances: number;
  health_status:     string;
  services:          Service[];
  labels:            string[];
  number_of_cores:   number;
  processor_type:    string;
  memory:            string;
  total_storage:     string;
  storage_mounts:    StorageMount[];
}

export interface Service {
  Name:      string;
  Instances: number;
}

export interface StorageMount {
  Mount_point: string;
  Storage:     string;
}

export type HostsInfoprops={
  id?: string;
}

export const HostsInfoLanding =(props:HostsInfoprops)=>{

  const [data,setData]=React.useState<HostsData[]>([]);
  const location=useLocation();
  const idhere=location.state as HostsInfoprops;

  const request_url=url_backend+'/api/hosts/?name=';
  
  const getProductData = async () => {
     
    let url=request_url;
    url=url+idhere.id;
    console.log(url);
    try {
      
  
      const data = await axios.get<HostsData[]>(
        url
      );
      
      setData(data.data);
      console.log("Data:"+{data});
    } catch (e) {
    
      console.log(e);
    }
  };
  
  React.useEffect(() => {
      trackPromise(getProductData());
  },[] );
  
  console.log("After use effect"+data);
  return (
    <>
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0.05, display:'flex'}}>
      <Toolbar />
      
    <ControlledAccordions data={data} />
    
</Box>
<LoadingIndicator/>
</>
     
  );
};
  