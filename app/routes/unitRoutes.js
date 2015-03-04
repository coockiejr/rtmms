module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');

    var columnNumberSearch = ['ecode10', 'cfECode10', 'partition'];

    //get all units
    app.get('/api/units', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = Unit.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                if (columnNumberSearch.indexOf(f.column) !== -1) {
                    query = query.where(f.column).equals(f.value);
                }else {
                    query = query.where(f.column).regex(new RegExp(f.value, 'i'));
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

        var queryNoLimit = query;

        if (limit) {
            query = query.limit(req.query.limit);
        }

        query.exec(function(err, units) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }


            queryNoLimit.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    units: units
                }); 
            });

        });
    });

    // get an unit
    app.get('/api/units/:unit_id', function(req, res) {
        Unit.findOne({
            _id: req.params.unit_id
        }, function(err, unitVal) {
            if (err)
                res.send(err);

            if (unitVal) {
                res.json(unitVal);
            }


        });
    });

    // create unit 
    app.post('/api/units', isAdminLoggedIn, function(req, res) {
        Unit.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateofbirth: req.body.dateofbirth,
            sex: req.body.sex,
            bio: req.body.bio,
            memberStatus: req.body.memberStatus
        }, function(err, unitVal) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Unit value created successfully", "status" : 200}');
            }

        });
    });

    //update an unit term
    app.put('/api/units/:unit_id', isAdminLoggedIn, function(req, res) {
        Unit.update({
            _id: req.params.unit_id
        }, req.body, function(err) {
            if (!err) {
                res.end('{"success" : "Unit value updated successfully", "status" : 200}');
            } else {
                console.log(err);
                res.send(err);
            }
        });

    });


    // delete an unit
    app.delete('/api/units/:unit_id', isAdminLoggedIn, function(req, res) {
        Unit.remove({
            _id: req.params.unit_id
        }, function(err, unitVal) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Unit value deleted successfully", "status" : 200}');
            }
        });
    });


    

    // get unit tags
    app.get('/api/unittags', function(req, res) {
        var q = req.query.query;
        query = Unit.distinct('tags', {
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
