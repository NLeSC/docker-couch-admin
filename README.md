# SIM-CITY webservice admin console

Configures the SIM-CITY webservice using a CouchDB database. Includes a Dockerfile that manages setting up and
uploading the couchapp to a CouchDB database.

## Installation

First, install Node.js with `npm`. Then run

```shell
npm install -g npm bower gulp
npm install
bower install
```
To install dependencies.

To run locally, run

```shell
gulp serve
```

Note that no CouchDB instance will be found then. To build, run
```shell
gulp
docker build -t nlesc/couchdb-configurator .
```

And to run
```shell
docker run --name conf -p 5984:5984 -i nlesc/couchdb-configurator
```

The app is then available on `http://$(docker-machine ip):5984/configurator/_design/configurator/index.html`.

## How to use

On the first form, an admin user needs to be created. Then values can be filled in for the form. Value of configuration
`valueName` will be available as the `settings` property of the
`http://$(docker-machine ip):5984/configurator/valueName` JSON object, when logged in as the admin user.

## How to modify

Update the `data/configForm/form.json` and `data/configForm/schema.json`, following the specification of
<http://schemaform.io>. These will contain the values that the CouchDB database needs to store. Run the Docker build
command again to update the values to be stored.
