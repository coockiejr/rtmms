module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');

    //get all enums
    app.get('/api/enumgroups', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = EnumGroup.find();
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

        query.exec(function(err, enumGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            queryNoLimit.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    enumGroups: enumGroups
                }); 
            });

        });
    });

    // get an enum
    app.get('/api/enumgroups/:enumgroup_id', function(req, res) {
        EnumGroup.findOne({
            _id: req.params.enumgroup_id
        }, function(err, enumGrp) {
            if (err)
                res.send(err);

            if (enumGrp) {
                res.json(enumGrp);
            }


        });
    });

    // create enum 
    app.post('/api/enumgroups', isAdminLoggedIn, function(req, res) {
        EnumGroup.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateofbirth: req.body.dateofbirth,
            sex: req.body.sex,
            bio: req.body.bio,
            memberStatus: req.body.memberStatus
        }, function(err, enumGrp) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Enumeration group created successfully", "status" : 200}');
            }

        });
    });

    //update an enum term
    app.put('/api/enumgroups/:enumgroup_id', isAdminLoggedIn, function(req, res) {
        EnumGroup.update({
            _id: req.params.enumgroup_id
        }, req.body, function(err) {
            if (!err) {
                res.end('{"success" : "Enumeration group updated successfully", "status" : 200}');
            } else {
                console.log(err);
                res.send(err);
            }
        });

    });


    // delete an enum
    app.delete('/api/enumgroups/:enumgroup_id', isAdminLoggedIn, function(req, res) {
        EnumGroup.remove({
            _id: req.params.enumgroup_id
        }, function(err, enumVal) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Enumeration group deleted successfully", "status" : 200}');
            }
        });
    });


    

    // get enum tags
    app.get('/api/enumgrouptags', function(req, res) {
        var q = req.query.query;
        query = EnumGroup.distinct('tags', {
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
