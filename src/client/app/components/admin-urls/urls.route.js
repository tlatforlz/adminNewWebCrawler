angular.module('app.adminurls')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('layout.urls', {
      url: '/adminurls',
      views: {
        'layout@content': {
          templateUrl: 'app/components/admin-urls/urls.html',
          controller: 'UrlController',
          controllerAs: 'vm'
        }
      }
    });
}
