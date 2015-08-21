module.exports = function(app, qs, passport, async, _) {




    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');
    var js2xmlparser = require('js2xmlparser');
    var fs = require('fs');
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


    //get myrosettas
    app.get('/api/myrosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        var contributingOrganization = req.query.contributingOrganization;
        var Status = req.query.status;
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


        //gets rosettas of a specific vendor 
        if (contributingOrganization) {
            query = query.where("contributingOrganization").equals(contributingOrganization);
            queryCount = queryCount.where("contributingOrganization").equals(contributingOrganization);
        }
        if (Status) {
            query = query.where("term.status").equals(Status);
            queryCount = queryCount.where("term.status").equals(Status);
        }





        query.exec(function(err, rosettas) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    rosettas: rosettas,
                }); // return all members in JSON format
                /* console.log(JSON.parse(JSON.stringify(rosettas)));

                test = rosettas[0].term;
                console.log(limit);
                rosettas = {
                    terms: rosettas
                };
                var options = {
                    arrayMap: {
                        terms: "term",
                        groups: "groupName",
                        unitGroups: "unitGroup",
                        units: "unit",
                        ucums: "ucum",
                        comments: "comment",
                        tags: "tag",
                        enumGroups: "enumGroup",
                        enums: "enum",

                    }
                };
                fs.writeFile('test.xml', js2xmlparser("rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    console.log("file saved");
                });


*/

            });

        });
    });


    app.get('/api/download/:rosetta_id', function(req, res, next) {

        Rosetta.findOne({
            _id: req.params.rosetta_id
        }, function(err, rosetta) {
            if (err)
                res.send(err);

            if (rosetta) {
                console.log(req.params);
                rosettas = {
                    terms: rosetta
                };
                var options = {
                    arrayMap: {
                        terms: "term",
                        groups: "groupName",
                        unitGroups: "unitGroup",
                        units: "unit",
                        ucums: "ucum",
                        comments: "comment",
                        tags: "tag",
                        enumGroups: "enumGroup",
                        enums: "enum",

                    }
                };
                fs.writeFile('test.xml', js2xmlparser("rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    console.log("file saved");
                });
                res.end('finish');
            }


        });




    });

    app.get('api/down', function(req, res, next) {
        console.log(Rosetta.find(null));
        
        /*
        var query = Rosetta.find(null);
        query.exec(function(err, ros) {
            console.log("here");
            rosetta = ros;
        }).then(function() {
            console.log("req.params");
            rosettas = {
                terms: rosetta
            };
            var options = {
                arrayMap: {
                    terms: "term",
                    groups: "groupName",
                    unitGroups: "unitGroup",
                    units: "unit",
                    ucums: "ucum",
                    comments: "comment",
                    tags: "tag",
                    enumGroups: "enumGroup",
                    enums: "enum",

                }
            };
            fs.writeFile('test1.xml', js2xmlparser("rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                //res.download('test.xml');
                if (err) {
                    return console.log(err);
                }
                console.log("file saved");
                res.end('finish');
            });
            return;
        });
*/
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
    app.post('/api/rosettas', function(req, res, next) {
        //        console.log(req.body);

        var query = Rosetta.find(null);
        query.sort({
            _id: -1
        }).exec(function(err, ros) {
            max = ros[0]._id;


        }).then(function() {
            var rosetta = new Rosetta(req.body);
            rosetta._id = max + 1;
            rosetta.save(function(err, rosetta) {
                if (err) {
                    return next(err)
                }
                res.json(201, rosetta)
            });
            return;

        });

    });


    //update a rosetta term
    app.put('/api/myrosettas/:rosetta_id', isCOLoggedIn, function(req, res) {
        Rosetta.findOneAndUpdate({
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
    app.delete('/api/rosettas/:rosetta_id', isSDOLoggedIn, function(req, res) {
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

    app.get('/api/rosettarefids', function(req, res, next) {
        var filter = req.query.filter;
        var limit = req.query.limit;

        queryRosettas = Rosetta.find();
        if (filter) {
            queryRosettas = queryRosettas.where('term.refid').regex(new RegExp(filter, 'i'));
        }
        if (limit) {
            queryRosettas.limit(limit);
        }
        queryRosettas.exec(function(err, rosettas) {
            if (err) {
                return next(err);
            }
            res.json(rosettas);
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

    function downXml(object) {
        console.log("XML");
        jstoxml.toXML(JSON.parse(JSON.stringify(object)));

    }


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
        if (req.isAuthenticated() && req.user.userTypes.id === 4) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isCOLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an admin role, carry on 
        console.log(req.user);
        if (req.isAuthenticated() && (req.user.userTypes.id === 1 || req.user.userTypes.id === 3)) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isSDOLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an admin role, carry on 
        console.log(req.user);
        if (req.isAuthenticated() && req.user.userTypes.id === 3) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }


}
