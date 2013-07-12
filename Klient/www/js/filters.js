'use strict';

/* Filters */

// Sjekker om statusen er for gammel til å vises.
angular.module('myApp.filters', []).filter('StatusDateFilter', function() {
    return function(statuses){
        var date = new Date();
        var stillRelevant = [];

        angular.forEach(statuses, function(status){
            var enddate = new Date(status.enddate);
            if(enddate>date){
                stillRelevant.push(status);
            }
        });
        return stillRelevant
    }
})



    .filter('commentFilter', function() {
        return function(comments, statusmodel, status){

            var relatedComment = []

            comments.forEach(function(comment){
                if(comment.commentToStatus == status._id){
                    relatedComment.push(comment);
                }
            })
            return relatedComment
        }
    })
