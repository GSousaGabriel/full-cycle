FROM python:latest

WORKDIR /var/www

RUN apt-get update
RUN cd /var/www
RUN python -m pip install Django
RUN django-admin startproject mysite

WORKDIR /var/www/mysite

ENTRYPOINT [ "python", "manage.py", "runserver" ]
CMD ["0.0.0.0:8000"]