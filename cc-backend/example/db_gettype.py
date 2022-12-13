import sqlalchemy as db
from . import db_config

# find deployment type given service name from db


def get_service_type(servicename):
    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')

    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'

    engine = db.create_engine(connection_str, pool_pre_ping=True)

    # get details from services table

    sql = db.text(
        f'select deployment_type from services where name="{servicename}"')
    result = engine.execute(sql).fetchall()

    for row in result:

        # converting sql output to dict
        x = row._asdict()
        type = x['deployment_type']

    return type
