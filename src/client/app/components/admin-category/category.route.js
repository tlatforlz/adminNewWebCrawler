angular.module('app.admincategory')
  .config(admincategoryConfig);

function admincategoryConfig($stateProvider) {
  $stateProvider
    .state('layout.categories', {
      url: '/admincategory',
      views: {
        'layout@content': {
          templateUrl: 'app/components/admin-category/category.html',
          controller: 'CategoryAdminController',
          controllerAs: 'vm'
        }
      },
      reload: true

    });
}
