'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
    config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: '/app/partials/login.html',
            controller: 'LoginCtrl'});

        $routeProvider.when('/friends', {
            templateUrl: '/app/partials/friends.html',
            controller: 'FriendsCtrl'});

        $routeProvider.when('/friend/:email', {
          templateUrl: '/app/partials/friend.html',
          controller: 'FriendCtrl'});

        $routeProvider.when('/register', {
            templateUrl: '/app/partials/register.html',
            controller: 'RegisterCtrl'});

        $routeProvider.when('/addstatus', {
            templateUrl: '/app/partials/addstatus.html',
            controller: 'AddStatusCtrl'});

        $routeProvider.when('/addfriend', {
            templateUrl: '/app/partials/addfriend.html',
            controller: 'AddFriendCtrl'});

        $routeProvider.otherwise({
            redirectTo: '/'});
    }]);
