from studynet.configs.common.settings import *


DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine',
        'NAME': 'socialstudy',
        'HOST': 'mongo.socialstudy'
    }
}


# TODO: to be determine
CHAT_SERVER_URL = 'http://chat.socialstudy/push'


# TODO: update facebook api tokens
FACEBOOK_APP_ID = '417930571597341'
FACEBOOK_APP_SECRET = '540a267f570397d2a36e1dd23a1bfc08'

TEMPLATE_DIRS = (
    '/home/ubuntu/repo/nccu-study-net/studynet/templates',
)


