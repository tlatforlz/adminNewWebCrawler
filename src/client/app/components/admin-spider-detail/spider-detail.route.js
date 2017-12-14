angular.module('app.adminspiderdetail')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('layout.adminspiderdetail', {
      url: '/adminspiderdetail/:id',
      views: {
        'layout@content': {
          templateUrl: 'app/components/admin-spider-detail/spider-detail.html',
          controller: 'AdminSpiderDetail',
          controllerAs: 'vm'
        }
      }
    });
}
