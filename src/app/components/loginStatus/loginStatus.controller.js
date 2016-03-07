(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    .directive('loginStatus', userLogin);

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
    function LoginDirectiveController(CouchService, CouchAdminService, $location) {
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
          .then(function () { $location.path('/'); });
      }
      function createAndLogin() {
        return CouchAdminService.createAdmin(vm.username, vm.password)
          .then(function() { vm.hasAdmins = 'yes'; })
          .then(vm.login);
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
