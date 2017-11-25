(function () {
  'use strict';

  angular
    .module('app')
    .directive('ckeditor', Directive);

  function Directive($rootScope) {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {
        var editorOptions;
        if (attr.ckeditor === 'minimal') {
          // minimal editor
          editorOptions = {
            height: 100,
            toolbar: [{
                name: 'basic',
                items: ['Bold', 'Italic', 'Underline']
              },
              {
                name: 'links',
                items: ['Link', 'Unlink']
              },
              {
                name: 'tools',
                items: ['Maximize']
              },
              {
                name: 'document',
                items: ['Source']
              },
            ],
            removePlugins: 'elementspath',
            resize_enabled: false
          };
        }

        // enable ckeditor
        var ckeditor = element.ckeditor(editorOptions);

        // update ngModel on change
        ckeditor.editor.on('change', function () {
          ngModel.$setViewValue(this.getData());
        });
      }
    };
  }
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
