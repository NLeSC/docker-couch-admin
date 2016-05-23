(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    .directive('cfLoginStatus', userLogin);

  /** @ngInject */
  function userLogin() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/loginStatus/loginStatus.html',
      scope: {
          // creationDate: '='
      },
      controller: LoginDirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function LoginDirectiveController(CouchService, CouchAdminService, $location, couchdbDatabase, toastr) {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.couch = CouchService;
      vm.username = '';
      vm.password = '';
      vm.login = login;
      vm.logout = logout;
      vm.createAndLogin = createAndLogin;
      vm.hasAdmins = 'unknown';

      activate();

      function logout() {
        return CouchService.logout();
      }
      function login() {
        return CouchService.login(vm.username, vm.password)
          .finally(function() { vm.password = ''; })
          .then(function () { $location.path('/'); })
          .then(null, function() { toastr.error("Authentication error."); });
      }
      function createAndLogin() {
        var username = vm.username;
        return CouchAdminService.createAdmin(username, vm.password)
          .then(function() { vm.hasAdmins = 'yes'; })
          .then(vm.login)
          .then(createDatabase(couchdbDatabase, username));
      }

      function createDatabase(db, username) {
        return function() {
          var sec = {
            admins: {names: [username]},
            members: {names: [username], roles: ['configurator']}
          };
          return CouchAdminService.createDatabase(db, sec);
        };
      }

      function activate() {
        CouchService.getUsername().then(function(name) {
          if (name) {
            vm.hasAdmins = 'yes';
            vm.username = name;
          } else {
            CouchAdminService.checkHasAdmins().then(function (hasAdmins) {
              vm.hasAdmins = hasAdmins ? 'yes' : 'no';
            });
          }
        });
      }
    }
  }

})();
