angular.module('app.adminspider')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('adminspider', {
      url: '/adminspider',
      views: {
        "content@layout": {
          templateUrl: 'app/components/admin-spider/spider.html',
          controller: 'SpiderController',
          controllerAs: 'vm'
        }
      }

    });
}
