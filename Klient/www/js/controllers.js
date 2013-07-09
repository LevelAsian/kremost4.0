'use strict';

angular.module('myApp.controllers', [])

    .controller('FriendsCtrl', function($scope, $http, $location, $rootScope) {


        var currentUser = $rootScope.GlobalCurrentUser;

        $scope.currentUser = currentUser;
        $http.get('/api/friends/' + currentUser.email).
            success(function(friends) {
                $scope.friends = friends;
            });
        $scope.openFriend = function(friend) {
            $location.path('/friend/' + friend.email);
        };


        $http.get('/api/friend_requests/' + currentUser.email).
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



            $http.post('/api/acceptRequest/', $scope.requester)
                .success(function(){
                    console.log("accepted friend req");
                });


        };

        $scope.declineRequest = function(request){

            $scope.requester= {};
            $scope.requester.currentmail = currentUser.email;
            $scope.requester.email = request;

            $http.post('/api/declineRequest/', $scope.requester)
                .success(function(){
                    console.log("Deleted friend request")
                })


        }


    })

    .controller('FriendCtrl', function($scope, $routeParams, $http) {

        $scope.friend = {};
        $http.get('/api/friend/' + $routeParams.email).
            success(function(data) {
                $scope.friend.name = data.name;
                $scope.friend.statuses = data.statuses;
            });

        $http.post('/api/deleteoldstatuses/' + $routeParams.email)
            .success(function(){

            })
    })


    .controller('RegisterCtrl', function($scope, $http, $location){
        $scope.user = {};

        $scope.submitUser = function() {
            $http.post('/api/register/', $scope.user)
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
            $http.post('/api/addstatus/', $scope.status)
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



            $http.get('api/queryforusers/' + $scope.friend.friendemail ).
                success(function(data){
                    if($scope.friend.friendemail == currentUser.email){
                        $scope.test = "Cannot add yourself as a friend!";
                    } else{
                        $http.get('/api/updatefriendlist/' + currentUser.email).
                            success(function(User) {
                                currentUser.friends = User.friends;
                                if(currentUser.friends.indexOf($scope.friend.friendemail) === -1){

                                    $http.post('/api/addfriend/', $scope.friend)
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


