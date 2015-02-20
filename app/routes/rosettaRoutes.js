module.exports = function(app, qs, passport, async) {



    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');


    //get all rosetta
    app.get('/api/hrosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        var query = Rosetta.aggregate([
            {
                $group: {
                    _id: "$refid",
                    tags: {
                        "$addToSet": "$tags"
                    },
                    groups: {
                        "$addToSet": "$groups"
                    }
                }
            },
            {
                $unwind: "$tags"
            }, {
                $unwind: "$tags"
            }, {
                $unwind: "$groups"
            }, {
                $unwind: "$groups"
            },
            {
                $group: {
                    _id: "$_id",
                    tags: {
                        "$addToSet": "$tags"
                    },
                    groups: {
                        "$addToSet": "$groups"
                    }
                }
            }

        ]);

        // query.group({
        //     _id: "$refid",
        //     tags: {
        //         "$addToSet": "$tags"
        //     }
        // })

        query.match({
            _id: {
                $regex: '^(?!MDCX_).*$',
                $options: 'i'
            }
        });



        if (filters) {

        }

        var results = [];
        var refids = [];
        query.exec(function(err, hrosettas) {
            if (err) {
                res.send(err)
            }

            console.log(hrosettas.length);



            res.json(hrosettas); // return all members in JSON format
        });




        // var group1 = {
        //     "$group": {
        //         _id: "$refid",
        //         code10: {
        //             $addToSet: "$code10"
        //         },
        //         cfCode10: {
        //             $addToSet: "$cfCode10"
        //         },
        //         partition: {
        //             $addToSet: "$partition"
        //         },
        //         groups: {
        //             $push: "$groups"
        //         },
        //         displayName: {
        //             $addToSet: "$displayName"
        //         },
        //         vendorVmd: {
        //             $addToSet: "$vendorVmd"
        //         },
        //         unitGroups: {
        //             $push: "$unitGroups"
        //         },
        //         units: {
        //             $push: "$units"
        //         },
        //         enumGroups: {
        //             $push: "$enumGroups"
        //         },
        //         enums: {
        //             $push: "$enums"
        //         },
        //         systematicName: {
        //             $addToSet: "$systematicName"
        //         },
        //         commonTerm: {
        //             $addToSet: "$commonTerm"
        //         },
        //         acronym: {
        //             $addToSet: "$acronym"
        //         },
        //         termDescription: {
        //             $addToSet: "$termDescription"
        //         },
        //         comments: {
        //             $addToSet: "$comments"
        //         },
        //         tags: {
        //             $push: "$tags"
        //         }
        //     }
        // };

        // var project1 = {
        //     "$project": {
        //         "groups": {
        //             "$cond": [{
        //                     "$eq": ["$groups", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$groups"
        //             ]
        //         },
        //         "units": {
        //             "$cond": [{
        //                     "$eq": ["$units", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$units"
        //             ]
        //         },
        //         "unitGroups": {
        //             "$cond": [{
        //                     "$eq": ["$unitGroups", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$unitGroups"
        //             ]
        //         },
        //         "enums": {
        //             "$cond": [{
        //                     "$eq": ["$enums", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$enums"
        //             ]
        //         },
        //         "enumGroups": {
        //             "$cond": [{
        //                     "$eq": ["$enumGroups", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$enumGroups"
        //             ]
        //         },
        //         "tags": {
        //             "$cond": [{
        //                     "$eq": ["$tags", [
        //                         []
        //                     ]]
        //                 },
        //                 [
        //                     [null]
        //                 ],
        //                 "$tags"
        //             ]
        //         }
        //     }
        // };


        // var unwind = {
        //     "$unwind": "$groups",
        //     "$unwind": "$units",
        //     "$unwind": "$unitGroups",
        //     "$unwind": "$enums",
        //     "$unwind": "$enumGroups",
        //     "$unwind": "$tags"
        // };


        // var group2 = {
        //     "$group": {
        //         "_id": "$_id",
        //         "tags": {
        //             "$addToSet": "$tags"
        //         },
        //         "groups": {
        //             "$addToSet": "$groups"
        //         },
        //         "units": {
        //             "$addToSet": "$units"
        //         },
        //         "unitGroups": {
        //             "$addToSet": "$unitGroups"
        //         },
        //         "enums": {
        //             "$addToSet": "$enums"
        //         },
        //         "enumGroups": {
        //             "$addToSet": "$enumGroups"
        //         }
        //     }
        // };

        // var project2 = {
        //     "$project": {
        //         "refid": "$_id",
        //         "groups": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$groups", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$groups"
        //             ]
        //         },
        //         "units": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$units", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$units"
        //             ]
        //         },
        //         "unitGroups": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$unitGroups", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$unitGroups"
        //             ]
        //         },
        //         "enums": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$enums", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$enums"
        //             ]
        //         },
        //         "enumGroups": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$enumGroups", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$enumGroups"
        //             ]
        //         },
        //         "tags": {
        //             "$cond": [{
        //                     "$eq": [
        //                         "$tags", [null]
        //                     ]
        //                 },
        //                 [],
        //                 "$tags"
        //             ]
        //         }
        //     }

        // };

        //var query = Rosetta.aggregate(group1, project1, unwind, unwind, group2, project2);

        // query.match({
        //     refid: {
        //         $regex: '^(?!MDCX_).*$',
        //         $options: 'i'
        //     }
        // });

        // not mdcx_
        // query.project({
        //     tags: {
        //         $addToSet: "$unitGroups"
        //     }

        // });

        // if (filters) {

        // }

        // if (sort) {
        //     query = query.sort(sort);
        // }
        // if (limit) {
        //     query = query.limit(req.query.limit);
        // }

        // if (skip) {
        //     query = query.skip(req.query.skip);
        // }


        // query.exec(function(err, hrosettas) {
        //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        //     if (err) {
        //         res.send(err)
        //     }
        //     // generateHrosetta

        //     console.log(hrosettas.length);


        //     res.json(hrosettas); // return all members in JSON format
        // });
    });



    //get all rosetta
    app.get('/api/rosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = Rosetta.find();
        if (filters) {

        }

        if (sort) {
            query = query.sort(sort);
        }
        if (limit) {
            query = query.limit(req.query.limit);
        }

        if (skip) {
            query = query.skip(req.query.skip);
        }

        var start = new Date();
        query.exec(function(err, rosettas) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }
            var end = new Date();
            console.log(end - start);
            res.json(rosettas); // return all members in JSON format
        });
    });

    // get a rosetta
    app.get('/api/rosettas/:rosetta_id', function(req, res) {
        Rosetta.findOne({
            _id: req.params.rosetta_id
        }, function(err, rosetta) {
            if (err)
                res.send(err);

            if (rosetta) {
                res.json(rosetta);
            }


        });
    });

    // create rosetta 
    app.post('/api/rosettas', isAdminLoggedIn, function(req, res) {
        Rosetta.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateofbirth: req.body.dateofbirth,
            sex: req.body.sex,
            bio: req.body.bio,
            memberStatus: req.body.memberStatus,
            done: false
        }, function(err, rosetta) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Rosetta created successfully", "status" : 200}');
            }

        });
    });

    //update a rosetta term
    app.put('/api/rosettas/:rosetta_id', isAdminLoggedIn, function(req, res) {
        Member.findById(req.params.member_id, function(err, rosetta) {
            //update here
            rosetta.save(function(err) {
                if (!err) {

                } else {
                    console.log(err);
                    res.send(err);
                }
            });
        });



    });


    // delete a rosetta
    app.delete('/api/rosettas/:rosetta_id', isAdminLoggedIn, function(req, res) {
        Member.remove({
            _id: req.params.rosetta_id
        }, function(err, rosetta) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Rosetta deleted successfully", "status" : 200}');
            }
        });
    });




    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    // route middleware to make sure a user is logged in and an admin
    function isAdminLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an admin role, carry on 
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }


}
