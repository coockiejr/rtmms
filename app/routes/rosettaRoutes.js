module.exports = function(app, qs, async, _) {


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

        var query = Rosetta.aggregate([{
            $group: {
                _id: "$refid"
            }
        }]);

        query.match({
            _id: {
                $regex: '^(?!MDCX_).*$',
                $options: 'i'
            }
        });

        var calls = [];
        var results = [];
        var refids = [];
        var findRes = {};
        query.exec(function(err, hrosettas) {
            if (err) {
                res.send(err)
            }



            for (i = 0; i < hrosettas.length; i++) {
                refids.push(hrosettas[i]._id);
            }

            fetchRosettas = function(refid, callback) {
                query = Rosetta.find();
                query = query.where('refid').equals(refid);
                query.exec(function(err, rosettas) {
                    if (err) {
                        callback(err);
                    }
                    findRes[refid] = rosettas;

                    callback(null);
                });

            }


            updateHrosetta = function(rosettas, callback) {

            }



            async.map(refids, fetchRosettas, function(err) {
                if (err)
                    return res.send(err);

                // console.log(findRes);
                fullreport = [];


                async.each(hrosettas, function(r, callback) {
                        // for (i = 0; i < hrosettas.length; i++) {
                        var refid = r._id;


                        var hros = {};
                        hros._id = refid;
                        hros.refid = refid;
                        if (findRes[refid][0].code10 !== undefined) {
                            hros.code10 = findRes[refid][0].code10
                        };
                        if (findRes[refid][0].cfCode10 !== undefined) {
                            hros.cfCode10 = findRes[refid][0].cfCode10
                        };
                        if (findRes[refid][0].partition !== undefined) {
                            hros.partition = findRes[refid][0].partition
                        };



                        var groups = [];
                        var vendorUom = [];
                        var displayName = [];
                        var unitGroups = [];
                        var units = [];
                        var enumGroups = [];
                        var enums = [];
                        var tags = [];

                        findRes[refid].forEach(function(r) {
                            if (r.groups !== 'N/A') {
                                r.groups.forEach(function(g) {
                                    groups.push(g);
                                });
                            }
                            if (r.vendorUom !== undefined) {
                                vendorUom.push(r.vendorUom);
                            }

                            if (r.displayName !== undefined) {
                                displayName.push(r.displayName);
                            }

                            if (r.unitGroups !== 'N/A') {
                                r.unitGroups.forEach(function(ug) {
                                    unitGroups.push(ug);
                                });
                            }

                            if (r.units !== 'N/A') {
                                r.units.forEach(function(u) {
                                    units.push(u);
                                });
                            }
                            if (r.enumGroups !== 'N/A') {
                                r.enumGroups.forEach(function(eg) {
                                    enumGroups.push(eg);
                                });
                            }
                            if (r.enums !== 'N/A') {
                                r.enums.forEach(function(e) {
                                    enums.push(e);
                                });
                            }

                            if (r.tags !== 'N/A') {
                                r.tags.forEach(function(e) {
                                    tags.push(e);
                                });
                            }

                        });
                        groups = _.union(groups);
                        vendorUom = _.union(vendorUom);
                        displayName = _.union(displayName);
                        unitGroups = _.union(unitGroups);
                        units = _.union(units);
                        enumGroups = _.union(enumGroups);
                        enums = _.union(enums);
                        tags = _.union(tags);


                        if (groups.length > 0) {
                            hros.groups = groups;
                        };
                        if (vendorUom.length > 0) {
                            hros.vendorUom = vendorUom;
                        };
                        if (displayName.length > 0) {
                            hros.displayName = displayName;
                        };
                        if (unitGroups.length > 0) {
                            hros.unitGroups = unitGroups;
                        };
                        if (units.length > 0) {
                            hros.units = units;
                        };
                        if (enumGroups.length > 0) {
                            hros.enumGroups = enumGroups;
                        };
                        if (enums.length > 0) {
                            hros.enums = enums;
                        };
                        if (tags.length > 0) {
                            hros.tags = tags;
                        }

                        var hr = HRosetta.update({
                            _id: refid
                        }, 
                            hros
                        , {
                            upsert: true
                        }, function(err, r) {
                            if (err) {
                                callback(err);
                            }
                            callback(null);
                        });


                    },
                    function(err) {
                        // if any of the file processing produced an error, err would equal that error
                        if (err) {
                            console.log(err);
                        } else {
                            HRosetta.find({}, function(err, finalHRosettas) {
                                console.log(finalHRosettas.length);
                                res.json(finalHRosettas)
                            });
                        }
                    });
            });
        });
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
