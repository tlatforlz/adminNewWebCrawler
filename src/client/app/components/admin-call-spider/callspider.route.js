angular.module('app.admincallspider')
  .config(adminloginConfig);

function adminloginConfig($stateProvider) {
  $stateProvider
    .state('admincallspider', {
      url: '/admincallspider/:id',
      views: {
        "layout@content": {
          templateUrl: 'app/components/admin-call-spider/callspider.html',
          controller: 'CallSpiderController',
          controllerAs: 'vm'
        }
      }

    });
}
