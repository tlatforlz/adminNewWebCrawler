angular.module('app.adminnews')
  .config(newsConfig);

function newsConfig($stateProvider) {
  $stateProvider
    .state('layout.news', {
      url: '/adminnews',
      views: {
        "layout@content": {
          templateUrl: 'app/components/admin-news/news.html',
          controller: 'NewsController',
          controllerAs: 'vm'
        }
      }
    });
}
