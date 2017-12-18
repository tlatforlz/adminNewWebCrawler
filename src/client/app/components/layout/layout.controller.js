(function () {
  angular.module('app.layout')
    .controller('layoutController', ['$state', 'authService', layoutController]);

  function layoutController($state, authService) {
    var vm = this;
    console.log('log');

    vm.logout = function () {
      toastr.success(authService.logout());
      $state.go('adminlogin');
    }
  }
})();
