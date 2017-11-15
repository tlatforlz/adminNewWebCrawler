(function () {
  angular.module('app.admincallspider')
    .controller('CallSpiderController', CallSpiderController);

  CallSpiderController.$inject = ['$q', '$http', '$state', '$stateParams', '$scope', 'NgTableParams',
    '$uibModal', '$rootScope'
  ];

  function CallSpiderController($q, $http, $state, $stateParams, $scope, NgTableParams, $uibModal, $rootScope) {
    var vm = this;
    vm.listSpider = [];


    function getNewsSpider() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + $stateParams.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getSpider() {
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

    function call(name) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/' + name
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function update(name) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/' + name + '/update'
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function callUrl(name, id) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/' + name + '/' + id + '/updateurl'
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsNone() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsNone/' + $stateParams.id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }



    function updateNews(id, data) {
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: '/api/news/' + id,
        data: data
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.checkAction = function (active, _id) {
      var data = {
        'active': !active
      };

      updateNews(_id, data).then(function (res) {
        getNewsSpider().then(function (res) {
          vm.listSpider = res.news;
          vm.tableParams = new NgTableParams({
            page: 1,
            count: 15,
            header: false
          }, {
            dataset: vm.listSpider
          });
        });
      }, function () {});
    };

    getSpider().then(function (res) {
      vm.crawlingName = res.spider.crawlingName;
    });

    vm.callOneUrl = function (_id) {
      getSpider().then(function (res) {
        callUrl(res.spider.crawlingName, _id).then(function (ress) {
          vm.showCallUrl = new String(_id);
          var temp_VM = '';
          for (var index = 0; index < vm.showCallUrl.length; index++) {
            temp_VM += vm.showCallUrl.charAt(index);
          }
          console.log(temp_VM);
          vm.showCallUrl = temp_VM;
          if (ress.messsage === 'CALL_SUCCESS') {
            setTimeout(function () {
              vm.showCallUrl = false;
              getNewsSpider().then(function (res) {
                vm.listSpider = res.news;
                vm.tableParams = new NgTableParams({
                  page: 1,
                  count: 15,
                  header: false
                }, {
                  dataset: vm.listSpider
                });
              });
            }, 5000);
          }
        })
      })
    }
    vm.updateSpider = function () {
      // getSpider().then(function (res) {
      //   update(res.spider.crawlingName).then(function (ress) {

      //   });
      // });
    }

    getNewsSpider().then(function (res) {
      vm.listSpider = res.news;
      vm.tableParams = new NgTableParams({
        page: 1,
        count: 15,
        header: false
      }, {
        dataset: vm.listSpider
      });
    });


    vm.animationsEnabled = true;
    vm.newsDetail = function (_id) {
      $rootScope._id = _id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'newsDetail.html',
        controller: 'newsDetail',
        controllerAs: 'vm',
        size: 'lg'
      });
    };

    vm.animationsEnabled = true;
    vm.conform = function (_id) {
      $rootScope._id = _id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'conformDelete.html',
        controller: 'conformDelete',
        controllerAs: 'vm',
        size: 'sm'
      }).closed.then(function () {
        getNewsSpider().then(function (res) {
          vm.listSpider = res.news;
          console.log(res.news.length);
          vm.tableParams = new NgTableParams({
            page: 1,
            count: 15,
            header: false
          }, {
            dataset: vm.listSpider
          });
        });
      });
    };

    vm.callSpider = function () {
      getSpider().then(function (res) {
        $rootScope.spiderName = res.spider.crawlingName;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'callSpider.html',
          controller: 'callSpider',
          controllerAs: 'vm',
          size: 'sm'
        }).closed.then(function () {
          getNewsSpider().then(function (res) {
            vm.listSpider = res.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          });
        });
      });
    };

    vm.callSpiderByPath = function () {
      getSpider().then(function (res) {
        $rootScope.spiderId = res.spider._id;
        $rootScope.spiderName = res.spider.crawlingName;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'callSpiderByPath.html',
          controller: 'callSpiderByPath',
          controllerAs: 'vm',
          size: 'lg'
        }).closed.then(function () {
          getNewsSpider().then(function (res) {
            vm.listSpider = res.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          });
        });
      });
    };

    vm.updateNewsByCategory = function () {

    };

    vm.searchByKey = function () {

    };
  }
  angular.module('app.admincallspider')
    .controller('callSpiderByPath', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', callSpiderByPath]);

  function callSpiderByPath($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal) {
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

    function getSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getSpider($rootScope.spiderId).then(w => {
      console.log($rootScope.spiderId);
      urlInformation(w.spider.urlId).then(res => {
        vm.urlId = res.url._id;
        vm.urlTitle = res.url.title;
        vm.urlHostname = res.url.hostname;
        vm.path = res.url.path;
      });
    });
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.callPath = function (urlId, cateId) {
      console.log(urlId + " " + cateId);
      $rootScope.urlId = urlId;
      $rootScope.cateId = cateId;
      $uibModalInstance.close();
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showNewsCallPath.html',
        controller: 'showNewsCallPath',
        controllerAs: 'vm',
        size: 'lg'
      }).closed.then(function () {

      });
    };
  }

  angular.module('app.admincallspider')
    .controller('showNewsCallPath', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', showNewsCallPath]);

  function showNewsCallPath($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal) {
    var vm = this;

    function getSpider(spiderId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/' + spiderId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function callPath(spiderName, cateId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/callSpiderByPath/' + spiderName + '/' + cateId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    getSpider($rootScope.spiderId).then(spider => {
      callPath(spider.spider.crawlingName, $rootScope.cateId).then(call => {
        console.log(call);
      });
    });
    //$rootScope.spiderId
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.admincallspider')
    .controller('newsDetail', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', newsDetail]);

  function newsDetail($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function find(_id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news/' + _id,
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    find($rootScope._id).then(function (res) {
      vm.title = res.news.title;
      vm.originalLink = res.news.originalLink;
      vm.author = res.news.author;
      vm.createDate = moment(res.news.createDate).format('DD-MM-YYYY');
      vm.spiderId = res.news.spiderId;
      vm.categoryId = res.news.categoryId;
      vm.content = res.news.content;

    });
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('app.admincallspider')
    .controller('conformDelete', ['$q', '$http', '$state', '$scope', '$rootScope', 'NgTableParams', '$uibModalInstance', conformDelete]);

  function conformDelete($q, $http, $state, $scope, $rootScope, NgTableParams, $uibModalInstance) {
    var vm = this;

    function getListNews() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news'
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function deleteNews(category) {
      var deferred = $q.defer();
      $http({
        method: 'DELETE',
        url: '/api/news/' + $rootScope._id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    vm.ok = function () {
      deleteNews().then(function (res) {
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

  angular.module('app.admincallspider')
    .controller('callSpider', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', callSpider]);

  function callSpider($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    function call(name) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/' + name
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }
    call($rootScope.spiderName).then(function (ress) {
      vm.animationsEnabled = true;
      if (ress.spider === "CALL_SUCCESS") {
        vm.checkShow = true;
        setTimeout(function () {
          vm.checkShow = false;
          $uibModalInstance.close();
        }, 3000);

      }
    })
  }

})();
