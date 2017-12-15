(function () {
  angular.module('app.adminspiderdetail')
    .controller('AdminSpiderDetail', AdminSpiderDetail);

  AdminSpiderDetail.$inject = ['$q', '$http', '$state', '$stateParams', '$scope', 'NgTableParams',
    '$uibModal', '$rootScope'
  ];

  function AdminSpiderDetail($q, $http, $state, $stateParams, $scope, NgTableParams, $uibModal, $rootScope) {
    var vm = this;

    $rootScope.spiderId = $stateParams.id

    function getSpider(spiderId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/' + $stateParams.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function saveSpider(data) {
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: '/api/crawl',
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getSpider().then(w => {
      vm.gopage = w.spider.spiderInformation.nextPage.selector;
      vm.image = w.spider.spiderInformation.image.selector;
      vm.title = w.spider.spiderInformation.title.selector;
      vm.content = w.spider.spiderInformation.content.selector;
      vm.author = w.spider.spiderInformation.author.selector;
      vm.createdate = w.spider.spiderInformation.createDate.selector;
      vm.des = w.spider.spiderInformation.description.selector;
    })

    vm.edit = function (value) {
      console.log(value);
    }

    vm.save = function () {
      var data = {
        'spiderId': $rootScope.spiderId,
        'title': vm.title,
        'content': vm.content,
        'author': vm.author,
        'createddate': vm.createdate,
        'nextpage': vm.gopage,
        'image': vm.image,
        'description': vm.des
      }
      saveSpider(data).then(function () {
        getSpider().then(w => {
          console.log(w);
          vm.gopage = w.spider.spiderInformation.nextPage.selector;
          vm.image = w.spider.spiderInformation.image.selector;
          vm.title = w.spider.spiderInformation.title.selector;
          vm.content = w.spider.spiderInformation.content.selector;
          vm.author = w.spider.spiderInformation.author.selector;
          vm.createdate = w.spider.spiderInformation.createDate.selector;
          vm.des = w.spider.spiderInformation.description.selector;
        })

      })
    }
  }

})();
