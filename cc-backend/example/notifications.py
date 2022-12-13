from . import containersdbdocker
import json


containers_list=[]
# file where notifications data are written
file='./jsondata/notifications_file.txt' 



def get_notifications():

    global containers_list
    
    # for first time when container list is empty
    if containers_list==[]:
        x=containersdbdocker.get_containers_dbdocker()
        containers_info=json.loads(x)
        for i in containers_info:
            containers_list.append(i['name'])
    
    # current list is the container list checked at that time
    current_list=[]
    x=json.loads(containersdbdocker.get_containers_dbdocker())
    for i in x:
        current_list.append(i['name'])

    # compares two container list and finds name of the container that is absent from one list
    temp=set(containers_list)^set(current_list)

    # updates global container list
    containers_list=current_list

    # writes the name of stopped container to file
    # note: notifications are always ended with ',' as in frontend data is split using comma
    if len(temp)!=0:        
        with open(file, 'w') as filetowrite:
            for x in temp:
                filetowrite.write('Containers '+x+' stopped unexpectedly,')
    
    
    f=open(file,'r')
    return f.read()


