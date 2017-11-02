(function () {
  'use strict';

  angular.module('app', [
    'app.adminlogin',
    'app.layout',
    'app.adminpage',
    'app.adminarchive',
    'app.admincategory',
    'app.adminnews',
    'app.adminspider',
    'app.adminurls',
    'app.admincallspider',

    'ui.router',
    'angular-jwt',
    'ngStorage',
    'ngAnimate',
    'ngSanitize',
    'ngplus',
    'blocks.exception',
    'blocks.logger',
    'blocks.router',
    'infinite-scroll',
    'ngTable'
  ]);
})();
