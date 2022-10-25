import docker
import subprocess
from mysqlcheck import *

result=[]

client = docker.from_env()
# for container in client.containers.list():
#   print(container.id)

base_dir='/data'

cmd = 'ls /data/stack | grep ".yml" | sed -e "s/.yml//" | tr "[:upper:]"  "[:lower:]"'
ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
output = str(ps.communicate())

output = output.split("\n")

  
output = output[0].split('\\n')

# a variable to store the output
stack_list = []

# iterate through the output
# line by line
for line in output:
    stack_list.append(line)
stack_list[0]=stack_list[0].lstrip('\(b\'')
# print the output
# for i in range(0, len(stack_list)):
#     print(stack_list[i])

stack_list.pop()

stack_service=[]
for item in stack_list:
  cmd='yq eval /data/stack/'+item+'.yml --tojson | jq -r ".services | keys[]"'
  ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  output = str(ps.communicate())
  output=output[3:]
  output=output[:-8]
  output = output.split("\n")

  
  output = output[0].split('\\n')
  output.remove('')  
  stack_service.extend(output)
  
# for i in range(0, len(stack_service)):
#   print(stack_service[i])




for item in stack_service:
  service_data={}

  cmd='docker service ps --format "{{.CurrentState}}" vsmaps_'+item+' | head -1'
  ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  output=str(ps.communicate())
  output=output[3:]
  output=output[:-8]
  output = output.split("\n")  
  output = output[0].split('\\n')
  output.remove('')  
  x=output[0].split()
  # print(x)
  if x[0]=='Running':
    service_data['state']='Running'
  else:
    service_data['state']='Not Running'

  service_data['name']='vsmaps_'+item
  sd=client.services.list(filters={'name':service_data['name']})
  # print(sd)
  if sd!=[]:
    service_data['id']=sd[0].id
  else:
    service_data['id']=None

  if service_data['id']==None:
    service_data['expected_instances']=0
    service_data['actual_instances']=0
    service_data['type']=''
    service_data['description']=''
    service_data['labels']=[]
    service_data['hosts']=[]
  
  else:
    service_data['expected_instances']=1
    if service_data['state']=='Running':
      service_data['actual_instances']=1
    else:
      service_data['actual_instances']=0
    
    item_alpha="".join(c for c in item if c.isalpha())
    service_data['type']=getfromdb(item_alpha,"type")
    
    service_data['description']=getfromdb(item_alpha,"description")

    clientlow=docker.APIClient(base_url='unix://var/run/docker.sock')
    
    y=client.api.inspect_service(service_data['id'])
    try:
      service_data['labels']=y['Spec']['TaskTemplate']['Placement']['Constraints']
    except:
      service_data['labels']=[]
    
    cmd='docker service ps --format "{{.Node}}" vsmaps_'+item+' | sed -n 1p'
    ps = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    output=str(ps.communicate())
    output=output[3:]
    output=output[:-8]
    output = output.split("\n")  
    output = output[0].split('\\n')
    output.remove('')  
    x=output[0].split()
    service_data['hosts']=x
    
  result.append(service_data)

print(result)
