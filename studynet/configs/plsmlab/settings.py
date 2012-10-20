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
FACEBOOK_APP_ID = ''
FACEBOOK_APP_SECRET = ''


