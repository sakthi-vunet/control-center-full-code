import sqlalchemy as db
import json
import pandas as pd
import numpy as np
from python_on_whales import docker

def update_hosts(host_item):

    
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
    sql = db.text(f"SELECT labels from hosts where name='{host_item['name']}'")
 
    # Fetch all the records
    result = engine.execute(sql).fetchall()
    
    # View the records

    for x in result:
        temp=x._asdict()


    
    old_labels=json.loads(temp['labels'])
    new_labels=host_item['labels']

    print("Old labels",old_labels)
    print("New Labels",new_labels)
    

    l1=np.array(old_labels)
    l2=np.array(new_labels)

    temp_rm_labels=np.setdiff1d(l1, l2)
    temp_add_labels=np.setdiff1d(l2,l1)
    print("Labels to be removed",temp_rm_labels)
    print("Labels to be added",temp_add_labels)

    add_labels={}
    for i in temp_add_labels:
        add_labels[i]='true'

    ### making the change in the table
    meta = db.MetaData(bind=engine)
    db.MetaData.reflect(meta)
    meta.create_all(engine)
    HOSTS = meta.tables['hosts']
 
    # update
    u = db.update(HOSTS)
    u = u.values({"labels": host_item['labels']})
    u = u.where(HOSTS.c.name == host_item['name'])
    engine.execute(u)
 
    ### making the change in docker
    docker.node.update(host_item['name'],labels_add=add_labels,rm_labels=temp_rm_labels)
    
        
    
    # to check updation
    sql = db.text("SELECT * from hosts")
 
    # Fetch all the records
    result = engine.execute(sql).fetchall()
 
    # View the records
    for record in result:
        print("\n", record)

    
    