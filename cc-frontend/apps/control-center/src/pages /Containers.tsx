import { Box } from "@mui/system";
import { Toolbar } from "@mui/material";
import { ContainerData } from "./ContainerInstancesNew";
import { ContainerTable } from "./ContainerInstancesNew";
import axios from 'axios';
import * as React from 'react';
import url_backend from "../configs/url";

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
      } catch (e) {
        console.log(e);
      }
    };
  React.useEffect(() => {
      getProductData();
  }, []);

  return (

    <Box
    component="main"
    sx={{ flexGrow: 1, p: 3,display:'flex'}}>
     {/* marginLeft: {  sm: `200px`, md: `200px`}}}> */}
    <Toolbar />
    <ContainerTable data={data}/>

    </Box>
    
  );
  }