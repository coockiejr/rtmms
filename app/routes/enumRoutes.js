module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');

    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all enums
    app.get('/api/enums', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = Enum.find();
        queryCount = Enum.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                if (columnNumberSearch.indexOf(f.column) !== -1) {
                    query = query.where(f.column).equals(f.value);
                    queryCount = queryCount.where(f.column).equals(f.value);
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

        query.exec(function(err, enums) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }


            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    enums: enums
                });
            });

        });
    });

    // get an enum
    app.get('/api/enums/:enum_id', function(req, res) {
        Enum.findOne({
            _id: req.params.enum_id
        }, function(err, enumVal) {
            if (err)
                res.send(err);

            if (enumVal) {
                res.json(enumVal);
            }


        });
    });

    // create enum 
    app.post('/api/enums', isAdminLoggedIn, function(req, res,next) {
        var query=Enum.find(null);
    query.sort({_id:-1}).exec(function(err,enu){
       max=enu[0]._id;
     
    }).then(function(){
            console.log(req.body);
            var enumVal=new Enum(req.body);
            enumVal._id=max+1;
            enumVal.save(function(err,enumVal){
            if(err) {return next(err)}
            res.json(201,enumVal)
            });
            return;

    });
       
    });


    //update an enum term
    app.put('/api/enums/:enum_id', isAdminLoggedIn, function(req, res) {
                console.log(req.body);

        Enum.findOneAndUpdate({
            _id: req.params.enum_id
        }, req.body, function(err) {
            if (!err) {
                res.end('{"success" : "Enumeration value updated successfully", "status" : 200}');
            } else {
                console.log(err);
                res.send(err);
            }
        });

    });


    // delete an enum
    app.delete('/api/enums/:enum_id', isAdminLoggedIn, function(req, res) {
        Enum.remove({
            _id: req.params.enum_id
        }, function(err, enumVal) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Enumeration value deleted successfully", "status" : 200}');
            }
        });
    });


    // get enum tags
    app.get('/api/enumtags', function(req, res) {
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

    app.get('/api/enumsandenumgroups', function(req, res) {
        var filter = req.query.filter;
        var sort = req.query.sort;
        var limit = req.query.limit;

        queryEnumGroups = EnumGroup.find();
        queryEnums = Enum.find();
        if (filter) {
            queryEnumGroups = queryEnumGroups.where('groupName').regex(new RegExp(filter, 'i'));
            // queryEnums = queryEnums.where('refid').regex(new RegExp(filter, 'i'));
            queryEnums = queryEnums.or([{ 'term.refid': { $regex: new RegExp(filter, 'i') }}, { 'token': { $regex: new RegExp(filter, 'i') }}])
        }
        if (limit) {
            queryEnumGroups.limit(limit);
        }

        var results = [];
        queryEnumGroups.exec(function(err, enumGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            results = results.concat(enumGroups);
            if (limit) {
                queryEnums.limit(limit);
            }

            queryEnums.exec(function(error, enums) {
                results = results.concat(enums);
                res.json(results);
            });

        });
    });


    //get all enums groups
    app.get('/api/enumgroups', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = EnumGroup.find();
        queryCount = EnumGroup.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                query = query.where(f.column).regex(new RegExp(f.value, 'i'));
                queryCount = queryCount.where(f.column).regex(new RegExp(f.value, 'i'));
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

        query.exec(function(err, enumGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    enumGroups: enumGroups
                });
            });

        });
    });

    // get an enum group
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

    // create enum group
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

    //update an enum group
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


    // delete an enum group
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




    // get enum groups tags
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

     app.get('/api/enumrefids', function(req, res,next) {
       var filter = req.query.filter;
        var limit = req.query.limit;

       queryEnums=Enum.find();
       if(filter){
        queryEnums=queryEnums.where('term.refid').regex(new RegExp(filter,'i'));
       }
       if(limit){
        queryEnums.limit(limit);
       }
       queryEnums.exec(function(err,enums){
        if(err) { return next(err); }
        res.json(enums);
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
