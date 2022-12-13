import docker
import re

client = docker.from_env()


def scale_up(service_name,instance):
    service_data=client.services.list()
    service_docker_list=[]

    # get names of the running services
    for x in service_data:
        service_docker_list.append(x.name)
    
    # pattern matching for service name in db to service instance name in docker
    r=re.compile(f'vsmaps_{data["name"]}(\-\d)*?$')

    # matched list containes the instances names 
    actual_instances_list=list(filter(r.match, service_docker_list))
    if actual_instances_list!=[]:
        match=actual_instances_list[0]
        for x in service_data:
            if match==x.name:
                service_obj=x
                service_obj.scale(instance)
                break


    


