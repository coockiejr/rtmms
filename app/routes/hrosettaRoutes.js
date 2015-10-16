module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var UnitGroup = require('./../models/unitGroup');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');

    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    app.get('/api/hrosettas', function(req, res) {
        console.log("one");

        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        query = HRosetta.find();
        queryCount = HRosetta.find();
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
                        "units.term.refid": new RegExp(f.value, 'i')
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
                        "enums.term.refid": new RegExp(f.value, 'i')
                    }, {
                        "enums.token": new RegExp(f.value, 'i')
                    }, {
                        "enumGroups.groupName": new RegExp(f.value, 'i')
                    }]);
                    queryCount = queryCount.or([{
                        "enums.term.refid": new RegExp(f.value, 'i')
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

        query.exec(function(err, hrosettas) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }


            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    hrosettas: hrosettas
                }); // return all members in JSON format
            });

        });

    });

    //update all rosetta
    app.get('/api/updatehrosettas', function(req, res) {
        console.log("two");
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;

        var query = Rosetta.aggregate([{
            $group: {
                _id: "$term.refid"
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
                //query = query.where('term.refid').equals(refid);
                query.and({'term.refid':refid},{'term.partition':{$exists:true}});

                query.exec(function(err, rosettas) {
                    if (err) {
                        callback(err);
                    }
                    findRes[refid] = rosettas;
                    console.log(rosettas);

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
                        console.log(r);


                        var hros = {};
                        hros.term = {};
                        hros._id = refid;
                        hros.term.refid = refid;
                        if (findRes[refid][0].term.code10 !== undefined) {
                            hros.term.code10 = findRes[refid][0].term.code10
                        };
                        if (findRes[refid][0].term.cfCode10 !== undefined) {
                            hros.term.cfCode10 = findRes[refid][0].term.cfCode10
                        };
                        if (findRes[refid][0].term.partition !== undefined) {
                            hros.term.partition = findRes[refid][0].term.partition
                        };
                        if (findRes[refid][0].term.status !== undefined) {
                            hros.term.status = findRes[refid][0].term.status
                        };
                        if (findRes[refid][0].term.systematicName !== undefined) {
                            hros.term.systematicName = findRes[refid][0].term.systematicName
                        };
                        if (findRes[refid][0].term.commonTerm !== undefined) {
                            hros.term.commonTerm = findRes[refid][0].term.commonTerm
                        };
                        if (findRes[refid][0].term.acronym !== undefined) {
                            hros.term.acronym = findRes[refid][0].term.acronym
                        };
                        if (findRes[refid][0].term.termDescription !== undefined) {
                            hros.term.termDescription = findRes[refid][0].term.termDescription
                        };


                        var groups = [];
                        var vendorUom = [];
                        var displayName = [];
                        var unitGroups = [];
                        var units = [];
                        var enumGroups = [];
                        var enums = [];
                        var vendorVmd = [];
                        var vendorDescription = [];
                        var tags = [];

                        findRes[refid].forEach(function(r) {
                            if (r.groups !== 'N/A') {
                                r.groups.forEach(function(g) {
                                    groups.push(g);
                                });
                            }
                            if (r.vendorUom !== undefined && r.vendorUom !== " ") {
                                vendorUom.push(r.vendorUom);
                            }

                            if (r.displayName !== undefined && r.displayName !== " ") {
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

                            if (r.vendorVmd !== undefined && r.vendorVmd !== " ") {
                                vendorVmd.push(r.vendorVmd);
                            }

                            if (r.vendorDescription !== undefined && r.vendorDescription !== " ") {
                                vendorDescription.push(r.vendorDescription);
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
                        unitGroups = _.uniq(_.flatten(unitGroups), function(ug) {
                            return ug._id;
                        });
                        units = _.uniq(_.flatten(units), function(u) {
                            return u._id;
                        });
                        enumGroups = _.uniq(_.flatten(enumGroups), function(eg) {
                            return eg._id;
                        });
                        enums = _.uniq(_.flatten(enums), function(e) {
                            return e._id;
                        });
                        vendorVmd = _.union(vendorVmd);
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
                        if (vendorVmd.length > 0) {
                            hros.vendorVmd = vendorVmd;
                        };
                        if (vendorDescription.length > 0) {
                            hros.vendorDescription = vendorDescription;
                        };
                        if (tags.length > 0) {
                            hros.tags = tags;
                        }

                        var hr = HRosetta.update({
                                _id: refid
                            },
                            hros, {
                                upsert: true
                            },
                            function(err, r) {
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
                                console.log('updated ' + finalHRosettas.length + ' hrosetta terms');
                                res.json(finalHRosettas)
                            });
                        }
                    });
            });
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
