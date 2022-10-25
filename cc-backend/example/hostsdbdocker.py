import docker
import subprocess
from mysqlcheck import *
import json
import sqlalchemy as db
from hostsdb import *
import re
from . import servicesdb

client = docker.from_env()

def get_services_list(nodeid):
    
    db_servicedata=servicesdb.get_service_db()
    service_list=client.services.list()

    service_docker_list=[]

    # get names of the running services
    for x in service_list:
        service_docker_list.append(x.name)

    result=[]
    
    for temp in db_servicedata:
        r=re.compile(f'vsmaps_{temp["name"]}(\-\d)*?$')
        # matched list containes the instances names 
        actual_instances_list=list(filter(r.match, service_docker_list))

        client2 = docker.APIClient(base_url='unix://var/run/docker.sock')
        
        if actual_instances_list!=[]:
            count=0
            for services_names in actual_instances_list:
               
                tasks=client2.tasks(filters={'node':nodeid,'desired-state':"running",'service':services_names})
                if tasks!=[]:
                    if tasks[0]['Status']['State']=='running':
                        count+=1
                
        
            service_item={}
            if count!=0:
                service_item['Name']=temp['name']
                service_item['Instances']=count
                result.append(service_item)
    
    return result
        

    

    

    
def get_hosts():

    # stores all host details
    result=[]

    # connect to docker
    

    # getting host information stored in database 
    # sqlconnect function executes 'select * from hosts query'
    db_result=sqlconnect()


    # parsing through each enrty in host table
    for row in db_result:

        # converting sql output to dict
        x=row._asdict()
        hosts_item={}

        # loading details that is obtained from db
        hosts_item['name']=x['name']
        hosts_item['description']=x['description']
        hosts_item['labels']=json.loads(x['labels'])
        hosts_item['health_status']='Healthy'  # have to be handled later
        details=json.loads(x['details'])
        hosts_item.update(details)

        try:
            node_obj=client.nodes.get(hosts_item['name'])
        except:
            node_obj=None
        
        if node_obj is not None:
            hosts_item['_id']=node_obj.id    
            hosts_item['services']=get_services_list(hosts_item['_id'])
            running_service_count=0
            running_instance_count=0
            for x in hosts_item['services']:
                running_service_count+=1
                running_instance_count+=x['Instances']
            hosts_item['Running_services']=running_service_count
            hosts_item['Running_instances']=running_instance_count        
        else:
            hosts_item['_id']=''
            hosts_item['services']=[]
            hosts_item['Running_services']=0
            hosts_item['Running_instances']=0

    
        result.append(hosts_item)
    
    final=json.dumps(result,indent=2)
    print(final)
    
    return final

get_hosts()