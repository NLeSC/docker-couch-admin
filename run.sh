#!/bin/bash

# initialize database in background
(sleep 3   # first wait until database has started
  # Database exists?
  if ! curl -sfI $DB; then
    # Upload website
    couchapp push /usr/src/couchapp $DB
  fi

  # SSH keypair is generated?
  if ! curl -sfI $DB/sshKeyPair; then
    CURL_ARGS=""
    KEY_FILE="/usr/src/couchapp/config_rsa"

    # generate and upload SSH keys, then store key files
    ssh-keygen -q -N "" -f $KEY_FILE -t rsa -b 4096 -C "couchdb-master@configurator.esciencecenter.nl" &&
    curl -X POST --silent -H "Content-Type: application/json" "$DB" --data-binary "{\"_id\": \"sshKeyPair\", \"privateKey\": \"$(cat $KEY_FILE | tr '\n' '*' | sed -e 's/\*/\\n/g')\", \"publicKey\": \"$(cat $KEY_FILE.pub | tr '\n' '*' | sed -e 's/\*/\\n/g')\"}"
  fi) &
# original behaviour
exec tini -- /docker-entrypoint.sh "$@"
