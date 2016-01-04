module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Ucum = require('./../models/ucum');
    var js2xmlparser = require('js2xmlparser');
    var json2csv = require('nice-json2csv');
    var fs = require('fs');
    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all units
    app.get('/api/units', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        var Status = req.query.status;
        var partition = req.query.partition;

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
        if (Status) {
     //query = query.where("term.status").equals(Status);
     //queryCount = queryCount.where("term.status").equals(Status);
     query = query.and([{
         'term.status': {
             $ne: Status
         }
     }, {
         'term.status': {
             $exists: true
         }
     }, {
         'term.status': {
             $ne: "pMapped"
         }
     }]);
     queryCount = queryCount.and([{
         'term.status': {
             $ne: Status
         }
     }, {
         'term.status': {
             $exists: true
         }
     }, {
         'term.status': {
             $ne: "pMapped"
         }
     }]);
     //query=query.where({'term.status':{$ne:Status}}).where({'term.status':{$exists:true}}).where({'term.status':{$ne:"pMapped"}});
     //queryCount=queryCount.where({'term.status':{$ne:Status}}).where({'term.status':{$exists:true}}).where({'term.status':{$ne:"pMapped"}});
 }

        if (partition) {
            query = query.where("term.partition").equals(partition);
            // queryCount = queryCount.where("term.partition").equals(partition);
            query.sort('-term.code10').exec(function(err, ros) {
                if (ros[0] !== undefined && ros[0].term !== undefined && ros[0].term.code10 !== undefined) {
                    max = ros[0].term.code10;

                } else {
                    res.send("This partition does not exist");
                }


            }).then(function() {

                nextPart = {

                    next: max + 1
                };
                res.json(nextPart);

            });
        } else {
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
        }


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
    app.post('/api/units', isCOLoggedIn, function(req, res, next) {
        var query = Unit.find(null);
        query.sort({
            _id: -1
        }).exec(function(err, uni) {
            max = uni[0]._id;
            console.log(uni[0]);
            console.log(max);

        }).then(function() {
            console.log(req.body);
            var unitVal = new Unit(req.body);
            unitVal._id = max + 1;
            unitVal.save(function(err, unitVal) {
                if (err) {
                    return next(err)
                }
                res.json(201, unitVal)
            });
            return;

        });

    });

    //update an unit term
    app.put('/api/units/:unit_id', isCOLoggedIn, function(req, res) {
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

    app.get('/api/unitrefids', function(req, res, next) {
        var filter = req.query.filter;
        var limit = req.query.limit;

        queryUnits = Unit.find();
        if (filter) {
            queryUnits = queryUnits.where('term.refid').regex(new RegExp(filter, 'i'));
        }
        if (limit) {
            queryUnits.limit(limit);
        }
        queryUnits.exec(function(err, units) {
            if (err) {
                return next(err);
            }
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
        if (limit) {
            queryUnitGroups.limit(limit);
        }

        var results = [];
        queryUnitGroups.exec(function(err, unitGroups) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }

            results = results.concat(unitGroups);
            if (limit) {
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
        if (limit) {
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
    app.get('/api/ucums', function(req, res, next) {
        var limit = req.query.limit;
        var filter = req.query.filter;
        queryUcums = Ucum.find();
        if (filter) {
            queryUcums = queryUcums.where('value').regex(new RegExp(filter, 'i'));
        }
        if (limit) {
            queryUcums.limit(limit);
        }
        queryUcums.exec(function(err, ucums) {
            if (err) {
                return next(err);
            }
            res.json(ucums);
        });

    });

    app.get('/api/downloadU/:par', function(req, res, next) {

        if (req.params.par === "allXML") {
            var query = Unit.find(null);
            query.exec(function(err, ros) {
                unitVal = ros;
            }).then(function() {
                unitVals = {
                    terms: unitVal
                };
                var options = {
                    arrayMap: {
                        terms: "term",
                        unitGroups: "unitGroup",
                        ucums: "ucum",
                        comments: "comment",
                        tags: "tag",

                    }
                };
                fs.writeFile('./public/docs/unit_terms.xml', js2xmlparser("units", JSON.parse(JSON.stringify(unitVals)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    res.setHeader('Content-disposition', 'attachment; filename=unit_terms.xml');
                    var filestream = fs.createReadStream('./public/docs/unit_terms.xml');
                    filestream.pipe(res);
                });
            });
        } else if (req.params.par === "allCSV" || req.params.par === "allHTML") {
            var query = Unit.find(null);
            query.exec(function(err, ros) {
                unitVal = ros;
            }).then(function() {
                //console.log(rosetta);
                unitVals = [];


                for (i = 0; i < unitVal.length; i++) {
                    ucum = '';
                    unitGroup = '';

                    if (unitVal[i].unitGroups !== undefined) {

                        for (k = 0; k < unitVal[i].unitGroups.length; k++) {
                            unitGroup = unitVal[i].unitGroups[k].groupName + ' ' + unitGroup;
                        }


                    }
                    if (unitVal[i].ucums !== undefined) {

                        for (k = 0; k < unitVal[i].ucums.length; k++) {
                            ucum = unitVal[i].ucums[k].value + ' ' + ucum;
                        }


                    }

                    if (unitVal[i].tags !== undefined) {
                        tags = '';
                        for (j = 0; j < unitVal[i].tags.length; j++) {


                            tags = unitVal[i].tags[j] + ' ' + tags;

                        };
                    }


                    unitVals[i] = {
                        UOM_Groups: unitGroup,
                        Dimension: unitVal[i].dimension,
                        DIM: unitVal[i].dim,
                        DIMC: unitVal[i].dimC,
                        Symbol: unitVal[i].symbol,
                        UOM_UCUM: ucum,
                        UOM_MDC: unitVal[i].term.refid,
                        UCODE10: unitVal[i].term.code10,
                        CF_UCODE10: unitVal[i].term.cfCode10,
                        Tags: tags




                    };

                };
                if (req.params.par === "allCSV") {
                    fs.writeFile('./public/docs/unit_terms.csv', json2csv.convert(JSON.parse(JSON.stringify(unitVals))), function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=unit_terms.csv');
                        var filestream = fs.createReadStream('./public/docs/unit_terms.csv');
                        filestream.pipe(res);
                    });
                } else if (req.params.par === "allHTML") {
                    var html = '<html><head></head><body><h2> Unit terms</h2><table border="1"><tbody><tr bgcolor="#FFCC00"><th>#</th><th>UOM_Groups</th><th>Dimension</th><th>DIM</th><th>DIMC</th><th>Symbol</th><th>UOM_UCUM</th><th>UOM_MDC</th><th>UCODE10</th><th>CF_UCODE10</th><th>Tags</th></tr>';
                    for (i = 0; i < unitVals.length; i++) {
                        html = html + '<tr>';
                        html = html + "<td>" + (i + 1) + "</td>";
                        html = html + "<td>" + unitVals[i].UOM_Groups + "</td>";
                        html = html + "<td>" + unitVals[i].Dimension + "</td>";
                        html = html + "<td>" + unitVals[i].DIM + "</td>";
                        html = html + "<td>" + unitVals[i].DIMC + "</td>";
                        html = html + "<td>" + unitVals[i].Symbol + "</td>";
                        html = html + "<td>" + unitVals[i].UOM_UCUM + "</td>";
                        html = html + "<td>" + unitVals[i].UOM_MDC + "</td>";
                        html = html + "<td>" + unitVals[i].UCODE10 + "</td>";
                        html = html + "<td>" + unitVals[i].CF_UCODE10 + "</td>";
                        html = html + "<td>" + unitVals[i].Tags + "</td>";



                        html = html + '</tr>';
                    }
                    html = html + '</tbody></table></body><html>'
                    fs.writeFile('./public/docs/unit_terms.html', html, function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=unit_terms.html');
                        var filestream = fs.createReadStream('./public/docs/unit_terms.html');
                        filestream.pipe(res);
                    });

                }



            });
        } else {

            Rosetta.findOne({
                _id: req.params.par
            }, function(err, rosetta) {
                if (err)
                    res.send(err);

                if (rosetta) {
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
                    fs.writeFile('./public/docs/test.xml', js2xmlparser("rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        console.log("./public/docs/file saved");
                    });
                    res.download('./public/docs/test.xml');
                }


            });

        }


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
        if (req.isAuthenticated() && req.user.userTypes.id === 4) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isCOLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an Co role, or a vendor role carry on 

        if (req.isAuthenticated() && (req.user.userTypes.id === 1 || req.user.userTypes.id === 3)) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isSDOLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an SDO role, carry on 

        if (req.isAuthenticated() && req.user.userTypes.id === 3) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isRevLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an SDO role, carry on 

        if (req.isAuthenticated() && req.user.userTypes.id === 2) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }

    function isSCRLoggedIn(req, res, next) {
        // if user is authenticated in the session and has an SDO role, carry on 

        if (req.isAuthenticated() && (req.user.userTypes.id === 1 || req.user.userTypes.id === 2 ||req.user.userTypes.id === 3)) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }
}
