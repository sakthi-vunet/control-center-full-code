from . import servicesdbdocker2
from . import containersdbdocker
from . import hostsdbdocker
import json

# get status information from docker

def get_status_info():

    result={}


    result['healthy_hosts']=0
    result['unhealthy_hosts']=[]

    # gets host information
    host_info=hostsdbdocker.get_hosts()
    host_info=json.loads(host_info)
    for temp in host_info:
        # counts healthy hosts
        if temp['health_status']=='Healthy':
            result['healthy_hosts']+=1
        # stores unhealthy host names
        else:
            result['unhealthy_hosts'].append(temp['name'])
    
    # gets service information
    service_info=servicesdbdocker2.get_service_data()
    service_info=json.loads(service_info)

    result['unhealthy_services']=[]
    result['services_running']=0
    for temp in service_info:

        # stores the services that are not actually running the expected number of instances
        if temp['actual_instances']<temp['expected_instances']:
            result['unhealthy_services'].append(temp['name'])
        # counts the services that are running the expected number of instances
        else:
            result['services_running']+=1
    
    # gets container information
    container_info=containersdbdocker.get_containers_dbdocker()
    container_info=json.loads(container_info)

    result['instances_running']=0
    result['stopped_instances']=[]

    for temp in container_info:
        # containers that are running will have host names , using that running containers are identified
        if temp['host']=='':
            result['stopped_instances'].append(temp['name'])
        else:
            result['instances_running']+=1
    
    status_item=[]
    status_item.append(result)
   
    return status_item
