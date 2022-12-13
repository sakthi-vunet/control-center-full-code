import sqlalchemy as db
import json
import pandas as pd
import numpy as np
from python_on_whales import docker
from . import db_config

# delete host from db


def delete_hosts(host_name):

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(
        connection_str, pool_size=10, max_overflow=20, pool_pre_ping=True)

    # delete host using host name match
    sql = db.text(f"delete from hosts where name='{host_name}'")

    try:
        engine.execute(sql).fetchall()
        result = 'deletion successful'

    except:
        result = 'deletion failed'

    return result
