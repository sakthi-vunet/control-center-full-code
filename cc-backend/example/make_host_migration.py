from . import hostsdbdocker
from . import rm_nodelabel
import json

# migrate service from given host by removing label 
# of the service from the given host

def make_host_migration(host,service):

    # get node id of the given host
    host_list=json.loads(hostsdbdocker.get_hosts())
    for temp in host_list:
        if temp['name']==host:
            nodeid=temp['_id']
    
    # remove label given host id and service name
    try:
        rm_nodelabel.rm_label(nodeid,service)
        return 'label removed. Migration will happen'
    except:
        return 'migration unsuccessful'
