import sqlalchemy as db
import json
import pandas as pd
import numpy as np
from python_on_whales import docker

def delete_hosts(host_name):

    
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
    

    engine = db.create_engine(connection_str,pool_size=10, max_overflow=20, pool_pre_ping=True)
    
    # get current labels
    sql = db.text(f"delete from hosts where name='{host_name}'")
 
    # Fetch all the records
    result = engine.execute(sql).fetchall()
    
    # View the records
    if result==None:
        result='deletion successful'
    return result

    
    