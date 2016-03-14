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

ONBUILD ADD data/schema.json /usr/src/couchapp/_attachments
ONBUILD ADD data/form.json /usr/src/couchapp/_attachments

WORKDIR /var/lib/couchdb
ENTRYPOINT ["/configurator_entrypoint.sh"]
CMD ["couchdb"]
