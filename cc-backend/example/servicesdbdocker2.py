import docker
from . import servicesdb
import re
import json

client=docker.from_env()
client2 = docker.APIClient(base_url='unix://var/run/docker.sock')
        

def get_service_data():

    result=[]
    # get service data from db
    db_data=servicesdb.get_service_db()
    # db_data=get_service_db()

    # get all services running from docker
    docker_data=client.services.list() # returns all details about service
    service_docker_list=[]

    # get names of the running services
    for x in docker_data:
        service_docker_list.append(x.name)

    # for every service from db
    for temp in db_data:
        data={}
        data['_id']=temp['id']
        data['name']=temp['name']
        data['type']=temp['deployment_type']
        data['state']=temp['status']
        data['description']=temp['description']
        data['expected_instances']=temp['expected_instances']
        data['labels']=json.loads(temp['labels'])

        # pattern matching for service name in db to service instance name in docker
        r=re.compile(f'vsmaps_{data["name"]}(\-\d)*?$')

        # matched list containes the instances names 
        actual_instances_list=list(filter(r.match, service_docker_list))
        
        # count of running instances
        data['actual_instances']=0
        host_list=[]
        # looping through the actual instance list for that service
        if actual_instances_list!=[]:
            for services_names in actual_instances_list:
                # list of tasks of the services
                tasks=client2.tasks(filters={'desired-state':"running",'service':services_names})
                
                if tasks!=[]:
                   # checking the current state of the task
                    if tasks[0]['Status']['State']=="running":
                        data['actual_instances']+=1
                        node_id=tasks[0]['NodeID']
                        node_inspect=client2.inspect_node(node_id)
                        host_list.append(node_inspect['Description']['Hostname'])
        

      
        data['hosts']=host_list
        result.append(data)
    
    final=json.dumps(result,indent=2)
    print(final)
    return final

get_service_data()
