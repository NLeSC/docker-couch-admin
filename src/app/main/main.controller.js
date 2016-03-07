(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1452170777550;

    this.activate = function() {
        $timeout(function() {
          vm.classAnimation = 'rubberBand';
        }, 4000);
      };
  }

})();
