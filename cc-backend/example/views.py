from cProfile import label
from django.shortcuts import HttpResponse
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
import logging
from . import get_audit_logs
from . import get_status
from . import notifications
from . import container_login

class MyFilter(object):
    def __init__(self, level):
        self.__level = level

    def filter(self, logRecord):
        return logRecord.levelno <= self.__level

logging.basicConfig(
     level=logging.INFO, 
     format= '[%(asctime)s]%(levelname)s - %(message)s',
     datefmt='%Y-%m-%d %H:%M:%S'
 )

handler = logging.FileHandler('/var/log/cc-logs/generator.log')
handler.addFilter(MyFilter(logging.INFO))


current_user='xxx'

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
    logger = logging.getLogger('containers')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    if request.method=="GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_containers(),safe=False)
        else:
            container_id=request.GET.get("_id")
            logger.info('User '+current_user+' requested container info of id '+container_id)
            return JsonResponse(get_containers_id(request.GET.get("_id")),safe=False)
    
    elif request.method=="PUT":
        temp=json.loads(request.body.decode('utf-8'))
        print(temp['name'],temp['action'])
        container_name=temp['name']
        container_action=temp['action']
        logger.info('User '+current_user+' requested to '+container_action+' '+container_name)
        return JsonResponse(json.loads(request.body.decode('utf-8')))

def index_logs_containers(request):
    logger = logging.getLogger('container-logs')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    if request.method=="GET":
        container_id=request.GET.get("_id")
        # logger.info('User '+current_user+' requested container logs of '+container_id)
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
    logger = logging.getLogger('services')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    if request.method=="GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_services(),safe=False)
        else:
            service_id=request.GET.get("_id")
            logger.info('User '+current_user+' requested service info of id '+service_id)
            return JsonResponse(get_services_id(request.GET.get("_id")),safe=False)
    
    elif request.method=="PUT":
        temp=json.loads(request.body.decode('utf-8'))
        print(temp['name'],temp['action'])
        service_name=temp['name']
        service_action=temp['action']
        logger.info('User '+current_user+' requested to '+service_action+' '+service_name)
        response=services_start_stop.service_actions(temp['name'],temp['action'])
        return JsonResponse(json.loads(response))
    
    elif request.method=="POST":
        temp=json.loads(request.body.decode('utf-8'))

        logger.info('User '+current_user+' requested to '+request.body.decode('utf-8'))
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
    logger = logging.getLogger('hosts')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    

    if request.method=="GET":
        if request.GET.get("name") is None:
            # logger.info('User '+current_user+' requested get hosts info')
            return JsonResponse(get_hosts(),safe=False)
        else:
            host_item_name=request.GET.get("name")
            logger.info('User '+current_user+' requested host info of id '+host_item_name)
            return JsonResponse(get_hosts_id(host_item_name),safe=False)

    elif request.method=="POST":
        print('BODY', request.body)
        
        host_item= json.loads(request.body.decode('utf-8'))
        host_item_name=host_item['name']
        logger.info('User '+current_user+' has added a new host '+host_item_name)
        db_inserthosts.insert_hosts(host_item)
        return JsonResponse(json.loads(request.body.decode('utf-8')))
    
    elif request.method=="PUT":
        print('Body',request.body)
        temp=request.body.decode('utf-8')
        temp=temp.split('$')
        print(temp)
        if temp[0]=='delete':
            host_item_name=temp[1]
            logger.info('User '+current_user+' has deleted host '+host_item_name)
            return JsonResponse(db_deletehosts.delete_hosts(temp[1]),safe=False)
        else:
            host_item= json.loads(request.body.decode('utf-8'))
            logger.info('User '+current_user+' has updated host '+host_item['name'])
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


def index_status(request):
    if request.method=="GET":
        return JsonResponse(get_status.get_status_info(),safe=False)

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

def index_audit_logs(request):
    if request.method=="GET":
        return JsonResponse(get_audit_logs.get_audit_logs(),safe=False)


def index_notifications(request):
    if request.method=="GET":
        return HttpResponse(notifications.get_notifications())

def index_container_login(request):
    if request.method=="GET":
        return JsonResponse(container_login.get_login_details(request.GET.get("name")),safe=False)

def index_user(request):
    current_user=request.user.id
    if request.method=="GET":
        return JsonResponse(current_user,safe=False)
