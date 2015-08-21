module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Ucum =require('./../models/ucum');

    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all units
    app.get('/api/units', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        var Status = req.query.status;

        query = Unit.find();
        queryCount = Unit.find();
        if (filters) {
            if (typeof filters === 'string') {
                filters = [filters];
            }
            filters.forEach(function(f) {
                f = JSON.parse(f);
                if (columnNumberSearch.indexOf(f.column) !== -1) {
                    query = query.where(f.column).equals(f.value);
                    queryCount = queryCount.where(f.column).equals(f.value);
                }else {
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
        if (Status) {
            query = query.where("term.status").equals(Status);
            queryCount = queryCount.where("term.status").equals(Status);
        }

        query.exec(function(err, units) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }


            queryCount.count().exec(function(error, count) {
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
    app.post('/api/units', isAdminLoggedIn, function(req, res,next) {
        var query=Unit.find(null);
    query.sort({_id:-1}).exec(function(err,uni){
       max=uni[0]._id;
     console.log(uni[0]);
     console.log(max);

    }).then(function(){
        console.log(req.body);
            var unitVal=new Unit(req.body);
            unitVal._id=max+1;
            unitVal.save(function(err,unitVal){
            if(err) {return next(err)}
            res.json(201,unitVal)
            });
            return;

    });
       
    });

    //update an unit term
    app.put('/api/units/:unit_id', isAdminLoggedIn, function(req, res) {
        console.log(req.body);
        Unit.findOneAndUpdate({
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
        console.log(req.query);
        console.log(q);
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

       app.get('/api/unitrefids', function(req, res,next) {
       var filter = req.query.filter;
        var limit = req.query.limit;

       queryUnits=Unit.find();
       if(filter){
        queryUnits=queryUnits.where('term.refid').regex(new RegExp(filter,'i'));
       }
       if(limit){
        queryUnits.limit(limit);
       }
       queryUnits.exec(function(err,units){
        if(err) { return next(err); }
        res.json(units);
       });
    });

    app.get('/api/unitsandunitgroups', function(req, res) {
        var filter = req.query.filter;
        var sort = req.query.sort;
        var limit = req.query.limit;

        queryUnitGroups = UnitGroup.find();
        queryUnits = Unit.find();
        if (filter) {
                queryUnitGroups = queryUnitGroups.where('groupName').regex(new RegExp(filter, 'i'));
                queryUnits = queryUnits.where('term.refid').regex(new RegExp(filter, 'i'));
        }
        if (limit){
            queryUnitGroups.limit(limit);
        }

        var results = [];
        queryUnitGroups.exec(function(err, unitGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            results = results.concat(unitGroups);
            if (limit){
                queryUnits.limit(limit);
            }

            queryUnits.exec(function(error, units) {
                results = results.concat(units);
                res.json(results); 
            });

        });
    });

    app.get('/api/unitucums', function(req, res) {
        var filter = req.query.filter;
        var sort = req.query.sort;
        var limit = req.query.limit;

        queryUnits = Unit.find();
                        

        if (filter) {
                queryUnits = queryUnits.where('ucums.ucum').regex(new RegExp(filter, 'i'));
        }
         if (limit){
            queryUnits.limit(limit);
        }

        var results = [];
        
            queryUnits.exec(function(error, units) {

                results = results.concat(units);
                res.json(results); 
            });

       
    });

     


    //get all unit groups
    app.get('/api/unitgroups', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        query = UnitGroup.find();
        queryCount = UnitGroup.find();
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

        query.exec(function(err, unitGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }
                              //  console.log(unitGroups);

            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    unitGroups: unitGroups
                }); 
            });

        });
    });

    // get an unitgroup
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

    // create unit group
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

    //update an unit group
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


    // delete an unit group
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

    // get ucums
    app.get('/api/ucums', function(req, res,next) {
        var limit = req.query.limit;
        var filter=req.query.filter;
        queryUcums=Ucum.find();
        if(filter){
            queryUcums=queryUcums.where('value').regex(new RegExp(filter,'i'));
        }
        if(limit){
            queryUcums.limit(limit);
        }
        queryUcums.exec(function(err,ucums){
            if(err) { return next(err); }
            res.json(ucums);
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
