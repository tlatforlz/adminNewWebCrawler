(function () {
  angular.module('app.adminlogin')
    .controller('AdminLoginController', ['$q', '$http', '$state', '$stateParams', '$scope', 'authService', AdminLoginController]);

  function AdminLoginController($q, $http, $state, $stateParams, $scope, authService) {
    var vm = this;
    vm.login = function () {
      var request = {
        email: vm.email,
        password: vm.password
      };
      return authService.login(request, vm.remember === true ? 1 : 0).then(function (res) {
        toastr.success(res);
        $state.go('layout.dashboard');
      }, function (err) {
        toastr.error(err);
      });
    }
  }
})();
