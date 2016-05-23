FROM klaemo/couchdb:1.6.1
MAINTAINER j.borgdorff@esciencecenter.nl

RUN apt-get update -yq \
    && apt-get install -yq python-pip openssh-client python-dev

RUN pip install couchapp

ADD dist /usr/src/couchapp
RUN chown -R couchdb:couchdb /usr/src/couchapp
ADD run.sh /configurator_entrypoint.sh
RUN chmod +x /configurator_entrypoint.sh
ENV DB http://localhost:5984/configurator
ENV CONFDB http://localhost:5984/configuration

ADD data/configForm/schema.json /usr/src/couchapp/_attachments/configForm
ADD data/configForm/form.json /usr/src/couchapp/_attachments/configForm

ONBUILD ADD data/configForm/schema.json /usr/src/couchapp/_attachments/configForm
ONBUILD ADD data/configForm/form.json /usr/src/couchapp/_attachments/configForm

WORKDIR /var/lib/couchdb
ENTRYPOINT ["/configurator_entrypoint.sh"]
CMD ["couchdb"]
