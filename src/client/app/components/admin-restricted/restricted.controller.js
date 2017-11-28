(function () {
  angular.module('app.adminrestricted')
    .controller('RestrictedController', ['$q', '$http', '$state', '$stateParams', '$scope', '$rootScope', '$uibModal', 'NgTableParams', RestrictedController]);

  function RestrictedController($q, $http, $state, $stateParams, $scope, $rootScope, $uibModal, NgTableParams) {
    var vm = this;

    vm.listRestrict = [];

    function getAllRestricted() {
      var defferred = $q.defer();
      $http({
        method: 'GET',
        url: 'api/restrict'
      }).then(function successCallback(res) {
        defferred.resolve(res.data);
      }, function () {
        defferred.reject(null);
      })
      return defferred.promise;
    }

    getAllRestricted().then(res => {
      vm.listRestrict = res;
      vm.tableParams = new NgTableParams({
        page: 1,
        count: 15,
        header: false
      }, {
        dataset: vm.listRestrict
      });
    });


    vm.animationsEnabled = true;
    vm.addNew = function () {
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addNewRestrict.html',
        controller: 'addNewRestrict',
        controllerAs: 'vm',
        size: 'md'
      }).closed.then(function () {
        getAllRestricted().then(res => {
          vm.listRestrict = res;
          vm.tableParams = new NgTableParams({
            page: 1,
            count: 15,
            header: false
          }, {
            dataset: vm.listRestrict
          });
        });
      });
    };

    vm.animationsEnabled = true;
    vm.edit = function (id) {
      $rootScope.id = id;

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editRestrict.html',
        controller: 'editRestrict',
        controllerAs: 'vm',
        size: 'md'
      }).closed.then(function () {
        getAllRestricted().then(res => {
          vm.listRestrict = res;
          vm.tableParams = new NgTableParams({
            page: 1,
            count: 15,
            header: false
          }, {
            dataset: vm.listRestrict
          });
        });
      });
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
        getAllRestricted().then(res => {
          vm.listRestrict = res;
          vm.tableParams = new NgTableParams({
            page: 1,
            count: 15,
            header: false
          }, {
            dataset: vm.listRestrict
          });
        });
      });
    };

  }

  angular.module('app.adminrestricted')
    .controller('addNewRestrict', ['$q', '$http', '$state', '$scope', '$uibModalInstance', addNewRestrict]);

  function addNewRestrict($q, $http, $state, $scope, $uibModalInstance) {
    var vm = this;

    function add(restrict) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/restrict',
        data: restrict
      }).then(function successCallback(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.ok = function () {
      var data = {
        'name': vm.name,
        'level': vm.level
      };
      if (vm.name === '' || vm.name == undefined || vm.level === '' || vm.level == undefined || vm.name === null || vm.level == null) {
        vm.isShow = true;
      } else {
        var x = parseInt(vm.level);
        if (Number.isInteger(x)) {
          add(data).then(function (res) {
            if (res === true) {
              $uibModalInstance.close();
            }
          }, function () {
            vm.isShow = true;
          });
        } else {
          vm.isShow = true;
        }
      }
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


  angular.module('app.adminrestricted')
    .controller('conformCateDelete', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', conformCateDelete]);

  function conformCateDelete($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;
    console.log('fuck');

    function deleteCategory(category) {
      var deferred = $q.defer();
      $http({
        method: 'DELETE',
        url: '/api/restrict/' + $rootScope.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    vm.ok = function () {
      deleteCategory().then(function (res) {
        $uibModalInstance.close();
      }, function () {
        vm.isShow = true;
      });
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.adminrestricted')
    .controller('editRestrict', ['$q', '$http', '$state', '$scope', '$uibModalInstance', '$rootScope', editRestrict]);

  function editRestrict($q, $http, $state, $scope, $uibModalInstance, $rootScope) {
    var vm = this;

    function edit(id, restrict) {
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: '/api/restrict/' + id,
        data: restrict
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getId(id) {
      var defferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/restrict/' + id
      }).then(function successCallback(res) {
        defferred.resolve(res.data);
      }, function () {
        defferred.reject(null);
      });
      return defferred.promise;
    }

    getId($rootScope.id).then(res => {
      vm.name = res.name;
      vm.level = res.level;
    })
    vm.ok = function () {
      var data = {
        'name': vm.name,
        'level': vm.level
      };
      if (vm.name === '' || vm.name == undefined || vm.level === '' || vm.level == undefined || vm.name === null || vm.level == null) {
        vm.isShow = true;
      } else {
        var x = parseInt(vm.level);
        if (Number.isInteger(x)) {
          edit($rootScope.id, data).then(function (res) {
            if (res === true) {
              $uibModalInstance.close();
            }
          }, function () {
            vm.isShow = true;
          });
        } else {
          vm.isShow = true;
        }
      }
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
