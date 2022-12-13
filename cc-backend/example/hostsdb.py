import sqlalchemy as db
from . import db_config

# get host details from db


def sqlconnect():
    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(connection_str, pool_pre_ping=True)

   # fetch all columns from host table
    sql = db.text("SELECT * from hosts")

    # Fetch all the records
    result = engine.execute(sql).fetchall()

    return result
