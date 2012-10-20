env:
	. ~/env/nccu/bin/activate

runserver:
	./manage.py runserver 0.0.0.0:8080

runfcgi:
	./manage.py runfcgi host=0.0.0.0 port=8080

