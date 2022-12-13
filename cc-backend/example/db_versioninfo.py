
import sqlalchemy as db
import pandas as pd
from . import db_config

# get version infromation from db


def getfromdb_versioninfo():

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(connection_str, pool_pre_ping=True)

    # fetch data from control center attributes table

    sql = db.text(
        "select * from control_center_attributes where name='Last_upgrade_time' or name='platform_version' or name='cc_version'")

    # Fetch all the records

    result = engine.execute(sql).fetchall()

    # forming key value pairs

    version_info = {}
    for i in result:
        x = i._asdict()
        version_info[x['name']] = x['value']

    return [version_info]
