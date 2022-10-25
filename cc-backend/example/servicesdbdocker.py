from python_on_whales import docker
from . import servicesdb
import re
import json

def get_service_data():

    result=[]
    # get service data from db
    db_data=servicesdb.get_service_db()

    # get all services running from docker
    docker_data=docker.service.list() # returns all details about service
    service_docker_list=[]

    # get names of the running services
    for x in docker_data:
        service_docker_list.append(x.spec.name)

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
        # looping through the actual instance list for that service
        if actual_instances_list!=[]:
            for services_names in actual_instances_list:
                # checking the current state of the task of the service 
                tasks=docker.service.ps(services_names)
                
                if tasks[0].status.state=="running":
                    data['actual_instances']+=1
        

        # finding name of host where instances are running

                 
        host_list=[]
        if actual_instances_list!=[]:
            for i in actual_instances_list:
                # returns tasks of the service
                tasks = docker.service.ps(i)
                if tasks==None:
                    host_list=[]

                else:
                    # for j in tasks:
                    #     # filtering only running tasks
                    #     if j.desired_state=="running":
                            
                    #         # finding nodeid of running tasks 
                    #         if j.node_id!=None:
                    #             node_id=j.node_id
                    #             try:
                    #             # getting name of host from node id
                    #                 node=docker.node.inspect(node_id)
                    #             except:
                    #                 node=None
                    #             if node !=None:
                    #                 host_list.append(node.description.hostname)
                    if tasks[0].status.state=='running':
                        try:
                            node=docker.node.inspect(tasks[0].node_id)
                            host_list.append(node.description.hostname)
                        except:
                            pass
            
        data['hosts']=host_list
        result.append(data)
    
    final=json.dumps(result,indent=2)
    print(final)
    return final

get_service_data()
