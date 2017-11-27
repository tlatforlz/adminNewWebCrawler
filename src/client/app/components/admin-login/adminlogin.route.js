angular.module('app.adminlogin')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('adminlogin', {
      url: '/',
      views: {
        'main': {
          templateUrl: 'app/components/admin-login/adminlogin.html',
          controller: 'AdminLoginController',
          controllerAs: 'vm'
        }
      }

    });
}
