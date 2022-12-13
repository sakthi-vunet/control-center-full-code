from . import hostsdbdocker
import json

# check if migration of service from given host can take place by
# seeing if any other host in the docker swarm has the required service label

def migrate_host(service,host):
    
    # get host list
    host_list=json.loads(hostsdbdocker.get_hosts())
    host_with_label=[]
    for temp in host_list:
        # for host other than given host
        if temp['name']!=host:
            # check if label is present, if so append host name to list
            label_list=temp['labels']
            if service in label_list:
                host_with_label.append(temp['name'])
    
    if host_with_label!=[]:
        return True
    else:
        return False
