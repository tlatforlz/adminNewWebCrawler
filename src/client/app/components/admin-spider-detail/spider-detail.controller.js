(function () {
  angular.module('app.adminspiderdetail')
    .controller('AdminSpiderDetail', AdminSpiderDetail);

  AdminSpiderDetail.$inject = ['$q', '$http', '$state', '$stateParams', '$scope', 'NgTableParams',
    '$uibModal', '$rootScope'
  ];

  function AdminSpiderDetail($q, $http, $state, $stateParams, $scope, NgTableParams, $uibModal, $rootScope) {
    var vm = this;
  }

})();
