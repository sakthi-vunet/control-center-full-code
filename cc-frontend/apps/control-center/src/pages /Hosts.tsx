import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";
import axios from 'axios';
import * as React from 'react';
import { HostsTable } from "./HostsTable";
import { HostsData } from "./HostsTable";
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
	color={'blue'} 
	height={150} 
	width={150} 
	/>
    </div>
  ):(<></>)
  
  );  
}

export const Hosts=()=>{

  const [data,setData]=React.useState<HostsData[]>([]);
  const request_url=url_backend+'/api/hosts/';

  const getProductData = async () => {
   try {
   
       const data =  await axios.get<HostsData[]>(request_url);
        
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
   
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0.05,
        display:'flex'}}
        >
      
      {/* marginLeft: {  sm: `200px`, md: `200px`}}}> */}
      <Toolbar />
     
   
    <HostsTable data={data}/>
    
    
</Box>
<LoadingIndicator />
</>
     
  );
};
  