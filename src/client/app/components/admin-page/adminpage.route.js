angular.module('app.adminpage')
  .config(adminpageConfig);

function adminpageConfig($stateProvider) {
  $stateProvider
    .state('adminpage', {
      url: '/adminpage',
      views: {
        "layout@content": {
          templateUrl: '/src/client/app/components/admin-page/adminpage.html',
          controller: 'AdminPageController',
          controllerAs: 'vm'
        }
      },
      reload: true
    });
}
