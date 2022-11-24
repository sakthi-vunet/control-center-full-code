from . import containersdbdocker
import json

containers_list=[]
file='./jsondata/notifications_file.txt' 



def get_notifications():
    global containers_list
    
    if containers_list==[]:
        x=containersdbdocker.get_containers_dbdocker()
        containers_info=json.loads(x)
        for i in containers_info:
            containers_list.append(i['name'])
    
    current_list=[]
    x=json.loads(containersdbdocker.get_containers_dbdocker())
    for i in x:
        current_list.append(i['name'])

    temp=set(containers_list)^set(current_list)

    containers_list=current_list

    if len(temp)!=0:        
        with open(file, 'w') as filetowrite:
            for x in temp:
                filetowrite.write('Containers '+x+' stopped unexpectedly,')
    
    
    f=open(file,'r')
    return f.read()


