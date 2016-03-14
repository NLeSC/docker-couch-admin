(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    .service('CouchAdminService', CouchAdminService);

  /** @ngInject */
  function CouchAdminService($http, $q) {
    var vm = this;

    vm.createAdmin = createAdmin;
    vm.checkHasAdmins = checkHasAdmins;
    vm.hasAdmins = undefined;

    function createAdmin(username, password) {
      return $http.put('/_config/admins/' + username, '"' + password + '"').then(function(response) {
        // HTTP status code Created
        if (response.status !== 200) {
          return $q.reject(response);
        }
        vm.hasAdmins = true;
        return response;
      });
    }

    function checkHasAdmins() {
      if (typeof vm.hasAdmins === 'undefined') {
        return $http.get('/_config/admins')
          .then(function(response) {
            if (response.status === 200) {  // HTTP status code Success
              vm.hasAdmins = Object.keys(response.data).length !== 0;
              return vm.hasAdmins;
            } else {
              return $q.reject(response);
            }
          }, function(response) {
            // HTTP status code Unauthorized means there are admins
            if (response.status === 401) {
              vm.hasAdmins = true;
              return true;
            } else {
              return $q.reject(response);
            }
          });
        } else {
          return $q.when(vm.hasAdmins);
        }
    }
  }
})();
