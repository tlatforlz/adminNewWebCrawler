(function () {
  angular.module('app.admincategory')
    .controller('CategoryAdminController', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModal', CategoryAdminController]);

  function CategoryAdminController($q, $http, $state, $scope, $rootScope, $uibModal) {
    var vm = this;
    vm.listCategory = [];

    function getListCategory() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/category'
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getListCategory().then(
      function (res) {
        vm.listCategory = res.categorys;
      });

    vm.animationsEnabled = true;
    vm.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addNewCategory.html',
        controller: 'addNewCategory',
        controllerAs: 'vm',
        size: size
      }).closed.then(function () {
        getListCategory().then(
          function (res) {
            vm.listCategory = res.categorys;
          });
      });
    };

    vm.animationsEnabled = true;
    vm.editCate = function (id) {
      $rootScope.id = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editCategory.html',
        controller: 'editCategoryCate',
        controllerAs: 'vm'
      }).closed.then(function () {
        getListCategory().then(
          function (res) {
            vm.listCategory = res.categorys;
          });
      });;
    };

    vm.animationsEnabled = true;
    vm.conform = function (id) {
      $rootScope.id = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'conformCateDelete.html',
        controller: 'conformCateDelete',
        controllerAs: 'vm',
        size: 'sm'
      }).closed.then(function () {
        getListCategory().then(
          function (res) {
            vm.listCategory = res.categorys;
          });
      });
    };

    vm.animationsEnabled = true;
    vm.addPath = function (id) {
      $rootScope.cateId = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addPath.html',
        controller: 'addPath',
        controllerAs: 'vm',
        size: 'md'
      }).closed.then(function () {
        getListCategory().then(
          function (res) {
            vm.listCategory = res.categorys;
          });
      });
    };

    vm.animationsEnabled = true;
    vm.infoKey = function (id) {
      $rootScope.cateId = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'infoKey.html',
        controller: 'infoKey',
        controllerAs: 'vm',
        size: 'md'
      }).closed.then(function () {
        getListCategory().then(
          function (res) {
            vm.listCategory = res.categorys;
          });
      });
    };
  }

  angular.module('app.admincategory')
    .controller('infoKey', ['$q', '$http', '$state', '$scope', '$uibModalInstance', '$rootScope', infoKey]);

  function infoKey($q, $http, $state, $scope, $uibModalInstance, $rootScope) {
    var vm = this;

    function getAll() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/category',
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getCategory(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/category/' + id,
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function deleteKey(id, data) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/removeKey/' + id,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function updateKey(id, pos, data) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/updateKey/' + id + '/' + pos,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.isDup = false;
    vm.editCate = function (id, key) {
      console.log(id + " " + key);
      updateKey($rootScope.cateId, id, {
        "key": key
      }).then(w => {
        if (w) {
          getCategory($rootScope.cateId).then(function (res) {
            vm.listKeys = res.category.keys;
          })
        } else {
          vm.isDup = true;
        }
      })
    }

    vm.conform = function (key) {
      console.log(key);
      deleteKey($rootScope.cateId, {
        "key": key
      }).then(w => {
        $uibModalInstance.close();
      }).catch(err => {
        getCategory($rootScope.cateId).then(function (res) {
          vm.listKeys = res.category.keys;
        })
      })
    }
    getCategory($rootScope.cateId).then(function (res) {
      vm.listKeys = res.category.keys;
    })
    vm.ok = function () {
      $uibModalInstance.close();
    };

  }

  angular.module('app.admincategory')
    .controller('addPath', ['$q', '$http', '$state', '$scope', '$uibModalInstance', '$rootScope', addPath]);

  function addPath($q, $http, $state, $scope, $uibModalInstance, $rootScope) {
    var vm = this;

    function add(category) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category',
        data: category
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getAll() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/category',
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function andPath(category, key) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/addKey/' + category,
        data: key
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.ok = function () {
      var data = {
        'key': vm.key
      };
      andPath($rootScope.cateId, data).then(function (res) {
        if (res) {
          vm.isShow = false;
          $uibModalInstance.close();
        } else {
          vm.isShow = true;
        }
      });
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.admincategory')
    .controller('addNewCategory', ['$q', '$http', '$state', '$scope', '$uibModalInstance', addNewCategory]);

  function addNewCategory($q, $http, $state, $scope, $uibModalInstance) {
    var vm = this;

    function add(category) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category',
        data: category
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    vm.ok = function () {
      var data = {
        'name': vm.name,
        'keys': vm.key
      };
      add(data).then(function (res) {
        if (res.message === 'CREATE_SUCCESS') {
          location.reload();
          $uibModalInstance.close();
        }
      }, function () {
        vm.isShow = true;
      });
    };

    vm.cancel = function () {
      $uibModalInstance.close();
    };
  }
  angular.module('app.admincategory')
    .controller('editCategoryCate', ['$q', '$http', '$state', '$stateParams', '$scope', '$rootScope', '$uibModalInstance', editCategory]);

  function editCategory($q, $http, $state, $stateParams, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function getCategory() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/category/' + $rootScope.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    getCategory().then(function (res) {
      vm.name = res.category.name;
      vm.key = res.category.keys;
    });

    function conformEdit() {
      var data = {
        'name': vm.name
      };
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: '/api/category/' + $rootScope.id,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    vm.ok = function () {
      conformEdit().then(function (res) {
        if (res.message === 'CREATE_SUCCESS') {
          $uibModalInstance.close();
        }
      }, function () {
        vm.isShow = true;
      });
    };

    vm.cancel = function () {
      $uibModalInstance.close();
    };
  }
  angular.module('app.admincategory')
    .controller('conformCateDelete', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', conformCateDelete]);

  function conformCateDelete($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function deleteCategory(category) {
      var deferred = $q.defer();
      $http({
        method: 'DELETE',
        url: '/api/category/' + $rootScope.id
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
