(function(){
  'use strict';

  angular
    .module('dockerCouchAdmin')
    .service('ConfigFormService', ConfigFormService);

    /** @ngInject */
    function ConfigFormService($http, $q, CouchService) {
      var vm = this;

      vm.getObject = getObject;
      vm.getDatabaseEntries = getDatabaseEntries;

      function getDatabaseEntries(schema) {
        var ids = Object.keys(schema.properties);

        return CouchService.bulkGet(ids)
          .then(function(response) {
            return response.rows
              .map(ignoreNotFound)
              .map(separateSettingsAndMetadata);
          });
      }

      function ignoreNotFound(doc) {
        if (doc.error) {
          return {_id: doc.key};
        }
        if (doc.doc.deleted) {
          delete doc.doc.deleted;
        }
        return doc.doc;
      }

      function separateSettingsAndMetadata(data) {
        var separatedData = {metadata: data};
        if (data.hasOwnProperty('settings')) {
          separatedData.settings = data.settings;
          delete separatedData.metadata.settings;
        }
        return separatedData;
      }

      function getObject(obj) {
        if (typeof obj === 'object') {
          return $q.when(obj);
        } else {
          return $http.get(obj).then(function(response) { return response.data; });
        }
      }
    }
})();
