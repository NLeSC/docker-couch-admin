(function(){
  'use strict';

  angular
    .module('simCityAdmin')
    .service('ConfigFormService', ConfigFormService);

    /** @ngInject */
    function ConfigFormService($resource, $q, CouchService) {
      function getDatabaseEntries(schema) {
        var ids = Object.keys(schema.properties);

        return CouchService.bulkGet(ids)
          .then(function(response) {
            return response.rows
              .map(ignoreNotFound)
              .map(separateSettingsAndMetadata);
          });
      }

      function ignoreNotFound(err) {
        if (doc.error) {
          return {};
        }
        if (doc.doc.deleted) {
          delete doc.doc.deleted;
        }
        return doc.doc;
      }

      function separateSettingsAndMetadata(data) {
        var separatedData = {
          settings: data.settings || {},
          metadata: data
        };
        delete separatedData.metadata.settings;
        return separatedData;
      }

      function getObject(obj) {
        if (typeof obj === 'object') {
          return $q.when(obj);
        } else {
          return $resource(obj).get();
        }
      }
    }
})();
