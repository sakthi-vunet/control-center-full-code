import sqlalchemy as db
import json
import pandas as pd

def insert_hosts(host_item):

    
    config = {
        # 'host': '172.24.0.2',
        # 'host': 'db',
        'host':'mysql_container_cc',
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
    con=engine.connect()


    # getting details in the required format
    details={}
    details['OS']=host_item['OS']
    details['memory']=host_item['memory']
    details['total_storage']=host_item['total_storage']
    details['processor_type']=host_item['processor_type']
    details['number_of_cores']=host_item['number_of_cores']
    storage_mounts_temp={}
    storage_mounts_temp["Mount_point"]=host_item['mount_point']
    storage_mounts_temp['Storage']=host_item['storage']
    details['storage_mounts']=storage_mounts_temp
    temp=json.dumps(host_item['labels'])
    details=json.dumps(details)
    temp=str(temp)
    details=str(details)

    id=con.execute('INSERT INTO hosts(name,description,ip_address,host_type,labels,details) VALUES ("'+host_item['name']+'","'+host_item['description']+'","'+host_item['Ipaddress']+'","'+host_item['host_type']+'",'+"'"+temp+"'"+",'"+details+"')")
    print("Row Added  = ",id.rowcount)
    