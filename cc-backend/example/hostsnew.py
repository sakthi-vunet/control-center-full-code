# import docker
# import subprocess
# from mysqlcheck import *
# import json
# import sqlalchemy as db
# from hostsdb import *


# # function that takes hostname and returns list of services running on the host
# def get_service_list(hostname):
#     cmd='docker node ps '+hostname+' --format {{.Name}},{{.CurrentState}}'
#     ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
#     output=str(ps.communicate())
#     output=output[3:-8]
#     output = output.split("\n")  
#     output = output[0].split('\\n')
#     output.remove('')  
#     service=[]
#     if "Error" in output[0]:
#         service=[]
#     else:
#         for i in output:
#             temp=i.split(",")
#             if 'not found' not in temp[0]:
                    
#                 status=temp[1].split()
#                 if status[0]=="Running":
#                     service_name=temp[0].split('.')
#                     service.append(service_name[0])
#     return service
    

# # function that takes service name and host name and returns the number of containers running
# def get_instances(servicename,hostname):
#     cmd='docker service ps '+servicename+' --format {{.Node}},{{.DesiredState}}'
#     ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
#     output=str(ps.communicate())
#     output=output[3:-8]
#     output = output.split("\n")  
#     output = output[0].split('\\n')
#     output.remove('')  
#     count=0
#     for item in output:
#         temp=item.split(',')
#         if temp[1]=="Running" and temp[0]==hostname:
#             count+=1
#     return count




# def get_hosts():

#     # stores all host details
#     result=[]

#     # connect to docker
#     client = docker.from_env()

#     # getting host information stored in database 
#     # sqlconnect function executes 'select * from hosts query'
#     db_result=sqlconnect()


#     # parsing through each enrty in host table
#     for row in db_result:

#         # converting sql output to dict
#         x=row._asdict()
#         hosts_item={}

#         # loading details that is obtained from db
#         hosts_item['name']=x['name']
#         hosts_item['description']=x['description']
#         hosts_item['labels']=json.loads(x['labels'])
#         hosts_item['health_status']='Healthy'  # have to be handled later
#         details=json.loads(x['details'])
#         hosts_item.update(details)

#         # getting docker id of host
#         # id is obtained only if host is running
#         try:
#             services_docker=client.nodes.get(hosts_item['name'])
#         except:
#             services_docker=[]

#         if services_docker:
#             hosts_item['_id']=services_docker.short_id

#         else:
#             hosts_item['_id']=None

#         # using get_service_list function that returns services running on host using host name
#         temp_services_list=get_service_list(hosts_item['name'])


#         running_instance_count=0
#         running_service_count=0
        
#         # storing service name and its instances running

#         services_list=[]
#         for item in temp_services_list:
#             services={}
#             services['Name']=item
#             services['Instances']=get_instances(item,hosts_item['name'])
#             running_instance_count+=services['Instances']
#             running_service_count+=1
#             services_list.append(services)
#         hosts_item['services']=services_list

#         # total count of services running on host and total containers count running on host
#         hosts_item['Running_services']=running_service_count
#         hosts_item['Running_instances']=running_instance_count
        
#         result.append(hosts_item)


#     # the list of host details is converted to json document and written into a file
#     final=json.dumps(result,indent=2)
#     print(final)
#     return final

