
import sqlalchemy as db
import pandas as pd
from . import db_config

def getfromdb_settings():

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')
   
    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'
   
    engine = db.create_engine(connection_str, pool_pre_ping=True)
    
    # fetch data from control center attributes table
    
    sql = db.text("select count(name) from hosts")
 
    # Fetch all the records

    result = engine.execute(sql).fetchall()   

    
    # forming key value pairs

    settings={}
    for i in result:
        x=i._asdict()       
        settings['hosts']=x['count(name)']
    
    sql = db.text("select count(name) from services where status='enabled'")
 
    # Fetch all the records

    result = engine.execute(sql).fetchall()   
    for i in result:
        x=i._asdict()       
        settings['enabled_services']=x['count(name)']
    
    sql = db.text("select sum(expected_instances) from services")
 
    # Fetch all the records

    result = engine.execute(sql).fetchall()   

    for i in result:
        x=i._asdict()       
        settings['expected_instances']=int(x['sum(expected_instances)'])


    return [settings]

  
# print(getfromdb_settings())
