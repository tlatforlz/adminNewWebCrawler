angular.module('app.adminspider')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('layout.spider', {
      url: '/adminspider',
      views: {
        'layout@content': {
          templateUrl: 'app/components/admin-spider/spider.html',
          controller: 'SpiderController',
          controllerAs: 'vm'
        }
      }

    });
}
