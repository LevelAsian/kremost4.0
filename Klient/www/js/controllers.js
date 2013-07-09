'use strict';

angular.module('myApp.controllers', [])

    .controller('FriendsCtrl', function($scope, $http, $location, $rootScope) {
        var currentUser = $rootScope.GlobalCurrentUser;
        $scope.currentUser = currentUser;
        $http.get('http://kremost.herokuapp.com/api/friends/' + currentUser.email).
            success(function(friends) {
                $scope.friends = friends;
            });
        $scope.openFriend = function(friend) {
            $location.path('/friend/' + friend.email);
        };


        $http.get('http://kremost.herokuapp.com/api/friend_requests/' + currentUser.email).
            success(function(data){

                $scope.requests = data;

            });


        $scope.acceptRequest = function(request) {

            console.log("hei: " + currentUser.email);
            console.log("requests er: " + request);
            $scope.requester = {};
            $scope.requester.currentmail = currentUser.email;
            $scope.requester.email = request;
            console.log("heihei" + $scope.requester.email);
            console.log(currentUser.friends);



            $http.post('http://kremost.herokuapp.com/api/acceptRequest/', $scope.requester)
                .success(function(){
                    console.log("accepted friend req");
                });
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


    .controller('RegisterCtrl', function($scope, $http, $location){
        $scope.user = {};

        $scope.submitUser = function() {
            $http.post('http://kremost.herokuapp.com/api/register/', $scope.user)
                .success(function(data){
                    $location.path('/');
                })
        }
    })

    .controller('AddStatusCtrl', function($scope, $http, $location, $rootScope){
        var currentUser = $rootScope.GlobalCurrentUser;
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


    .controller('AddFriendCtrl', function($scope, $location, $http, $rootScope){
        var currentUser = $rootScope.GlobalCurrentUser;

        $scope.friend = {};
        $scope.friend.CurrentUserMail = currentUser.email;

        $scope.test = "";


        $scope.addFriend = function() {



            $http.get('http://kremost.herokuapp.com/api/queryforusers/' + $scope.friend.friendemail ).
                success(function(data){
                    if($scope.friend.friendemail == currentUser.email){
                        $scope.test = "Cannot add yourself as a friend!";
                    } else{
                        $http.get('http://kremost.herokuapp.com/api/updatefriendlist/' + currentUser.email).
                            success(function(User) {
                                currentUser.friends = User.friends;
                                if(currentUser.friends.indexOf($scope.friend.friendemail) === -1){

                                    $http.post('http://kremost.herokuapp.com/api/addfriend/', $scope.friend)
                                        .success(function(){
                                            $scope.text = "friend request sent";
                                        });
                                } else {
                                    $scope.text = $scope.friend.friendemail + " is already your friend";
                                }
                            });

                    }
                })
        }
    });

