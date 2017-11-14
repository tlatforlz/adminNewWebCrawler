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

    vm.animationsEnabled = true;
    vm.callSpider = function (id) {
      $rootScope.id = id;
      console.log(id);
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'conformCallUrl.html',
        controller: 'conformCallUrl',
        controllerAs: 'vm',
        size: 'lg'
      }).closed.then(function () {
        getListUrl().then(
          function (res) {
            vm.urls = res.urls;
          });
      });
    }
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

  angular.module('app.adminurls')
    .controller('conformCallUrl', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', conformCallUrl]);

  function conformCallUrl($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function getCategories(id) {
      console.log(id);
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/callSpiderCategory/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getAllPath(id) {
      console.log('call me : ' + id);
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
    };

    function addPath(path) {
      var deferred = $q.defer();
      var data = {
        "namePath": path
      };
      console.log(data);
      $http({
        method: 'POST',
        url: '/api/url/addPath/' + $rootScope.id,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function removePath(path) {
      var deferred = $q.defer();
      var data = {
        "namePath": path
      };
      console.log(data);
      $http({
        method: 'POST',
        url: '/api/url/removePath/' + $rootScope.id,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.remove = function (value) {
      console.log(value + ' - remove');
      getAllPath($rootScope.id).then(function (res_url) {
        removePath(value.split(res_url.url.hostname)[1]).then(function (res2) {
          getCategories($rootScope.id).then(function (res) {
            getAllPath($rootScope.id).then(function (res_url) {
              vm.listPath = res.arrayPath;
              var length = vm.listPath.length;
              vm.result = [];
              var seen = new Set();
              var index = 0;
              vm.listPath.forEach(w => {
                checkAdd(res_url.url.path, w)
                  .then(function (res) {
                    console.log('haha ' + res);
                    if (!seen.has(w)) {
                      if (res === true) {
                        vm.result.push({
                          'add': false,
                          'remove': true,
                          'value': w
                        });
                        vm.result.sort(function (a, b) {
                          return a.value.length - b.value.length;
                        });
                      }
                    }
                    seen.add(w);
                  })
                  .catch(function () {
                    console.log('hii');
                    if (!seen.has(w)) {
                      vm.result.push({
                        'add': true,
                        'remove': false,
                        'value': w
                      });
                      vm.result.sort(function (a, b) {
                        return a.value.length - b.value.length;
                      });
                    }
                    seen.add(w);
                  })
              });
            });
          });
        });
      })
    }
    vm.add = function (value) {
      getAllPath($rootScope.id).then(function (res_url) {
        addPath(value.split(res_url.url.hostname)[1]).then(function (res2) {
          getCategories($rootScope.id).then(function (res) {
            getAllPath($rootScope.id).then(function (res_url) {
              vm.listPath = res.arrayPath;
              var length = vm.listPath.length;
              vm.result = [];
              var seen = new Set();
              var index = 0;
              vm.listPath.forEach(w => {
                checkAdd(res_url.url.path, w)
                  .then(function (res) {
                    console.log('haha ' + res);
                    if (!seen.has(w)) {
                      if (res === true && w.split(res_url.hostname)[1] !== '/') {
                        vm.result.push({
                          'add': false,
                          'remove': true,
                          'value': w
                        });
                        vm.result.sort(function (a, b) {
                          return a.value.length - b.value.length;
                        });
                      }
                    }
                    seen.add(w);
                  })
                  .catch(function () {
                    console.log('hii');
                    if (!seen.has(w)) {
                      vm.result.push({
                        'add': true,
                        'remove': false,
                        'value': w
                      });
                      vm.result.sort(function (a, b) {
                        return a.value.length - b.value.length;
                      });
                    }
                    seen.add(w);
                  })
              });
            });
          });
        });
      })
    };

    function checkAdd(arr, value) {
      var deferred = $q.defer();
      arr.forEach(w => {
        if (value.indexOf(w.namePath) !== -1) {
          deferred.resolve(true);
          return deferred.promise;
        }
      })
      deferred.reject(false);
      return deferred.promise;
    }

    getCategories($rootScope.id).then(function (res) {
      getAllPath($rootScope.id).then(function (res_url) {
        vm.listPath = res.arrayPath;
        var length = vm.listPath.length;
        vm.result = [];
        var seen = new Set();
        var index = 0;
        vm.listPath.forEach(w => {
          checkAdd(res_url.url.path, w)
            .then(function (res) {
              console.log('haha ' + res);
              if (!seen.has(w)) {
                if (res === true && w.split(res_url.hostname)[1] !== '/') {
                  vm.result.push({
                    'add': false,
                    'remove': true,
                    'value': w
                  });
                  vm.result.sort(function (a, b) {
                    return a.value.length - b.value.length;
                  });
                }
              }
              seen.add(w);
            })
            .catch(function () {
              console.log('hii');
              if (!seen.has(w)) {
                vm.result.push({
                  'add': true,
                  'remove': false,
                  'value': w
                });
                vm.result.sort(function (a, b) {
                  return a.value.length - b.value.length;
                });
              }
              seen.add(w);
            })
        });
        vm.result.sort(function (a, b) {
          return a.value.length - b.value.length;
        });
      });
    });
  }
})();
