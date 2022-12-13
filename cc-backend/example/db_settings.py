
import sqlalchemy as db
import pandas as pd
from . import db_config

# get settings data fromm db


def getfromdb_settings():

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(connection_str, pool_pre_ping=True)

    # fetch data from host table

    sql = db.text("select name from hosts")

    # Fetch all the records

    result = engine.execute(sql).fetchall()

    # forming list of host names

    settings = {}
    host_list = []
    for i in result:
        x = i._asdict()
        host_list.append(x['name'])
    settings['hosts'] = host_list

    # fetch enabled services from services table

    sql = db.text("select name from services where status='enabled'")

    # Fetch all the records

    result = engine.execute(sql).fetchall()
    service_enabled_list = []
    for i in result:
        x = i._asdict()
        service_enabled_list.append(x['name'])

    settings['enabled_services'] = service_enabled_list\

    # fetch total number of expected instances ( sum expected instances for all services) from services table

    sql = db.text("select sum(expected_instances) from services")

    result = engine.execute(sql).fetchall()

    for i in result:
        x = i._asdict()
        settings['expected_instances'] = int(x['sum(expected_instances)'])

    return [settings]
