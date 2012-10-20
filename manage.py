#!/usr/bin/env python
import os
import sys

python_path = os.path.join(
        os.path.realpath(os.path.dirname(__file__)),
        'studynet'
        )

apps_path = os.path.join(
        os.path.realpath(os.path.dirname(__file__)),
        'studynet/apps'
        )

lib_path = os.path.join(
        os.path.realpath(os.path.dirname(__file__)),
        'studynet/lib'
        )

sys.path.insert(0, python_path)
sys.path.insert(0, apps_path)
sys.path.insert(0, lib_path)

if __name__ == "__main__":

# Settings switching
    if not os.environ.has_key('HEROKU'): os.environ['HEROKU'] = 'false'
    if os.environ['HEROKU'] == "true":
        settings_location = "studynet.configs.heroku.settings"
    elif os.environ['PLSMLAB'] == 'true':
        settings_location = "studynet.configs.heroku.settings"
    else:
        settings_location = "studynet.configs.common.settings"
    print "Using setting: %s" % settings_location
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_location)

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
