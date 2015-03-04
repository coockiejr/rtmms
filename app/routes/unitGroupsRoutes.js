module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');

    //get all units
    app.get('/api/unitgroups', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = UnitGroup.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                    query = query.where(f.column).regex(new RegExp(f.value, 'i'));
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

        var queryNoLimit = query;

        if (limit) {
            query = query.limit(req.query.limit);
        }

        query.exec(function(err, unitGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            queryNoLimit.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    unitGroups: unitGroups
                }); 
            });

        });
    });

    // get an unit
    app.get('/api/unitgroups/:unitgroup_id', function(req, res) {
        UnitGroup.findOne({
            _id: req.params.unitgroup_id
        }, function(err, unitGrp) {
            if (err)
                res.send(err);

            if (unitGrp) {
                res.json(unitGrp);
            }


        });
    });

    // create unit 
    app.post('/api/unitgroups', isAdminLoggedIn, function(req, res) {
        UnitGroup.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateofbirth: req.body.dateofbirth,
            sex: req.body.sex,
            bio: req.body.bio,
            memberStatus: req.body.memberStatus
        }, function(err, unitGrp) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Unit group created successfully", "status" : 200}');
            }

        });
    });

    //update an unit term
    app.put('/api/unitgroups/:unitgroup_id', isAdminLoggedIn, function(req, res) {
        UnitGroup.update({
            _id: req.params.unitgroup_id
        }, req.body, function(err) {
            if (!err) {
                res.end('{"success" : "Unit group updated successfully", "status" : 200}');
            } else {
                console.log(err);
                res.send(err);
            }
        });

    });


    // delete an unit
    app.delete('/api/unitgroups/:unitgroup_id', isAdminLoggedIn, function(req, res) {
        UnitGroup.remove({
            _id: req.params.unitgroup_id
        }, function(err, unitVal) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Unit group deleted successfully", "status" : 200}');
            }
        });
    });


    

    // get unit tags
    app.get('/api/unitgrouptags', function(req, res) {
        var q = req.query.query;
        query = UnitGroup.distinct('tags', {
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
