import sqlalchemy as db  
import json
    
def get_service_db():
    config = {
        # 'host': '172.21.0.2',
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
    
    
    # get details from services table

    sql = db.text(f'select * from services')
    result = engine.execute(sql).fetchall()   


    service_db=[]
    
    for row in result:

    # converting sql output to dict
        x=row._asdict()
        service_db.append(x)
    
    # print(service_db)
    return service_db

get_service_db()

    