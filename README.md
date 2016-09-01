# CouchDB configurator

Configures a webservice using a CouchDB database in a Docker container. Includes a Dockerfile that manages setting up and uploading the [couchapp](https://couchapp.readthedocs.io/en/latest/) to a CouchDB database. The configuration options are set using [AngularJS schema form](http://schemaform.io).

## Installation

First, install Node.js package manager `npm`. Then run

```shell
npm install -g npm bower gulp
npm install
bower install
```
To install dependencies.

To build, run
```shell
gulp
docker build -t nlesc/couchdb-configurator .
```

And to run
```shell
docker run --name conf -p 5984:5984 -i nlesc/couchdb-configurator
```

The app is then available on `http://$(docker-machine ip):5984/configurator/_design/configurator/index.html`. To make configuration persistent, even when the process is removed, run

```shell
docker run --name conf -p 5984:5984 -i -v couchdb-configurator:/usr/local/var/lib/couchdb -v couchdb-configurator-etc:/usr/local/etc/couchdb nlesc/couchdb-configurator
```

## How to use

On the first form, an admin user needs to be created. Then values can be filled in for the form. Value of configuration
`valueName` will be available as the `settings` property of the
`http://$(docker-machine ip):5984/configuration/valueName` JSON object, when logged in as the admin user.

## How to modify

Update the `data/configForm/form.json` and `data/configForm/schema.json`, following the specification of <http://schemaform.io>. These will contain the values that the CouchDB database needs to store. Run the Docker build command again to update the values to be stored.

To test this configuration locally, run

```shell
gulp serve
```
