(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    .directive('cfConfigForm', configForm);

  /** @ngInject */
  function configForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/configForm/configForm.html',
      scope: {
          form: '@',
          schema: '@'
      },
      controller: ConfigDirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ConfigDirectiveController($q, ConfigFormService, CouchService) {
      var vm = this;

      vm.formData = [];
      vm.schemaData = {};
      vm.model = {};
      vm.originalData = {};
      vm.metadata = {};
      vm.submit = submit;
      vm.saveDocs = saveDocs;

      activate();

      function submit(form) {
        if (form.$valid) {
          vm.saveDocs();
        }
      }

      function saveDocs() {
        var docs = [];
        Object.keys(vm.model).forEach(function(key) {
          if (!angular.equals(vm.model[key], vm.originalData[key])) {
            var doc = angular.extend({settings: vm.model[key]}, vm.metadata[key]);
            docs.push(doc);
          }
        });
        return CouchService.bulkPut(docs)
          .then(function(response) {
            var faulty = [];
            for (var i = 0; i < docs.length; i++) {
              if (response[i].ok) {
                var key = response[i].id;
                vm.metadata[key]._rev = response[i].rev;
                vm.originalData[key] = angular.copy(docs[i].settings);
              } else {
                faulty.push(response[i]);
              }
            }
            if (faulty.length > 0) {
              return $q.reject(faulty);
            }
          });
      }

      function activate() {
        ConfigFormService.getObject(vm.form).then(function(data) {
          vm.formData = data;
        });
        ConfigFormService.getObject(vm.schema).then(function(data) {
          vm.schemaData = data;
          return ConfigFormService.getDatabaseEntries(vm.schemaData)
            .then(function(entries) {
              entries.forEach(function(entry) {
                var key = entry.metadata._id;
                vm.originalData[key] = angular.copy(entry.settings);
                vm.model[key] = entry.settings;
                vm.metadata[key] = entry.metadata;
              });
            });
        });
      }
    }
  }
})();
