from ..common.settings import *

import dj_database_url

DATABASES = {
        'default': dj_database_url.config(default='postgres://jhbsaudowefhif:s3SziM9NR1s2FdkX-g6Yf7G27-@ec2-107-22-164-173.compute-1.amazonaws.com:5432/d421lpe5fkgv6e')
}

