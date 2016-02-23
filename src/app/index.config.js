(function() {
  'use strict';

  angular
    .module('simCityAdmin')
    // .value('couchdbPort', 5984)
    // .value('couchdbHost', 'localhost')
    .config(config);

  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
