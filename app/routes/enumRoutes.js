module.exports = function(app, qs, async, _) {


    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');
    var js2xmlparser = require('js2xmlparser');
    var json2csv = require('nice-json2csv');
    var fs = require('fs');

    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all enums
    app.get('/api/enums', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        var Status = req.query.status;
        var partition = req.query.partition;

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
        }
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
    app.post('/api/enums', isAdminLoggedIn, function(req, res, next) {
        var query = Enum.find(null);
        query.sort({
            _id: -1
        }).exec(function(err, enu) {
            max = enu[0]._id;

        }).then(function() {
            console.log(req.body);
            var enumVal = new Enum(req.body);
            enumVal._id = max + 1;
            enumVal.save(function(err, enumVal) {
                if (err) {
                    return next(err)
                }
                res.json(201, enumVal)
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
            queryEnums = queryEnums.or([{
                'term.refid': {
                    $regex: new RegExp(filter, 'i')
                }
            }, {
                'token': {
                    $regex: new RegExp(filter, 'i')
                }
            }])
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

    app.get('/api/enumrefids', function(req, res, next) {
        var filter = req.query.filter;
        var limit = req.query.limit;

        queryEnums = Enum.find();
        if (filter) {
            queryEnums = queryEnums.where('term.refid').regex(new RegExp(filter, 'i'));
        }
        if (limit) {
            queryEnums.limit(limit);
        }
        queryEnums.exec(function(err, enums) {
            if (err) {
                return next(err);
            }
            res.json(enums);
        });
    });

    app.get('/api/downloadE/:par', function(req, res, next) {

        if (req.params.par === "allXML") {
            var query = Enum.find(null);
            query.exec(function(err, ros) {
                enumVal = ros;
            }).then(function() {
                enumVals = {
                    terms: enumVal
                };
                var options = {
                    arrayMap: {
                        terms: "term",
                        enumGroups: "enumGroup",
                        comments: "comment",
                        tags: "tag",

                    }
                };
                fs.writeFile('./public/docs/enum_terms.xml', js2xmlparser("enums", JSON.parse(JSON.stringify(enumVals)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    res.setHeader('Content-disposition', 'attachment; filename=enum_terms.xml');
                    var filestream = fs.createReadStream('./public/docs/enum_terms.xml');
                    filestream.pipe(res);
                });
            });
        } else if (req.params.par === "allCSV" || req.params.par === "allHTML") {
            var query = Enum.find(null);
            query.exec(function(err, ros) {
                enumVal = ros;
            }).then(function() {
                //console.log(rosetta);
                enumVals = [];


                for (i = 0; i < enumVal.length; i++) {
                    enumGroup = '';

                    if (enumVal[i].enumGroups !== undefined) {

                        for (k = 0; k < enumVal[i].enumGroups.length; k++) {
                            enumGroup = enumVal[i].enumGroups[k].groupName + ' ' + enumGroup;
                        }


                    }

                    if (enumVal[i].tags !== undefined) {
                        tags = '';
                        for (j = 0; j < enumVal[i].tags.length; j++) {


                            tags = enumVal[i].tags[j] + ' ' + tags;

                        };
                    }


                    enumVals[i] = {
                        ENUM_Groups: enumGroup,
                        TOKEN: enumVal[i].token,
                        REFID: enumVal[i].term.refid,
                        EPART: enumVal[i].term.partition,
                        ECODE10: enumVal[i].term.code10,
                        CF_ECODE10: enumVal[i].term.cfCode10,
                        "Application description": enumVal[i].description,
                        Tags: tags




                    };

                };
                if (req.params.par === "allCSV") {
                    fs.writeFile('./public/docs/enum_terms.csv', json2csv.convert(JSON.parse(JSON.stringify(enumVals))), function(err) {

                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=enum_terms.csv');
                        var filestream = fs.createReadStream('./public/docs/enum_terms.csv');
                        filestream.pipe(res);
                    });
                } else if (req.params.par === "allHTML") {
                    var html = '<html><head></head><body><h2> Enum terms</h2><table border="1"><tbody><tr bgcolor="#FFCC00"><th>#</th><th>Enum Groups</th><th>Token</th><th>REFID</th><th>Enum Partition</th><th>Enum CODE10</th><th>CF_ECODE10</th><th>Application Description</th><th>Tags</th></tr>';
                    for (i = 0; i < enumVals.length; i++) {
                        html = html + '<tr>';
                        html = html + "<td>" + (i + 1) + "</td>";
                        html = html + "<td>" + enumVals[i].ENUM_Groups + "</td>";
                        html = html + "<td>" + enumVals[i].TOKEN + "</td>";
                        html = html + "<td>" + enumVals[i].REFID + "</td>";
                        html = html + "<td>" + enumVals[i].EPART + "</td>";
                        html = html + "<td>" + enumVals[i].ECODE10 + "</td>";
                        html = html + "<td>" + enumVals[i].CF_ECODE10 + "</td>";
                        html = html + "<td>" + enumVals[i]["Application description"] + "</td>";
                        html = html + "<td>" + enumVals[i].Tags + "</td>";



                        html = html + '</tr>';
                    }
                    html = html + '</tbody></table></body><html>'
                    fs.writeFile('./public/docs/enum_terms.html', html, function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=enum_terms.html');
                        var filestream = fs.createReadStream('./public/docs/enum_terms.html');
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
        // if (req.isAuthenticated() && req.user.role === 'admin') {
        if (true) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }


}
