import datetime
import docker
import socket
import paramiko
import subprocess
import sys

# use this for container logs when running on production mode so you have
# permission to store ssh keys in the container and the container id in
# hosts


def get_container_logs(service_name):
    log_list = subprocess.check_output(
        ['sudo', 'python', './su_logs.py', service_name]).decode(sys.stdout.encoding)
    log_string = ""
    for log in log_list:
        log_string += log
    return log_string

# function to get container logs


def get_logs(service_name):

    # current host name
    curr_hostname = socket.gethostname()

    client2 = docker.DockerClient(base_url='unix://var/run/docker.sock')
    client = docker.APIClient(base_url='unix://var/run/docker.sock')

    # service object using service name
    service_object = client2.services.get(service_name)
    # tasks of service
    tasks = service_object.tasks(filters={'desired-state': 'running'})

    if tasks == []:
        return "No such service is running"

    else:

        # find host name of running taks
        for temp in tasks:
            if 'NodeID' in temp:
                node_object = client2.nodes.get(temp['NodeID'])
                node_info = client.inspect_node(node_object.id)
                hostname = node_info['Description']['Hostname']

                # if hostname is same as the current host
                # find container id using filtering of service name with container list
                if hostname == curr_hostname:
                    container_object_list = client2.containers.list(
                        filters={'name': service_name})
                    # get logs of last 10 lines or uncomment for logs for last 10 mins
                    for x in container_object_list:
                        # today = datetime.datetime.now()
                        # final_time = today - datetime.timedelta(minutes=10)
                        # logdata=x.logs(since=final_time,until=today)
                        logdata = x.logs(tail=10)
                        logs = logdata.decode('utf-8')
                        return logs

                # for containers running on other hosts ,ssh to the host and find
                # container id and get logs
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
                    # get logs using containerid
                    cmd = 'docker logs -n=10 '+containerid[0][:-1]
                    stdin, stdout, stderr = ssh.exec_command(cmd)
                    logs = stdout.readlines()
                    return logs
            else:
                return "Not Running"
