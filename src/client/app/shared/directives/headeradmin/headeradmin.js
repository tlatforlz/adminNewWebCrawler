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
          $state.go('adminpage');
        }

        vm.categories = categories;

        function categories() {
          $state.go('admincategory');
        }

        vm.adminarchive = adminarchive;

        function adminarchive() {
          $state.go('adminarchive');
        }

        vm.adminnews = adminnews;

        function adminnews() {
          $state.go('adminnews');
        }

        vm.adminurls = adminurls;

        function adminurls() {
          $state.go('adminurls');
        }

        vm.adminspider = adminspider;

        function adminspider() {
          $state.go('adminspider');
        }
      }],
      controllerAs: 'vm',
      scope: {},
      templateUrl: 'app/shared/directives/headeradmin/headeradmin.html'
    };

    return directive;
  }
})();
