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

    function getRemove(name) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/crawl/getRemove/' + $stateParams.id + "/" + name,
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
      $rootScope.name = value;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showRemove.html',
        controller: 'showRemove',
        controllerAs: 'vm',
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
    }

    vm.add = function (value) {
      $rootScope.name = value;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addRemove.html',
        controller: 'addRemove',
        controllerAs: 'vm',
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
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

  angular.module('app.admincallspider')
    .controller('showRemove', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', 'NgTableParams', showRemove]);

  function showRemove($q, $http, $state, $scope, $rootScope, $uibModalInstance, NgTableParams) {
    var vm = this;

    function getRemove(name) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/crawl/getRemove/' + $rootScope.spiderId + "/" + name,
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getRemove($rootScope.name).then(w => {
      vm.listKeys = w;
    })
    vm.ok = function () {
      $uibModalInstance.close();
    };
  }

  angular.module('app.admincategory')
    .controller('addRemove', ['$q', '$http', '$state', '$scope', '$uibModalInstance', '$rootScope', addRemove]);

  function addRemove($q, $http, $state, $scope, $uibModalInstance, $rootScope) {
    var vm = this;

    function add(data) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/crawl/addRemove/' + $rootScope.spiderId + "/" + $rootScope.name,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.ok = function () {
      var data = {
        'selector': vm.selector,
        'spiderId': $rootScope.spiderId,
        'name': $rootScope.name
      };
      add(data).then(function (res) {
        if (res === true) {
          $uibModalInstance.close();
        } else {
          vm.isShow = true;
        }
      }, function () {
        vm.isShow = true;
      });
    };

    vm.cancel = function () {
      $uibModalInstance.close();
    };
  }
})();
