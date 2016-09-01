(function() {
  'use strict';

  angular
    .module('dockerCouchAdmin')
    .service('CouchAdminService', CouchAdminService);

  /** @ngInject */
  function CouchAdminService($http, $q) {
    var vm = this;

    vm.createAdmin = createAdmin;
    vm.checkHasAdmins = checkHasAdmins;
    vm.hasAdmins = undefined;
    vm.putSecurity = putSecurity;
    vm.createDatabase = createDatabase;

    function createAdmin(username, password) {
      return $http.put('/_config/admins/' + username, '"' + password + '"').then(function(response) {
        // HTTP status code Success
        if (response.status !== 200) {
          return $q.reject(response);
        }
        vm.hasAdmins = true;
        return response;
      });
    }

    function createDatabase(database, securityObject) {
      var url = '/' + database;
      return $http.get(url + '/_security')
        .then(function(response) {
            // open access
            return (
              !!securityObject && (
                angular.equals({}, response.data) || (
                  response.data.members.names.length === 0 &&
                  response.data.members.roles.length === 0)));
          }, function(response) {
            // database does not exist
            if (response.status === 404) {
              return $http.put(url)
                .then(function() { return !!securityObject; });
            } else {
              return $q.reject(response);
            }
          })
        .then(function(isPublic) {
          if (isPublic) {
            return putSecurity(database, securityObject);
          }
        });
    }

    function putSecurity(database, securityObject) {
      var sec = angular.merge({
        admins: {names: [], roles: []},
        members: {names: [], roles: []}
      }, securityObject);
      return $http.put('/' + database + '/_security', sec);
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
