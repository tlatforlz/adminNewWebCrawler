angular.module('app.adminlogin')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('adminlogin', {
      url: '/adminlogin',
      views: {
        "login": {
          templateUrl: 'app/components/admin-login/adminlogin.html',
          controller: 'AdminLoginController',
          controllerAs: 'vm'
        }
      }

    });
}
