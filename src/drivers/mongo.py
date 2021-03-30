import pymongo
from src.config import getConfig
from urllib.parse import quote_plus

config = getConfig()

mogoclient = pymongo.MongoClient('mongodb://%s:%s@%s:%s/%s' % (
    quote_plus(config["mongo"]["user"]),quote_plus(config["mongo"]["password"]),config["mongo"]["host"],config["mongo"]["port"], config["mongo"]["default_database"]
))

class mdb():
    test=mogoclient["test"]

    def __getattr__(self, attr):
        # 只有下面这些数据库可以用
        if attr in ('test'):
            return mogoclient[attr]
        else:
            raise AttributeError('Unknow mongo database : %s' % attr)