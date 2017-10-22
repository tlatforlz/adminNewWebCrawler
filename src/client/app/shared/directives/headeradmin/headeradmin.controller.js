'use strict';
angular.module('app.headeradmin')
  .controller('AdminPageController', ['$state', 'authService', layoutController]);

function layoutController($state, authService) {
  var vm = this;
  vm.logout = logout;

  function logout() {
    toastr.success(authService.logout());
    $state.go('adminlogin');
  }

  vm.dashboard = dashboard;

  function dashboard() {
    console.log('adminpage đ ');
    $state.go('adminpage');
  }

  vm.categories = categories;

  function categories() {
    console.log('admincategory  as');
    $state.go('admincategory');
  }
}
