import sqlalchemy as db
from . import db_config

# gt deployemnet type given service name from db
def getfromdb(item,attr):

    config = db_config.config
    db_user = config.get('user')
    db_pwd = config.get('password')
    db_host = config.get('host')
    db_port = config.get('port')
    db_name = config.get('database')
   
    connection_str = f'mysql+pymysql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'
   
    engine = db.create_engine(connection_str, pool_pre_ping=True)
    connection = engine.connect()

    # get deployement type from typemapping table with match service name
    metadata = db.MetaData(bind=engine)
    metadata.reflect(only=['typemapping'])

    test_table = metadata.tables['typemapping']

    result=''
    with engine.connect() as con:

        rs = con.execute(f"SELECT {attr} FROM typemapping where LOWER(serviceName)=LOWER('{item}')")
       
    for row in rs:

        #  list to row conversion
        result=str(row)
        result=result[2:-3]
        
        return result

    return result

