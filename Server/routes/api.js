var User = require('../model/db');

exports.GetOneUser = function(req, res) {
    User.findOne({email: req.params.email}, function(err, docs) {
        res.json(docs);
    });
};

exports.queryforusers = function(req, res){
    User.findOne({email: req.params.email}, function(err, docs) {
        if (docs !== null){
            res.send({
                email: docs.email
            })
        } else {
        }

    });
};

exports.friend_requests = function(req, res){
    User.findOne({email: req.params.email}, function(err, docs) {
        res.send(docs.friend_requests);
    });

};

exports.updatefriendlist = function(req, res){
    User.findOne({email: req.params.email}, function(err, docs) {
        res.json({
            friends: docs.friends
        });
    });
};

exports.updateRequests = function(req, res){
    User.findOne({email: req.params.email}, function (err, docs){
        User.where('email').in(docs.updateRequests).exec (function(err2, updateRequests){
            res.send(updateRequests)
        })   ;
    })        ;
}              ;
exports.friends = function(req, res) {
    User.findOne({email: req.params.email}, function(err, docs) {
        User.where('email').in(docs.friends).exec(function(err2, friends) {
            res.send(friends)
        });
    });
};

exports.register = function(req, res) {
    console.log(req.body);
    var user = new User({ email: req.body.email, name: req.body.name, password: req.body.password});

    user.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('new user: ' + user.name );
        }
    });
    res.redirect('/login');
}

exports.addstatus = function(req, res){

    var startdate = new Date();
    // en status varer i 16 timer.

    var enddate = new Date(startdate.getTime() + (16*60*60*1000));

    console.log("stardate api: " + startdate.getTime());


    for(var i=0; i < req.body.friends.length; i++){
        User.update({'email': req.body.friends[i]}, {$addToSet: {"newStatus": req.body.email}},
            function(err, docs){})
    }



    User.update({email: req.body.email}, {$push: {"statuses": {text: req.body.text, startdate: startdate, enddate: enddate}}}, function(err, docs){
        res.send(docs);
    });

    User.update({email: req.body.email}, {$set: {"updateRequests": []}}, function (err,docs){
         res.send(docs);
    })  ;

}






exports.friend = function(req, res) {
    User.findOne({email: req.params.email}, function(err, docs) {
        res.send(docs)
    });
};



exports.addfriend = function(req, res){

    /*              denne skjer når du accepter request istede
    User.update({ email: req.body.CurrentUserMail},
        {$push: {'friends': req.body.friendemail }},
        function(err, user){
            res.send(user);
        }
    );
    */



    User.findOne({email: req.body.friendemail}, function(err, docs) {
        User.update({email: req.body.friendemail}, {$push: {"friend_requests": req.body.CurrentUserMail}},
            function(err, docs){
                res.send(docs);
            });

    });

}

exports.acceptRequest = function(req, res){

    console.log("user: " + req.body.currentmail);
    console.log("friend: " + req.body.email);

    User.update({email: req.body.currentmail},
        {$push: {'friends': req.body.email}},
        function(err, user){
            res.send(user);
        });

    User.findOne({email: req.body.email}, function(err, docs) {
        User.update({email: req.body.email},
            {$push: {"friends": req.body.currentmail}},
            function(err, docs){
                res.send(docs);
            });

    });

    console.log("now deleting start");

    User.update({email: req.body.currentmail}, {$pull: {friend_requests: req.body.email}}, false, true)


    console.log("delete finished");


};

exports.declineRequest = function(req, res){

    User.update({email: req.body.currentmail}, {$pull: {friend_requests: req.body.email}}, false, true)

};


exports.deleteoldstatuses = function(req, res){

    var date = new Date();

    User.findOne({email: req.params.email}, function(err, user){
        user.statuses.forEach(function(status){
            var enddate = new Date(status.enddate);
            if(enddate<date){
                // Her slettes statusene og commentsene
                User.update({email: user.email}, {$pull: {statuses:{_id:status._id}}}).exec();
                User.update({email: user.email}, {$pull: {comments:{commentToStatus: status._id}}}).exec();
                User.update({email: user.email}, {$pull: {seen: {statusSeen: status._id}}}).exec();
            }
        })
    });
    res.send();
}

exports.deletestatus = function(req, res){
   var status = req.body;
   User.findOne({email: req.params.email}, function(err, user){
       User.update({email: user.email}, {$pull: {statuses:{_id:status._id}}}).exec();
       User.update({email: user.email}, {$pull: {comments:{commentToStatus: status._id}}}).exec();
   });
   res.send();
}

exports.deletefriend = function(req, res){
    User.update({email: req.body.email}, {$pull: {friends: req.body.currentUserEmail}}, false, true)
    User.update({email: req.body.currentUserEmail}, {$pull: {friends: req.body.email}}, false, true)
    res.send();
}


exports.comment = function(req, res){
    var startdate = new Date();

    User.update({'statuses._id': req.body._id}, { $push: {"comments": {
            text: req.body.newcomment,
            commentToStatus: req.body._id,
            by: req.body.commenter,
            added: startdate
        }}},
        function(err, docs){
        }
    )
}

exports.likes = function(req, res) {

    console.log(req.body);
    console.log(req.body._id);
    console.log(req.body.liker)

        if(req.body.likearray.length == 0){
            console.log('like lista er tom')
            User.update({'statuses._id' : req.body._id}, { $push: {"likes": {
                    likesToStatus: req.body._id,
                    by: req.body.liker
                }}},
                function(err, docs){
                }
            )
        }
        else {
            for (var j=0; j<req.body.likearray.length; j++){
                if(req.body.likearray[j].by == req.body.liker && req.body.likearray[j].likesToStatus == req.body._id){
                    console.log('liken finnes allerede');
                    return;

                }
            }
            User.update({'statuses._id' : req.body._id}, { $push: {"likes": {
                    likesToStatus: req.body._id,
                    by: req.body.liker
                }}},
                function(err, docs){
                }
            )
        }





}

exports.seen = function(req, res){
 //HAHA GØY, BREAK FUNKER IKKE I FOREACHLOOPS


    outerloop: for(var i= 0; i < req.body.statuses.length; i++){

        console.log("i: " + i)
        console.log("statusSeen: " + req.body.statuses[i]._id)


            if(req.body.seen.length == 0){
                console.log("den er tom!")
                User.update({'email': req.body.email}, {$addToSet: {"seen": {

                    seenBy: req.body.watcher,
                    statusSeen: req.body.statuses[i]._id



                }}}, function(err, docs){})

            }
            else{
                for(var j=0; j<req.body.seen.length; j++){
                    if(req.body.seen[j].statusSeen == req.body.statuses[i]._id && req.body.seen[j].seenBy == req.body.watcher){
                        console.log(req.body.statuses[i]._id + " allerede sett!")
                        continue outerloop;
                    }
                }

            }


            if(req.body.seen.length != 0){
                User.update({'email': req.body.email}, {$addToSet: {"seen": {

                    seenBy: req.body.watcher,
                    statusSeen: req.body.statuses[i]._id

                }}}, function(err, docs){})
            }

    }
}

exports.newStatuses = function(req,res){
    User.findOne({email: req.params.email}, function(err, docs) {
        res.send(docs.newStatus);
    });

}

exports.removeNewStatus = function(req, res){

    console.log(req.body)
    User.update({email: req.body.email}, {$pull: {newStatus: req.body.clicksOn}}, false, true)

}
exports.requestUpdate = function(req, res){
    User.update({email: req.params.email}, {$addToSet: {updateRequests: req.body.email}},
        function(err, docs){}
    );
}












