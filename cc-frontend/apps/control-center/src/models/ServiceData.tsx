// interface for servicedata

export interface ServiceData {
    _id: string;
    name: string;
    type: string;
    state: string;
    description: string;
    expected_instances: number;
    actual_instances: number;
    hosts: string[];
    labels: string[];
  }