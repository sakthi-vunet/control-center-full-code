import sqlalchemy as db

def getfromdb(item,attr):

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
   
    engine = db.create_engine(connection_str, pool_pre_ping=True)
    connection = engine.connect()

    metadata = db.MetaData(bind=engine)
    metadata.reflect(only=['typemapping'])

    test_table = metadata.tables['typemapping']

    result=''
    with engine.connect() as con:

        rs = con.execute(f"SELECT {attr} FROM typemapping where LOWER(serviceName)=LOWER('{item}')")
       
    for row in rs:
        result=str(row)
        result=result[2:-3]
        
        return result

    return result

