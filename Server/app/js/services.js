'use strict';

/* Services */

angular.module('myApp.services', ['ngResource'])
  .factory("User", function($resource) {
    return $resource('/users/:email', {email: '@email'})
  });
