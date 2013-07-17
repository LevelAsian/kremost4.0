'use strict';

var hasreloaded = false;

angular.module('myApp.controllers', [])

    .controller('FriendsCtrl', function($scope, $http, $location, $rootScope, $route) {
        var currentUser = $rootScope.GlobalCurrentUser;


        // stokker bokstavene rundt omkring
        $(function(){
            var container = $(".shuffleletters");
            setTimeout(function(){
                container.shuffleLetters();
            },0);
        });

        // reloaded for å fikse bug.
        if(!hasreloaded){
            setTimeout(function(){$location.path('/#friends'), 1000})
            hasreloaded = true;
        }
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
                $route.reload()


            };

            $scope.declineRequest = function(request){

                $scope.requester= {};
                $scope.requester.currentmail = currentUser.email;
                $scope.requester.email = request;

                $http.post('/api/declineRequest/', $scope.requester)
                    .success(function(){
                        console.log("Deleted friend request")
                    })
                $route.reload()
            }
        $scope.friend = {};
        $scope.friend.CurrentUserMail = currentUser.email;

        $scope.addFriend = function() {
                $http.get('api/queryforusers/' + $scope.friend.friendemail ).
                    success(function(data){
                        if($scope.friend.friendemail == currentUser.email){
                            $scope.test = "Cannot add yourself as a friend!";
                        } else{
                            $http.get('/api/updatefriendlist/' + currentUser.email).
                                success(function(User) {
                                    currentUser.friends = User.friends;
                                    if(currentUser.friends.indexOf($scope.friend.friendemail) == -1){

                                        $http.post('/api/addfriend/', $scope.friend)
                                            .success(function(){
                                                $scope.text = "friend request sent";

                                            });
                                        $scope.friend.friendemail = "";
                                    } else {
                                        $scope.text = $scope.friend.friendemail + " is already your friend";
                                    }
                                });


                        }

                    })
            }






        $scope.seen = function(friend){

            friend.watcher = currentUser.name;
            currentUser.clicksOn = friend.email

            $http.post('/api/seen/', friend)
                .success(function(){
                });

            $http.post('/api/removeNewStatus/', currentUser)
                .success(function(){
                });

        }


        $http.get('api/newStatuses/' + currentUser.email).
            success(function(data){
                $scope.newStatuses = data;

            })
    })

    .controller('FriendCtrl', function($scope, $routeParams, $http, $rootScope, $route, $location) {
        // stokker bokstavene rundt omkring
        $(function(){
            var container = $(".shuffleletters");
            setTimeout(function(){
                container.shuffleLetters();
            },0);
        });

        var currentUser = $rootScope.GlobalCurrentUser;

        $scope.friend = {};

        $http.get('/api/friend/' + $routeParams.email).
            success(function(data) {
                $scope.friend.name = data.name;
                $scope.friend.statuses = data.statuses;
                $scope.friend.comments = data.comments;
                $scope.friend.email = data.email;
                $scope.friend.seen = data.seen;
                if(data.email==currentUser.email){
                    $scope.checkuser = true;
                }else{
                    $scope.checkuser = false;
                }
            });

        $scope.checkIfCurrentUser = function(){
            if($scope.checkuser){
                return true;
            }else{
                return false;
            }
        }



        $scope.comment = function(status) {
            status.commenter = currentUser.name;

            $http.post('/api/comment/', status)
                .success(function(){
                    $location.path('/');
                });
            $route.reload()

            status.newcomment= "";
        }



        $http.post('/api/deleteoldstatuses/' + $routeParams.email)
            .success(function(){
            })

        $scope.friend.currentUserEmail = currentUser.email;
        $scope.deletefriend = function(){
            $http.post('/api/deletefriend', $scope.friend)
                .success(function(){
                    $location.path('/');
                });
        };

        $http.post('/api/deletestatus/' + $routeParams.email, status)
            .success(function(){
                $route.reload();
            });

// stokker bokstavene rundt omkring
        $(function(){
            var container = $(".shuffleletters");
            setTimeout(function(){
                container.shuffleLetters();
            },0);
        });
    })

    .controller('AddStatusCtrl', function($scope, $http, $location, $rootScope){
        // stokker bokstavene rundt omkring
        $(function(){
            var container = $(".shuffleletters");
            setTimeout(function(){
                container.shuffleLetters();
            },0);
        });
        var currentUser = $rootScope.GlobalCurrentUser;
        $scope.status = {};
        $scope.status.email = currentUser.email;
        $scope.status.friends = currentUser.friends;

        $scope.addStatus = function() {
            $http.post('/api/addstatus/', $scope.status)
                .success(function(){
                    $location.path('/');
                });
            $scope.status.text = "";
        }
    })




