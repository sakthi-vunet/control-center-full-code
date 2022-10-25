import docker

# function to remove label name from host 
def rm_label(nodeid,label):

    # docker client to communicate with docker daemon
    client = docker.DockerClient(base_url='unix://var/run/docker.sock')
    # getting node obj using node id
    nodeobj=client.nodes.get(nodeid)
    if nodeobj!=None:
        # current node spec
        node_spec=nodeobj.attrs['Spec']
        try:
            # removing given label from current spec 
            del_label=node_spec['Labels'].pop(label)

            # updating node spec after removing label from current spec
            nodeobj.update(node_spec)          

        # If label to be removed is not present in the first place
        except:
            print('Label is already not present')
        
        print(nodeobj.attrs)
    
    # if node with given node id does not exist
    else:
        print("Node not found")

