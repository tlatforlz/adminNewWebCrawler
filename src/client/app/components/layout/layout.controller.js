'use strict';
angular.module('app.layout')
  .controller('layoutController', ['$state', layoutController]);

function layoutController($state) {
  var vm = this;
  vm.logout = logout;

  console.log('hihi');

  function logout() {
    $state.go('auth.login');
  }
}
