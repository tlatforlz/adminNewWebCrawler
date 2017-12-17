(function () {
  angular.module('app.admincallspider')
    .controller('CallSpiderController', CallSpiderController);

  CallSpiderController.$inject = ['$q', '$http', '$state', '$stateParams', '$scope', 'NgTableParams',
    '$uibModal', '$rootScope'
  ];

  function CallSpiderController($q, $http, $state, $stateParams, $scope, NgTableParams, $uibModal, $rootScope) {
    var vm = this;
    vm.listSpider = [];


    $rootScope.spiderId = $stateParams.id

    function getNewsSpider() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + $rootScope.spiderId
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
        url: '/api/spider/' + $rootScope.spiderId
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

    function getNewsCalled(newsId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news/' + newsId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.checkShowRestricted = function (restrictKey) {
      var index = 0;
      var t = new Promise(function (resolve, reject) {
        restrictKey.forEach(item => {
          if (item.duplicate != 0) {
            resolve(true);
          }
          index++;
          if (index === restrictKey.length - 1) {
            resolve(false);
          }
        });
      });
      t.then(res => {
        return res;
      });
    }
    vm.bandList = function (id) {
      $rootScope._id = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'restrictedList.html',
        controller: 'restrictedList',
        controllerAs: 'vm',
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
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
      getSpider().then(function (res) {
        $rootScope.spiderName = res.spider.crawlingName;
        $rootScope.spiderId = res.spider._id;
        $rootScope.urlId = res.spider.urlId;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'updateSpider.html',
          controller: 'updateSpider',
          controllerAs: 'vm',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
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
        size: 'lg',
        backdrop: 'static',
        keyboard: false
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
        size: 'sm',
        backdrop: 'static',
        keyboard: false
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
    };

    vm.callSpider = function () {
      getSpider().then(function (res) {
        $rootScope.spiderName = res.spider.crawlingName;
        $rootScope.spiderId = res.spider._id;
        $rootScope.urlId = res.spider.urlId;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'callSpider.html',
          controller: 'callSpider',
          controllerAs: 'vm',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
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
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        }).closed.then(function () {
          console.log('fuck sadsa');
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
      getSpider().then(function (res) {
        $rootScope.spiderId = res.spider._id;
        $rootScope.spiderName = res.spider.crawlingName;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'updateNewsByCategory.html',
          controller: 'updateNewsByCategory',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
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

    vm.searchByKey = function () {
      getSpider().then(function (res) {
        $rootScope.spiderId = res.spider._id;
        $rootScope.spiderName = res.spider.crawlingName;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'searchByKey.html',
          controller: 'searchByKey',
          controllerAs: 'vm',
          size: 'md',
          backdrop: 'static',
          keyboard: false
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
  }

  angular.module('app.admincallspider')
    .controller('restrictedList', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', 'NgTableParams', restrictedList]);

  function restrictedList($q, $http, $state, $scope, $rootScope, $uibModalInstance, NgTableParams) {
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
      vm.listRestrict = res.news.restrictedKey;
      vm.tableParams = new NgTableParams({
        page: 1,
        count: 15,
        header: false,
        noPager: true,
        counts: []
      }, {
        dataset: vm.listRestrict
      });
    });
    vm.ok = function () {
      $uibModalInstance.close();
    };
  }


  angular.module('app.admincallspider')
    .controller('searchByKey', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', searchByKey]);

  function searchByKey($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams) {
    var vm = this;

    vm.cancel = function () {
      $uibModalInstance.close();
    }

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

    function getNewsSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.getKey = function () {
      getSpider($rootScope.spiderId).then(function (res) {
        $rootScope.spiderId = res.spider._id;
        $rootScope.spiderName = res.spider.crawlingName;
        $rootScope.searchKey = vm.searchKey;
        $uibModalInstance.close();
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'addSearchKeyInCategory.html',
          controller: 'addSearchKeyInCategory',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        }).closed.then(function () {
          getNewsSpider($rootScope.spiderId).then(function (res) {
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
    }
    vm.ok = function () {
      $uibModalInstance.close();
    };
  }


  angular.module('app.admincallspider')
    .controller('addSearchKeyInCategory', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', addSearchKeyInCategory]);

  function addSearchKeyInCategory($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams) {
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

    function getCategory() {
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

    function checkKey(id, key) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/checkKey/' + id,
        data: {
          'key': key
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function addKey(id, key) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/addKey/' + id,
        data: {
          'key': key
        }
      }).then(function sucesssCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function removeKey(id, key) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/category/removeKey/' + id,
        data: {
          'key': key
        }
      }).then(function sucesssCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }


    vm.path = [];
    vm.spiderName = $rootScope.spideName;
    vm.isSearchButton = false;
    getCategory().then(cate => {
      cate.categorys.forEach(item => {
        checkKey(item._id, $rootScope.searchKey).then(check => {
          if (check === true) {
            var cateItem = {
              '_id': item._id,
              'name': item.name,
              'keys': item.keys,
              'add': false,
              'remove': true
            }
            vm.path.push(cateItem);
            vm.isSearchButton = true;
          } else {
            var cateItem = {
              '_id': item._id,
              'name': item.name,
              'keys': item.keys,
              'add': true,
              'remove': false
            }
            vm.path.push(cateItem);
          }
        });
      });
    });

    vm.add = function (id) {
      vm.path = [];
      vm.isSearchButton = false;
      addKey(id, $rootScope.searchKey).then(w => {
        getCategory().then(cate => {
          cate.categorys.forEach(item => {
            checkKey(item._id, $rootScope.searchKey).then(check => {
              if (check === true) {
                var cateItem = {
                  '_id': item._id,
                  'name': item.name,
                  'keys': item.keys,
                  'add': false,
                  'remove': true
                }
                vm.path.push(cateItem);
                vm.isSearchButton = true;
              } else {
                var cateItem = {
                  '_id': item._id,
                  'name': item.name,
                  'keys': item.keys,
                  'add': true,
                  'remove': false
                }
                vm.path.push(cateItem);
              }
            });
          });
        });
      });
    };

    vm.remove = function (id) {
      vm.path = [];
      vm.isSearchButton = false;
      removeKey(id, $rootScope.searchKey).then(w => {
        getCategory().then(cate => {
          cate.categorys.forEach(item => {
            checkKey(item._id, $rootScope.searchKey).then(check => {
              if (check === true) {
                var cateItem = {
                  '_id': item._id,
                  'name': item.name,
                  'keys': item.keys,
                  'add': false,
                  'remove': true
                }
                vm.path.push(cateItem);
                vm.isSearchButton = true;
              } else {
                var cateItem = {
                  '_id': item._id,
                  'name': item.name,
                  'keys': item.keys,
                  'add': true,
                  'remove': false
                }
                vm.path.push(cateItem);
              }
            });
          });
        });
      });
    }

    vm.SearchKey = function () {
      $uibModalInstance.close();
      getSpider($rootScope.spiderId).then(spider => {
        $rootScope.spiderName = spider.spider.crawlingName;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'showNewsSearchBykey.html',
          controller: 'showNewsSearchBykey',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        }).closed.then(function () {
          getNewsSpider($rootScope.spiderId).then(function (res) {
            console.log(res);
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
      })
    }
    vm.ok = function () {
      $uibModalInstance.close();
    };

    function getNewsSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.callPath = function (urlId, namePath, cateId) {
      $rootScope.urlId = urlId;
      $rootScope.cateId = cateId;
      $rootScope.namePath = namePath;
      $uibModalInstance.close();
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showNewsCallPath.html',
        controller: 'showNewsCallPath',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        getNewsSpider($rootScope.spiderId).then(function (res) {
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
    };
  }

  angular.module('app.admincallspider')
    .controller('showNewsSearchBykey', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', showNewsSearchBykey]);

  function showNewsSearchBykey($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams) {
    var vm = this;

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
        setTimeout(function () {
          vm.loadingNews = false;
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
    };

    function searchByKey(spiderName, key) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/search/' + spiderName + "/searchByKey",
        data: {
          'searchKey': key
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      })
      return deferred.promise;
    }

    function getNewsCalled(newsId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news/' + newsId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsNeastCall(spiderId, limit) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + spiderId + "/" + limit
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }


    vm.loading = true;
    vm.loadingNews = true;
    searchByKey($rootScope.spiderName, $rootScope.searchKey).then(result => {
      vm.loading = false;
      vm.loadingNews = false;
      vm.total = result.total;
      $rootScope.listNewsId = result.listNewsId;
      $rootScope.total = result.total;
      vm.listSpider = [];
      $rootScope.listNewsId.forEach(newsId => {
        getNewsCalled(newsId).then(res => {
          vm.listSpider.push(res.news);
          if (vm.listSpider.length == result.total) {
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          }
        })
      })
    })

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
        size: 'lg',
        backdrop: 'static',
        keyboard: false
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
        size: 'sm',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        setTimeout(function () {
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
    };

    vm.callOneUrl = function (_id) {
      getSpider($rootScope.spiderId).then(function (res) {
        callUrl(res.spider.crawlingName, _id).then(function (ress) {
          vm.showCallUrl = new String(_id);
          var temp_VM = '';
          for (var index = 0; index < vm.showCallUrl.length; index++) {
            temp_VM += vm.showCallUrl.charAt(index);
          }
          vm.showCallUrl = temp_VM;
          if (ress.messsage === 'CALL_SUCCESS') {
            setTimeout(function () {
              vm.showCallUrl = false;
              getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                vm.listSpider = news.news;
                vm.tableParams = new NgTableParams({
                  page: 1,
                  count: 15,
                  header: false
                }, {
                  dataset: vm.listSpider
                });
              })
            }, 3000);
          }
        })
      })
    };

    function updateByUrl(name, urlId, url) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'api/spider/' + name + "/" + urlId + "/updateurlByNewsId",
        data: {
          "url": url
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.loadingNews = false;
    vm.updatePathAll = function () {
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateByUrl(res.spider.crawlingName, element._id, element.originalLink).then(news => {
              index++;
              vm.index = index;
              if (index === vm.total) {
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
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

    vm.index = 0;
    vm.loadingNews = false;
    vm.activePathAll = function () {
      vm.loadingNewsActive = true;
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.total = news.news.length;
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateNews(element._id, {
              'active': true
            }).then(news => {
              index++;
              vm.index = index;
              if (index == vm.total - 1) {
                vm.loadingNews = false;
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
    }

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


    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    function getNewsSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

  }
  angular.module('app.admincallspider')
    .controller('updateNewsByCategory', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', updateNewsByCategory]);

  function updateNewsByCategory($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams) {
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

    function getNewsSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.callPath = function (urlId, namePath, cateId) {
      $rootScope.urlId = urlId;
      $rootScope.cateId = cateId;
      $rootScope.namePath = namePath;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showNewsUpdatePath.html',
        controller: 'showNewsUpdatePath',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        $uibModalInstance.close();
      });
    };
  }

  angular.module('app.admincallspider')
    .controller('showNewsCallPath', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', '$window', showNewsCallPath]);

  function showNewsCallPath($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams, $window) {
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

    function callPath(spiderName, namePath, cateId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/categorySpider/callSpiderByPath/' + spiderName,
        data: {
          'namePath': namePath,
          'catelogyId': cateId
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsNeastCall(spiderId, limit) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + spiderId + "/" + limit
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsCalled(newsId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news/' + newsId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.loading = true;
    getSpider($rootScope.spiderId).then(spider => {
      callPath(spider.spider.crawlingName, $rootScope.namePath, $rootScope.cateId).then(call => {
        if (call.status === true) {
          if (call.total > 0) {
            vm.loading = false;
            vm.total = call.total;
            vm.listNewsId = call.listNewsId;
            vm.listSpider = [];
            vm.listNewsId.forEach(newsId => {
              getNewsCalled(newsId).then(res => {
                vm.listSpider.push(res.news);
                if (vm.listSpider.length == call.total - 1) {
                  vm.tableParams = new NgTableParams({
                    page: 1,
                    count: 15,
                    header: false
                  }, {
                    dataset: vm.listSpider
                  });
                }
              })
            })
          } else {
            $window.alert("No news. Please check orginal path.");
            $uibModalInstance.close();
          }
        } else {
          window.alert("No news. Please check orginal path.");
          $uibModalInstance.close();
        }
      });
    });
    //$rootScope.spiderId
    vm.ok = function () {
      $uibModalInstance.close();
    };


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

    // router.post('/:crawlingName/:url/updateurl', updateNewsSpiderUrl);
    function updateByUrl(name, urlId, url) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'api/spider/' + name + "/" + urlId + "/updateurlByNewsId",
        data: {
          "url": url
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }


    vm.loadingNews = false;
    vm.updatePathAll = function () {
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateByUrl(res.spider.crawlingName, element._id, element.originalLink).then(news => {
              index++;
              vm.index = index;
              if (index === vm.total - 1) {
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
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
        setTimeout(function () {
          vm.loadingNews = false;
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
    };

    vm.index = 0;
    vm.loadingNews = false;
    vm.activePathAll = function () {
      vm.loadingNewsActive = true;
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.total = news.news.length;
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateNews(element._id, {
              'active': true
            }).then(news => {
              index++;
              vm.index = index;
              if (index == vm.total - 1) {
                vm.loadingNews = false;
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
    }

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
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
    };

    vm.callOneUrl = function (_id) {
      getSpider($rootScope.spiderId).then(function (res) {
        callUrl(res.spider.crawlingName, _id).then(function (ress) {
          vm.showCallUrl = new String(_id);
          var temp_VM = '';
          for (var index = 0; index < vm.showCallUrl.length; index++) {
            temp_VM += vm.showCallUrl.charAt(index);
          }
          vm.showCallUrl = temp_VM;
          if (ress.messsage === 'CALL_SUCCESS') {
            setTimeout(function () {
              vm.showCallUrl = false;
              getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                vm.listSpider = news.news;
                vm.tableParams = new NgTableParams({
                  page: 1,
                  count: 15,
                  header: false
                }, {
                  dataset: vm.listSpider
                });
              })
            }, 3000);
          }
        })
      })
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
        size: 'sm',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        setTimeout(function () {
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
    };
  }


  angular.module('app.admincallspider')
    .controller('callSpiderByPath', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', callSpiderByPath]);

  function callSpiderByPath($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams) {
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

    function getNewsSpider(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.callPath = function (urlId, namePath, cateId) {
      $rootScope.urlId = urlId;
      $rootScope.cateId = cateId;
      $rootScope.namePath = namePath;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showNewsCallPath.html',
        controller: 'showNewsCallPath',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        getNewsSpider($rootScope.spiderId).then(function (res) {
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
    };
  }

  angular.module('app.admincallspider')
    .controller('showNewsUpdatePath', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', '$uibModal', 'NgTableParams', '$window', showNewsUpdatePath]);

  function showNewsUpdatePath($q, $http, $state, $scope, $rootScope, $uibModalInstance, $uibModal, NgTableParams, $window) {
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

    function callPath(spiderName, namePath, cateId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/categorySpider/callSpiderByPathUpdate/' + spiderName,
        data: {
          'namePath': namePath,
          'catelogyId': cateId
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsNeastCall(spiderId, limit) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsCall/' + spiderId + "/" + limit
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsCalled(newsId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/news/' + newsId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.bandList = function (id) {
      $rootScope._id = id;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'restrictedList.html',
        controller: 'restrictedList',
        controllerAs: 'vm',
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
    }

    vm.Error = 0;
    vm.loading = true;
    getSpider($rootScope.spiderId).then(spider => {
      callPath(spider.spider.crawlingName, $rootScope.namePath, $rootScope.cateId).then(call => {
        console.log(call);
        if (call.status === true) {
          if (call.total > 0) {
            vm.loading = false;
            vm.total = call.total;
            vm.listNewsId = call.listNewsId;
            vm.listSpider = [];
            vm.listNewsId.forEach(newsId => {
              getNewsCalled(newsId).then(res => {
                if (res.news.restrictedKey.length > 0) {
                  vm.Error++;
                }
                vm.listSpider.push(res.news);
                if (vm.listSpider.length == call.total - 1) {
                  vm.tableParams = new NgTableParams({
                    page: 1,
                    count: 15,
                    header: false
                  }, {
                    dataset: vm.listSpider
                  });
                }
              })
            })
          } else {
            $window.alert("No news. Please check orginal path.");
            $uibModalInstance.close();
          }
        } else {
          window.alert("No news. Please check orginal path.");
          $uibModalInstance.close();
        }
      });
    });

    vm.ok = function () {
      $uibModalInstance.close();
    };

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

    function updateByUrl(name, urlId, url) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'api/spider/' + name + "/" + urlId + "/updateurlByNewsId",
        data: {
          "url": url
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }


    vm.loadingNews = false;
    vm.updatePathAll = function () {
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateByUrl(res.spider.crawlingName, element._id, element.originalLink).then(news => {
              index++;
              vm.index = index;
              if (index === vm.total - 1) {
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
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
        setTimeout(function () {
          vm.loadingNews = false;
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
    };

    vm.index = 0;
    vm.loadingNews = false;
    vm.activePathAll = function () {
      vm.loadingNewsActive = true;
      getSpider($rootScope.spiderId).then(function (res) {
        getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
          vm.total = news.news.length;
          vm.listSpider = news.news;
          var index = 0;
          vm.listSpider.forEach(element => {
            //originalLink
            vm.loadingNews = true;
            updateNews(element._id, {
              'active': true
            }).then(news => {
              index++;
              vm.index = index;
              if (index == vm.total - 1) {
                vm.loadingNews = false;
                setTimeout(function () {
                  vm.loadingNews = false;
                  getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                    vm.listSpider = news.news;
                    vm.tableParams = new NgTableParams({
                      page: 1,
                      count: 15,
                      header: false
                    }, {
                      dataset: vm.listSpider
                    });
                  })
                }, 3000);
              }
            })
          });
        })
      });
    }

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
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
    };

    vm.callOneUrl = function (_id) {
      getSpider($rootScope.spiderId).then(function (res) {
        callUrl(res.spider.crawlingName, _id).then(function (ress) {
          vm.showCallUrl = new String(_id);
          var temp_VM = '';
          for (var index = 0; index < vm.showCallUrl.length; index++) {
            temp_VM += vm.showCallUrl.charAt(index);
          }
          vm.showCallUrl = temp_VM;
          if (ress.messsage === 'CALL_SUCCESS') {
            setTimeout(function () {
              vm.showCallUrl = false;
              getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
                vm.listSpider = news.news;
                vm.tableParams = new NgTableParams({
                  page: 1,
                  count: 15,
                  header: false
                }, {
                  dataset: vm.listSpider
                });
              })
            }, 3000);
          }
        })
      })
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
        size: 'sm',
        backdrop: 'static',
        keyboard: false
      }).closed.then(function () {
        setTimeout(function () {
          getNewsNeastCall($rootScope.spiderId, vm.total).then(news => {
            vm.listSpider = news.news;
            vm.tableParams = new NgTableParams({
              page: 1,
              count: 15,
              header: false
            }, {
              dataset: vm.listSpider
            });
          })
        }, 3000);
      });
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

    var start = Date.now();

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
    //http://localhost:8001/api/spider/getNewsByDate/5999e8082a784f1ef0e9e235
    function getNewsCall(id) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/getNewsByDate/' + id,
        data: {
          'startDate': start
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getUrl(urlId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/url/' + urlId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function callPath(spiderName, namePath, cateId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/categorySpider/callSpiderByPath/' + spiderName,
        data: {
          'namePath': namePath,
          'catelogyId': cateId
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.toal = 0;
    var index = 1;
    vm.category = 1;
    vm.totalCategory = 0;
    vm.totalNews = 0;
    getUrl($rootScope.urlId).then(urlPath => {
      vm.totalCategory = urlPath.url.path.length;
      urlPath.url.path.forEach(item => {
        callPath($rootScope.spiderName, item.namePath, item.catelogyId).then(news => {
          index++;
          vm.category = index;
          vm.totalNews += news.total;
          if (index == urlPath.url.path.length) {
            setTimeout(function () {
              $uibModalInstance.close();
            }, 2000);
          }
        });
      });
    });
  }

  angular.module('app.admincallspider')
    .controller('updateSpider', ['$q', '$http', '$state', '$scope', '$rootScope', '$uibModalInstance', updateSpider]);

  function updateSpider($q, $http, $state, $scope, $rootScope, $uibModalInstance) {
    var vm = this;

    var start = Date.now();

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
    //http://localhost:8001/api/spider/getNewsByDate/5999e8082a784f1ef0e9e235
    function getNewsCall(id) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/getNewsByDate/' + id,
        data: {
          'startDate': start
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getUrl(urlId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/url/' + urlId
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function callPath(spiderName, namePath, cateId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/spider/categorySpider/callSpiderByPath/' + spiderName,
        data: {
          'namePath': namePath,
          'catelogyId': cateId
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function getNewsNone(id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/spider/getNewsNone/' + id
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function updateByUrl(name, urlId, url) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'api/spider/' + name + "/" + urlId + "/updateurlByNewsId",
        data: {
          "url": url
        }
      }).then(function successCallback(res) {
        deferred.resolve(res.data);
      }, function () {
        deferred.reject(null);
      });
      return deferred.promise;
    }

    vm.toal = 0;
    var index = 0;
    vm.category = 0;
    vm.totalCategory = 0;
    vm.totalNews = 0;
    getUrl($rootScope.urlId).then(urlPath => {
      getNewsNone($rootScope.spiderId).then(res => {
        vm.totalNews = res.news.length;
        if (vm.totalNews > 0) {
          vm.havenews = true;
          res.news.forEach(item => {
            updateByUrl($rootScope.spiderName, item._id, item.originalLink).then(news => {
              index++;
              vm.newsIndex = index;
              if (index === vm.totalNews) {
                setTimeout(function () {
                  $uibModalInstance.close();
                }, 3000);
              }
            })
          })
        } else {
          vm.havenews = false;
          setTimeout(function () {
            $uibModalInstance.close();
          }, 3000);
        }
      })
    });
  }

})();
