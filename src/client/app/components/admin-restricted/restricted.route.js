angular.module('app.adminrestricted')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('layout.restricted', {
      url: '/adminrestricted',
      views: {
        'layout@content': {
          templateUrl: 'app/components/admin-restricted/restricted.html',
          controller: 'RestrictedController',
          controllerAs: 'vm'
        }
      }
    });
}
