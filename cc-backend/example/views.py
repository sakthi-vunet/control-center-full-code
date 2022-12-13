from django.shortcuts import HttpResponse
import json
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
from . import make_host_migration
from . import migrate_host
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# Filter to get only audit log levels of INFO


class MyFilter(object):
    def __init__(self, level):
        self.__level = level

    def filter(self, logRecord):
        return logRecord.levelno <= self.__level


# formatter for audit logs
formatter_timestamp = logging.Formatter(
    '[%(asctime)s]%(levelname)s - %(message)s')
# log handler
handler = logging.FileHandler('/var/log/cc-logs/generator.log')
handler.addFilter(MyFilter(logging.INFO))
handler.setFormatter(formatter_timestamp)

# current user for audit log initialised with unknown
# updated when some user logs in to the application
current_user = 'unknown'

# fetched all container data


def get_containers():

    out_json = containersdbdocker.get_containers_dbdocker()
    json_obj = json.loads(out_json)
    return json_obj

# fetches data of container with given id


def get_containers_id(id):
    result = []
    getall = get_containers()
    for keyval in getall:
        if id == keyval['_id']:
            result.append(keyval)
    return result

# handles container api


@csrf_exempt
def index_containers(request):
    logger = logging.getLogger('containers')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    # get request to fetch data
    if request.method == "GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_containers(), safe=False)
        else:
            container_id = request.GET.get("_id")
            logger.info('User '+current_user +
                        ' requested container info of id '+container_id)
            return JsonResponse(get_containers_id(request.GET.get("_id")), safe=False)

    # put request for start and stop of containers as mentioned in the field action
    elif request.method == "PUT":
        temp = json.loads(request.body.decode('utf-8'))
        print(temp['name'], temp['action'])
        container_name = temp['name']
        container_action = temp['action']
        logger.info('User '+current_user+' requested to ' +
                    container_action+' '+container_name)
        return JsonResponse(json.loads(request.body.decode('utf-8')))

# handles container logs


def index_logs_containers(request):
    logger = logging.getLogger('container-logs')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    # get request to fetch logs of container given id
    if request.method == "GET":
        container_id = request.GET.get("_id")
        logger.info('User '+current_user +
                    ' requested container logs of '+container_id)
        return JsonResponse(container_logs.get_container_logs(request.GET.get("_id")), safe=False)

# fetches all service data


def get_services():
    out_json = servicesdbdocker2.get_service_data()
    json_obj = json.loads(out_json)
    return json_obj


# fetches data of service given id
def get_services_id(id):
    result = []
    getall = get_services()
    print("Id from function", id)
    for keyval in getall:
        if int(id) == keyval['_id']:
            result.append(keyval)
    return result

# handles service API


@csrf_exempt
def index_services(request):
    logger = logging.getLogger('services')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    # get request to fetch servie data
    if request.method == "GET":
        if request.GET.get("_id") is None:
            return JsonResponse(get_services(), safe=False)
        else:
            service_id = request.GET.get("_id")
            logger.info('User '+current_user +
                        ' requested service info of id '+service_id)
            return JsonResponse(get_services_id(request.GET.get("_id")), safe=False)

    # put request to do the action on the service
    elif request.method == "PUT":
        temp = json.loads(request.body.decode('utf-8'))
        print(temp['name'], temp['action'])
        service_name = temp['name']
        service_action = temp['action']
        logger.info('User '+current_user+' requested to ' +
                    service_action+' '+service_name)
        response = services_start_stop.service_actions(
            temp['name'], temp['action'])
        return JsonResponse(json.loads(response))

    # post request to scale service instances
    elif request.method == "POST":
        temp = json.loads(request.body.decode('utf-8'))

        logger.info('User '+current_user+' requested to ' +
                    request.body.decode('utf-8'))
        return JsonResponse(temp)


# fetches all host data
def get_hosts():

    out_json = hostsdbdocker.get_hosts()
    json_obj = json.loads(out_json)
    return json_obj

# fetches data of host given name


def get_hosts_id(id):

    result = []
    getall = get_hosts()
    for keyval in getall:
        if id == keyval["name"]:
            result.append(keyval)
    return result

# handles host api


@csrf_exempt
def index_hosts(request):
    logger = logging.getLogger('hosts')
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    # get request to fetch host data
    if request.method == "GET":
        if request.GET.get("name") is None:
            # logger.info('User '+current_user+' requested get hosts info')
            return JsonResponse(get_hosts(), safe=False)
        else:
            host_item_name = request.GET.get("name")
            logger.info('User '+current_user +
                        ' requested host info of id '+host_item_name)
            return JsonResponse(get_hosts_id(host_item_name), safe=False)

    # post request to add host
    elif request.method == "POST":
        print('BODY', request.body)

        host_item = json.loads(request.body.decode('utf-8'))
        host_item_name = host_item['name']
        logger.info('User '+current_user +
                    ' has added a new host '+host_item_name)
        db_inserthosts.insert_hosts(host_item)
        return JsonResponse(json.loads(request.body.decode('utf-8')))

    # put request to delete host or update labels of host
    elif request.method == "PUT":
        print('Body', request.body)
        temp = request.body.decode('utf-8')
        temp = temp.split('$')
        print(temp)
        if temp[0] == 'delete':
            host_item_name = temp[1]
            logger.info('User '+current_user +
                        ' has deleted host '+host_item_name)
            return JsonResponse(db_deletehosts.delete_hosts(temp[1]), safe=False)
        else:
            host_item = json.loads(request.body.decode('utf-8'))
            logger.info('User '+current_user +
                        ' has updated host '+host_item['name'])
            db_updatehosts.update_hosts(host_item)
            return JsonResponse(json.loads(request.body.decode('utf-8')))


# fetches labels data from db
def get_labels():
    result = db_labels.getfromdb_labels()
    result = result.to_dict()
    result = result[0]
    return result


# handles labels API
def index_labels(request):
    if request.method == "GET":
        return JsonResponse(get_labels(), safe=False)

# handles settings API


def index_settings(request):
    if request.method == "GET":
        return JsonResponse(db_settings.getfromdb_settings(), safe=False)

# handles status API


def index_status(request):
    if request.method == "GET":
        return JsonResponse(get_status.get_status_info(), safe=False)

# handles version info API


def index_version_info(request):
    if request.method == "GET":
        return JsonResponse(db_versioninfo.getfromdb_versioninfo(), safe=False)

# handles service types API
# get services groupoed based on their deployment type such as Free Scale,Stateful etc


@csrf_exempt
def index_service_types(request):
    if request.method == "PUT":

        temp = json.loads(request.body.decode('utf-8'))
        result = get_deployment_types(temp['services'])

        return JsonResponse(result, safe=False)

# groups list of services based on their deployment type


def get_deployment_types(service_list):
    result = {}
    for x in service_list:
        type = db_gettype.get_service_type(x['Name'])
        if type in result:
            result[type].append(x['Name'])
        else:
            result[type] = []
            result[type].append(x['Name'])

    return result

# function to check if host with given node id has the given label


def check_label(nodeid, label):
    hosts_data = get_hosts()
    for temp in hosts_data:
        if temp['_id'] != nodeid:
            for i in temp['labels']:
                if i == label:
                    return True

    return False

# handles migrateservices API
# returns 2 lists of services
# 1.list services that can be migrated from host( Except Stateful, and services with labels in other hosts )
# 2.list of services that cannot be migrated (Stateful)


@csrf_exempt
def index_migrate_services(request):
    if request.method == 'PUT':
        temp = json.loads(request.body.decode('utf-8'))

        nodeid = temp['_id']
        result = get_deployment_types(temp['services'])
        mig_p = []
        mig_np = []
        for i in result:
            if i != 'Stateful':
                for j in result[i]:
                    if check_label(nodeid, j) == True:
                        mig_p.append(j)
                    else:
                        mig_np.append(j)
        end_mig_res = {}
        end_mig_res['p'] = mig_p
        end_mig_res['np'] = mig_np

        return JsonResponse(end_mig_res, safe=False)


# handles audit logs API
def index_audit_logs(request):
    if request.method == "GET":
        return JsonResponse(get_audit_logs.get_audit_logs(), safe=False)

# handles notifications api


def index_notifications(request):
    if request.method == "GET":
        return HttpResponse(notifications.get_notifications())

# handles container login API given container id


def index_container_login(request):
    if request.method == "GET":
        return JsonResponse(container_login.get_login_details(request.GET.get("name")), safe=False)


# finds and updates the current_user by making request to /api/user everytime a new user logs in
# checks using jwt bearer token
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def index_user(request):
    global current_user
    if request.method == 'GET':
        current_user = f"{request.user}"
        print(current_user)
        return JsonResponse(current_user, safe=False)

# handles hostmigrate api


@csrf_exempt
def index_host_migration(request):
    # checks if service migration is possible to other host
    if request.method == "POST":
        temp = json.loads(request.body.decode('utf-8'))
        host_name = temp['host']
        service_name = temp['service']

        result = migrate_host.migrate_host(service_name, host_name)
        return JsonResponse(result, safe=False)
    # makes the service to migrate from given host
    if request.method == "PUT":
        temp = json.loads(request.body.decode('utf-8'))
        host_name = temp['host']
        service_name = temp['service']
        result = make_host_migration.make_host_migration(
            host_name, service_name)
        return JsonResponse(result, safe=False)
