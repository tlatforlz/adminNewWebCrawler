(function () {
  angular.module('app.adminurls')
    .controller('UrlController', ['$q', '$http', '$state', '$stateParams', '$scope', '$rootScope', '$uibModal', UrlController]);

  function UrlController($q, $http, $state, $stateParams, $scope, $rootScope, $uibModal) {
    var vm = this;
    vm.urls = [];

    function getListUrl() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/url'
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getListUrl().then(
      function (res) {
        vm.urls = res.urls;
      });

    vm.animationsEnabled = true;
    vm.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addNewUrl.html',
        controller: 'addNewUrl',
        controllerAs: 'vm',
        size: size
      }).closed.then(function () {
        getListUrl().then(
          function (res) {
            vm.urls = res.urls;
          });
      });
    };

    vm.animationsEnabled = true;
    vm.moreInformation = function (id) {
      $rootScope.id = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'moreInformation.html',
        controller: 'moreInformation',
        controllerAs: 'vm',
        size: 'lg'
      }).closed.then(function () {
        getListUrl().then(
          function (res) {
            vm.urls = res.urls;
          });
      });
    };

    vm.animationsEnabled = true;
    vm.conform = function (id) {
      $rootScope.id = id;
      console.log(id);
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'conformDelete.html',
        controller: 'conformDelete2',
        controllerAs: 'vm',
        size: 'sm'
      }).closed.then(function () {
        getListUrl().then(
          function (res) {
            vm.urls = res.urls;
          });
      });
    };
  }


  angular.module('app.adminurls')
    .controller('addNewUrl', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', addNewUrl]);

  function addNewUrl($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function addNewUrl(url) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/url',
        data: url
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.ok = function () {
      var url = {
        'title': vm.title,
        'hostname': vm.hostname
      }
      addNewUrl(url).then(function (res) {
        if (res.message === 'CREATE_SUCCESS') {
          $uibModalInstance.close();
        }
      }, function () {
        vm.isShow = true;
      })
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.adminurls')
    .controller('moreInformation', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', moreInformation]);

  function moreInformation($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function urlInformation(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/url/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    urlInformation($rootScope.id).then(function (res) {
      vm.urlId = res.url._id;
      vm.urlTitle = res.url.title;
      vm.urlHostname = res.url.hostname;
      vm.path = res.url.path;
    });

    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.adminurls')
    .controller('conformDelete2', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', conformDelete2]);

  function conformDelete2($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function deleteCategory(category) {
      var deferred = $q.defer();
      $http({
        method: 'DELETE',
        url: '/api/url/' + $rootScope.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    vm.ok = function () {
      deleteCategory().then(function (res) {
        if (res.message === 'DELETE_SUCCESS') {
          $uibModalInstance.close();
        }
      }, function () {
        vm.isShow = true;
      });
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
