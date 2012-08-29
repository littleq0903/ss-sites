import os

from ..common.settings import *

import dj_database_url

DATABASES = {
        'default': dj_database_url.config(default=os.environ["HEROKU_POSTGRESQL_COBALT_URL"])
}

