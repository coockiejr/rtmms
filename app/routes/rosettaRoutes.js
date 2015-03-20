module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');

    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all rosetta
    app.get('/api/rosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = Rosetta.find();
        queryCount = Rosetta.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                if (columnNumberSearch.indexOf(f.column) !== -1) {
                    query = query.where(f.column).equals(f.value);
                    queryCount = queryCount.where(f.column).equals(f.value);
                } else if (f.column === 'units') {
                    query = query.or([{
                        "units.refid": new RegExp(f.value, 'i')
                    }, {
                        "unitGroups.groupName": new RegExp(f.value, 'i')
                    }]);
                    queryCount = queryCount.or([{
                        "units.refid": new RegExp(f.value, 'i')
                    }, {
                        "unitGroups.groupName": new RegExp(f.value, 'i')
                    }]);
                } else if (f.column === 'enums') {
                    query = query.or([{
                        "enums.refid": new RegExp(f.value, 'i')
                    }, {
                        "enums.token": new RegExp(f.value, 'i')
                    }, {
                        "enumGroups.groupName": new RegExp(f.value, 'i')
                    }]);
                     queryCount = queryCount.or([{
                        "enums.refid": new RegExp(f.value, 'i')
                    }, {
                        "enums.token": new RegExp(f.value, 'i')
                    }, {
                        "enumGroups.groupName": new RegExp(f.value, 'i')
                    }]);
                } else if (f.column === 'ucums') {
                    query = query.or([{
                        "units.ucums.ucum": new RegExp(f.value, 'i')
                    }, {
                        "unitGroups.units.ucums.ucum": new RegExp(f.value, 'i')
                    }]);
                    queryCount = queryCount.or([{
                        "units.ucums.ucum": new RegExp(f.value, 'i')
                    }, {
                        "unitGroups.units.ucums.ucum": new RegExp(f.value, 'i')
                    }]);
                } else {
                    query = query.where(f.column).regex(new RegExp(f.value, 'i'));
                    queryCount = queryCount.where(f.column).regex(new RegExp(f.value, 'i'));
                }

            });

        }



        if (sort) {
            sort = JSON.parse(sort);
            sortQ = {};
            sortQ[sort.column] = sort.value;
            query = query.sort(sortQ);
        }

        if (skip) {
            query = query.skip(req.query.skip);
        }



        if (limit) {
            query = query.limit(req.query.limit);
        }

        query.exec(function(err, rosettas) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    rosettas: rosettas
                }); // return all members in JSON format
            });

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
        Rosetta.update({
            _id: req.params.rosetta_id
        }, req.body, function(err) {
            if (!err) {
                res.end('{"success" : "Rosetta updated successfully", "status" : 200}');
            } else {
                console.log(err);
                res.send(err);
            }
        });

    });


    // delete a rosetta
    app.delete('/api/rosettas/:rosetta_id', isAdminLoggedIn, function(req, res) {
        Rosetta.remove({
            _id: req.params.rosetta_id
        }, function(err, rosetta) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Rosetta deleted successfully", "status" : 200}');
            }
        });
    });


    // get rosetta groups
    app.get('/api/rosettagroups', function(req, res) {
        var q = req.query.query;
        query = Rosetta.distinct('groups', {
            groups: {
                $regex: q,
                $options: 'i'
            }
        }).sort();
        query.exec(function(err, groups) {
            if (err) {
                res.send(err)
            }
            res.json(groups);
        });
    });

    // get rosetta tags
    app.get('/api/rosettatags', function(req, res) {
        var q = req.query.query;
        query = Rosetta.distinct('tags', {
            groups: {
                $regex: q,
                $options: 'i'
            }
        }).sort();
        query.exec(function(err, tags) {
            if (err) {
                res.send(err)
            }
            res.json(tags);
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
        // if (req.isAuthenticated() && req.user.role === 'admin') {
        if (true) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }


}
