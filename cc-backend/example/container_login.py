import docker
import socket
import paramiko
 
def get_login_details(service_name):
    # return subprocess.check_output('sudo python ./su_logs.py')
    final=get_login(service_name)

    if len(final)==2:
        address=f'http://'+final[0]+':8080/e/'+final[1]
        print(address)
    else:
        address=''
    return address

def get_login(service_name):
    curr_hostname=socket.gethostname()
    client2 = docker.DockerClient(base_url='unix://var/run/docker.sock')
    client = docker.APIClient(base_url='unix://var/run/docker.sock')
    service_object=client2.services.get(service_name)
    tasks=service_object.tasks(filters={'desired-state':'running'})
    print(tasks)
    result=[]
    if tasks==[]:
        return result

    else:
        for temp in tasks:
            if 'NodeID' in temp:
                node_object=client2.nodes.get(temp['NodeID'])
                node_info=client.inspect_node(node_object.id)
                hostname=node_info['Description']['Hostname']
                print(hostname)
                result.append(hostname)
                if hostname==curr_hostname:
                    container_object_list=client2.containers.list(filters={'name':service_name})
                
                    for x in container_object_list:
                       result.append(x.id)
                       return result

                else:
                    ssh = paramiko.SSHClient()
                    # Adding new host key to the local
                    # HostKeys object(in case of missing)
                    # AutoAddPolicy for missing host key to be set before connection setup.
                    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                    ssh.connect('192.168.8.155',  username='sakthi', password='Lucky@2002', timeout=3)
                    # Execute command on SSH terminal
                    # using exec_command
                    # get container id
                    cmd='docker ps -q -f name='+service_name
                    stdin, stdout, stderr = ssh.exec_command(cmd)
                    containerid=stdout.readlines()
                    containerid=containerid[0][:-1]
                    result.append(containerid)
                   
                    return result
            else:
                return result


                                                                                       
