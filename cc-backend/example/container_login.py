import docker
import socket
import paramiko

# Login to containers is done via container web tty
# for that the web tty container must be running on the host where the
# container that we want to login to, is running.
# The container web tty requires two parameters
# The hostname and the container id
# The Web tty is running on port 8080
# Login to containers can be done using te url:
# 'http://{hostname}:8080/e/{container_id}'


def get_login_details(service_name):

    final = get_login(service_name)

    if len(final) == 2:
        address = f'http://'+final[0]+':8080/e/'+final[1]
        print(address)
    else:
        address = ''
    return address

# to get login details like the hostname the container is running on and the container id


def get_login(service_name):

    # current host where the application is running
    curr_hostname = socket.gethostname()

    # docker client connects
    client2 = docker.DockerClient(base_url='unix://var/run/docker.sock')
    client = docker.APIClient(base_url='unix://var/run/docker.sock')

    # get service object with the given service name
    service_object = client2.services.get(service_name)
    # tasks of the service
    tasks = service_object.tasks(filters={'desired-state': 'running'})

    # if there are no tasks then the container is not running,login not possible
    result = []
    if tasks == []:
        return result

    else:
        # if tasks are running for the container find the host using node id
        for temp in tasks:
            if 'NodeID' in temp:
                node_object = client2.nodes.get(temp['NodeID'])
                node_info = client.inspect_node(node_object.id)
                hostname = node_info['Description']['Hostname']
                print(hostname)
                result.append(hostname)

                # if the host is same as the current host
                # list containers and find the container id using filters with the
                #  given servic name
                if hostname == curr_hostname:
                    container_object_list = client2.containers.list(
                        filters={'name': service_name})

                    for x in container_object_list:
                        result.append(x.id)
                        return result

                # if host is different from current host, then ssh to the other host
                # and obtain container id
                else:
                    ssh = paramiko.SSHClient()
                    # Adding new host key to the local
                    # HostKeys object(in case of missing)
                    # AutoAddPolicy for missing host key to be set before connection setup.
                    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                    ssh.connect(hostname,  username='vunet',
                                password='', timeout=3)
                    # Execute command on SSH terminal
                    # using exec_command
                    # get container id
                    cmd = 'docker ps -q -f name='+service_name
                    stdin, stdout, stderr = ssh.exec_command(cmd)
                    containerid = stdout.readlines()
                    containerid = containerid[0][:-1]
                    result.append(containerid)

                    return result
            else:
                return result

        # A successful result object will have two items in its list
        # result=[hostname,container_id]
