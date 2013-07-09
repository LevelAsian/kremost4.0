'use strict';

function Person(email, name, friends) {
    this.email = email;
    this.name = name;
    this.friends = friends;
}

var currentUser = new Person('kurt@gmail.com', 'KURT', ['stiansando@gmail.com', 'kensivalie@gmail.com', 'anders.hua@gmail.com']);

/* Controllers */

angular.module('myApp.controllers', [])

    .controller('LoginCtrl', function($scope, $http, $location) {
        $scope.user = {};
        $scope.login = function() {
            $http.get('http://kremost.herokuapp.com/api/login/' + $scope.user.email).
                success(function(User) {
                    if($scope.user.password == User.password) {
                        $location.path('/friends');
                        currentUser = new Person(User.email, User.name, User.friends);
                        $scope.user=null;
                    } else {
                        $scope.user.text = 'Try again..';
                    }

                }).
                error(function() {
                    $scope.user.text = 'Try again..';
                    console.log('Nå fucka du opp servern!!! fikser det i v2.');
                    console.log("heihei");
                });
        }
    })

    .controller('FriendsCtrl', function($scope, $http, $location) {
        $scope.currentUser = currentUser;
        $http.get('http://kremost.herokuapp.com/api/friends/' + currentUser.email).
            success(function(friends) {
                $scope.friends = friends;
            });
        $scope.openFriend = function(friend) {
            $location.path('/friend/' + friend.email);
        }
    })

    .controller('RegisterCtrl', function($scope, $http, $location){
        $scope.user = {};

        $scope.submitUser = function() {
            $http.post('http://kremost.herokuapp.com/api/register/', $scope.user)
                .success(function(data){
                    $location.path('/');
                })
        }
    })

    .controller('AddStatusCtrl', function($scope, $http, $location){
        $scope.status = {};
        $scope.status.email = currentUser.email;

        $scope.addStatus = function() {
            $http.post('http://kremost.herokuapp.com/api/addstatus/', $scope.status)
                .success(function(){
                    $location.path('/');
                });
            $scope.status.text = "";
        }
    })

    .controller('FriendCtrl', function($scope, $routeParams, $http) {

        $scope.friend = {};
        $http.get('http://kremost.herokuapp.com/api/friend/' + $routeParams.email).
            success(function(data) {
                $scope.friend.name = data.name;
                $scope.friend.statuses = data.statuses;
            });

        $http.post('http://kremost.herokuapp.com/api/deleteoldstatuses/' + $routeParams.email)
            .success(function(){

            })

    })
    .controller('AddFriendCtrl', function($scope, $location, $http){
        $scope.friend = {};
        $scope.friend.CurrentUserMail = currentUser.email;

        $scope.test = "";


        $scope.addFriend = function() {

            if($scope.friend.friendemail == currentUser.email){
                $scope.test = "Cannot add yourself as a friend!";
            }
            else{
                $http.post('http://kremost.herokuapp.com/api/addfriend/', $scope.friend)
                    .success(function(){

                    });
            }
            $location.path('/friends');
        }
    });


