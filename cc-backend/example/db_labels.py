import sqlalchemy as db
import pandas as pd
from . import db_config

# get various label names from db


def getfromdb_labels():

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(connection_str, pool_pre_ping=True)

    rs = engine.raw_connection()
    cursor = rs.cursor()

    # using cursor as data gets truncated when read as object

    cursor.execute(
        "select value from control_center_attributes where name='labels'")
    data = cursor.fetchall()

    frame = []
    for row in data:
        frame.append(row)

    return pd.DataFrame(frame)
