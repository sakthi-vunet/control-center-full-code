import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
// import { HostsData } from "./HostsInfo";
import { ControlledAccordions } from './HostsView';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { request } from 'https';

export interface HostsData {
  _id: string;
  name: string;
  description: string;
  OS: string;
  Running_services: number;
  Running_instances: number;
  health_status: string;
  services: Service[];
  labels: string[];
  number_of_cores: number;
  processor_type: string;
  memory: string;
  total_storage: string;
  storage_mounts: StorageMount[];
}

export interface Service {
  Name: string;
  Instances: number;
}

export interface StorageMount {
  Mount_point: string;
  Storage: string;
}

export type HostsInfoprops = {
  id?: string;
};

export const HostsInfoLanding = (props: HostsInfoprops) => {
  const [data, setData] = React.useState<HostsData[]>([]);
  const location = useLocation();
  const idhere = location.state as HostsInfoprops;

  const request_url = '/api/hosts/?name=';

  const getProductData = async () => {
    let url = request_url;
    url = url + idhere.id;
    console.log(url);
    try {
      const data = await axios.get<HostsData[]>(url);

      setData(data.data);
      console.log('Data:' + { data });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getProductData();
  }, []);

  console.log('After use effect' + data);
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
      {/* marginLeft: {  sm: `200px`, md: `200px`}}}> */}
      <Toolbar />
      {/* <Typography>
        Hosts {'>>'} Hosts1
      </Typography>
      <span style={{marginLeft:'.5rem'}}/> */}

      <ControlledAccordions data={data} />
    </Box>
  );
};
