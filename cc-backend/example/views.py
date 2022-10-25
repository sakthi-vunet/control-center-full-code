from cProfile import label
import json
from re import T
from django.http import JsonResponse
from . import db_labels
from . import db_inserthosts
from . import db_updatehosts
from . import db_versioninfo
from . import services_start_stop
from . import db_settings
from . import container_logs
from . import servicesdbdocker2
from . import containersdbdocker
from . import hostsdbdocker
from . import db_deletehosts
from . import db_gettype



def get_containers():
    
    out_json=containersdbdocker.get_containers_dbdocker()
    json_obj=json.loads(out_json)
    return json_obj


def get_containers_id(id):
    result=[]
    getall=get_containers()
    for keyval in getall:
        if id == keyval['_id']:
            result.append(keyval)
    return result


def index_containers(request):
    if request.method=="GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_containers(),safe=False)
        else:
            return JsonResponse(get_containers_id(request.GET.get("_id")),safe=False)
    
    elif request.method=="PUT":
        temp=json.loads(request.body.decode('utf-8'))
        print(temp['name'],temp['action'])
        return JsonResponse(json.loads(request.body.decode('utf-8')))

def index_logs_containers(request):
    if request.method=="GET":
        return JsonResponse(container_logs.get_container_logs(request.GET.get("_id")),safe=False)

def get_services():
    # out_json=servicesdbdocker.get_service_data()
    out_json=servicesdbdocker2.get_service_data()
    json_obj=json.loads(out_json)
    return json_obj



def get_services_id(id):
    result=[]
    getall=get_services()
    print("Id from function",id)
    for keyval in getall:
        if int(id)== keyval['_id']:
            result.append(keyval)
    return result


def index_services(request):
    if request.method=="GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_services(),safe=False)
        else:
            
            return JsonResponse(get_services_id(request.GET.get("_id")),safe=False)
    
    elif request.method=="PUT":
        temp=json.loads(request.body.decode('utf-8'))
        print(temp['name'],temp['action'])
        response=services_start_stop.service_actions(temp['name'],temp['action'])
        return JsonResponse(json.loads(response))
    
    elif request.method=="POST":
        temp=json.loads(request.body.decode('utf-8'))
        return JsonResponse(temp)


def get_hosts():
    # out_json=hostsnew.get_hosts()
    out_json=hostsdbdocker.get_hosts()
    json_obj=json.loads(out_json)
    return json_obj


def get_hosts_id(id):
    result=[]
    getall=get_hosts()
    for keyval in getall:
        if id == keyval["name"]:
            result.append(keyval)
    return result


def index_hosts(request):
    if request.method=="GET":
        if request.GET.get("name") is None:
            return JsonResponse(get_hosts(),safe=False)
        else:
            return JsonResponse(get_hosts_id(request.GET.get("name")),safe=False)

    elif request.method=="POST":
        print('BODY', request.body)
        host_item= json.loads(request.body.decode('utf-8'))
        db_inserthosts.insert_hosts(host_item)
        return JsonResponse(json.loads(request.body.decode('utf-8')))
    
    elif request.method=="PUT":
        print('Body',request.body)
        temp=request.body.decode('utf-8')
        temp=temp.split()
        print(temp)
        if temp[0]=='delete':
            return JsonResponse(db_deletehosts.delete_hosts(temp[1]),safe=False)
        else:
            host_item= json.loads(request.body.decode('utf-8'))
            db_updatehosts.update_hosts(host_item)
            return JsonResponse(json.loads(request.body.decode('utf-8')))



def get_labels():
    result=db_labels.getfromdb_labels()
    result=result.to_dict()
    result=result[0]
    return result
 


def index_labels(request):
    if request.method=="GET":
        return JsonResponse(get_labels(),safe=False)


def index_settings(request):
    if request.method=="GET":
        return JsonResponse(db_settings.getfromdb_settings(),safe=False)

def get_status():
    with open('./jsondata/status.json','r') as fp:
        out_json = json.load(fp)
    return out_json

def index_status(request):
    if request.method=="GET":
        return JsonResponse(get_status(),safe=False)

def index_version_info(request):
    if request.method=="GET":
        return JsonResponse(db_versioninfo.getfromdb_versioninfo(),safe=False)


def index_service_types(request):
    if request.method=="PUT":
        
        temp=json.loads(request.body.decode('utf-8'))
        result=get_deployment_types(temp['services'])
        
        return JsonResponse(result,safe=False)


def get_deployment_types(service_list):
    result={}
    for x in service_list:
        type=db_gettype.get_service_type(x['Name']) 
        if type in result:
            result[type].append(x['Name'])
        else:
            result[type]=[]
            result[type].append(x['Name'])
    
    return result

def check_label(nodeid,label):
    hosts_data=get_hosts()
    for temp in hosts_data:
        if temp['_id']!=nodeid:
            for i in temp['labels']:
                if i==label:
                    return True
    
    return False


def index_migrate_services(request):
    if request.method=='PUT':
        temp=json.loads(request.body.decode('utf-8'))
        
        nodeid=temp['_id']
        result=get_deployment_types(temp['services'])
        mig_p=[]
        mig_np=[]
        for i in result:
            if i!='Stateful':
                for j in result[i]:
                    if check_label(nodeid,j)==True:
                        mig_p.append(j)
                    else:
                        mig_np.append(j)
        end_mig_res={}
        end_mig_res['p']=mig_p
        end_mig_res['np']=mig_np

        return JsonResponse(end_mig_res,safe=False)