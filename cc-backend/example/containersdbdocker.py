import docker
from . import servicesdb
import re
import json

def get_containers_dbdocker():

    # to store final results
    result=[]

    # get service names from db and stores in service list
    db_data=servicesdb.get_service_db()
    service_list=[]
    for temp in db_data:
        service_list.append(temp["name"])
    
   


    client = docker.APIClient(base_url='unix://var/run/docker.sock') 
    client2 = docker.DockerClient(base_url='unix://var/run/docker.sock')
    
    # gets list of services from docker
    docker_data=client.services()

    # looping through each service from docker    
    for temp in docker_data:
        container_data={}

        # id of service
        container_data['_id']=temp["ID"]

        # name of service
        container_data['name']=temp["Spec"]['Name']

        # last update time of service
        container_data["started_at"]=temp["UpdatedAt"]

        # finding the host name of the service by listing out tasks and identify node id from 
        # task info and figuring host name from node id
        service_object=client2.services.get(container_data['_id'])
        tasks=service_object.tasks(filters={'desired-state':"running"})
        hostname=''
        for x in tasks:
            if 'NodeID' in x:
                node_data=client.inspect_node(x['NodeID'])
                hostname=node_data['Description']['Hostname']
        container_data['host']=hostname
        
        # finding the name of the service from the container data and matching with service db data
        try:
            results= re.search('vsmaps_(.+?)(\-\d)*?$',container_data['name']).group(1)
            
              
        except AttributeError:
            results=''
        
        if results=='':
            container_data['service']=''
            container_data['type']=''
        else:
            for db_temp in db_data:
                if results==db_temp['name']:
                    container_data['service']=db_temp['name']
                    container_data['type']=db_temp['deployment_type']
            
            if 'service' not in container_data:
                container_data['service']=''
                container_data['type']=''


        result.append(container_data)
    
    final=json.dumps(result,indent=2)
    print(final)
    # with open(r'/home/sakthi/Downloads/cc-backend/jsondata/vsmaps_containers.json', 'w') as fp:
    #     fp.write(final)
    return final

get_containers_dbdocker()