(function () {
  'use strict';

  angular.module('app')
    .directive('myHeaderAdmin', myHeaderAdmin);

  /* @ngInject */
  function myHeaderAdmin() {
    var directive = {
      restrict: 'EA',
      controller: ['$scope', 'authService', '$state', function ($scope, authService, $state) {
        var vm = this;
        vm.logout = logout;

        function logout() {
          toastr.success(authService.logout());
          $state.go('adminlogin');
        }
        vm.dashboard = dashboard;

        function dashboard() {
          $state.go('layout.dashboard');
        }

        vm.categories = categories;

        function categories() {
          $state.go('layout.categories');
        }

        vm.adminarchive = adminarchive;

        function adminarchive() {
          $state.go('layout.archive');
        }

        vm.adminnews = adminnews;

        function adminnews() {
          $state.go('layout.news');
        }

        vm.adminurls = adminurls;

        function adminurls() {
          $state.go('layout.urls');
        }

        vm.adminspider = adminspider;

        function adminspider() {
          $state.go('layout.spider');
        }
      }],
      controllerAs: 'vm'
    };

    return directive;
  }
})();
