import sqlalchemy as db
from python_on_whales import docker

def service_actions(service_name,action):
    
    # for starting service
    if action=="start":

        config = {
            # 'host': '172.24.0.2',
            'host':'mysql_container_cc',
            # 'host': 'db',
            'port': '3306',
            'user': 'root',
            'password': 'helloworld',
            'database': 'testapp'
        }
        db_user = config.get('user')
        db_pwd = config.get('password')
        db_host = config.get('host')
        db_port = config.get('port')
        db_name = config.get('database')
    
        connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'
    
        engine = db.create_engine(connection_str, pool_pre_ping=True)
     
        
        # find name of stack file coresponding to service from db

        sql = db.text(f'select stack_file_name from services where name="{service_name}"')
    
        # Fetch all the records
        rs = engine.execute(sql).fetchall()   
        result=''
        for row in rs:
            result=str(row)
            result=result[2:-3]
        
        # stack files are usually in .yml or .yaml format
        filename=result+".yml"

        task=docker.stack.deploy(name="vsmaps",compose_files=[f'/data/stack/{filename}'])
        

    # stop a docker service
    else:
        
        my_docker_service = docker.service.inspect(service_name)
        task=my_docker_service.remove()
        

    return task
        
