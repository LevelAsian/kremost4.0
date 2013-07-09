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
});
