angular.module('app.layout')
  .config(layoutConfig);

function layoutConfig($stateProvider) {
  $stateProvider
    .state('layout', {
      views: {
        'main': {
          url: '',
          templateUrl: 'app/components/layout/layout.html',
          controller: 'layoutController',
          controllerAs: 'vm'
        }
      }
    })
}
