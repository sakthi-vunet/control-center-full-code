
// Service data interface for host that stores the service name 
// and the no. of intsnces of that service running on that host
export interface Service {

    Name:      string;
    Instances: number;

}
  
// Storage Mount interface for diffreent mount points and storage capacity details 
export interface StorageMount {

    Mount_point: string;
    Storage:     string;

}

// Host Data interface
export interface HostsData {

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
  
  
 