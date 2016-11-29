module.exports = function(app, qs, passport, async, _) {




    var Rosetta = require('./../models/rosetta');
    var HRosetta = require('./../models/hrosetta');
    var Unit = require('./../models/unit');
    var Co = require('./../models/contributingOrg');

    var UnitGroup = require('./../models/unitGroup');
    var Enum = require('./../models/enum');
    var EnumGroup = require('./../models/enumGroup');
    var js2xmlparser = require('js2xmlparser');
    var json2csv = require('nice-json2csv');
    var fs = require('fs');
    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all rosetta
    app.get('/api/rosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        console.log(limit);


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
        var partition = req.query.partition;
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



                });

            });
        }







    });
    app.get('/api/cos', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        query = Co.find();
        queryCount = Co.find();
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


        //gets rosettas of a specific vendor 





        query.exec(function(err, cos) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err)
            }
            console.log("cos===============");
            var existingCos = [];
            for (var i = 0; i < cos.length; i++) {
                if (cos[i].status === "success") {
                    existingCos.push(cos[i]);
                }
            }

            console.log(cos);

            queryCount.count().exec(function(error, count) {
                res.json({
                    totalItems: count,
                    cos: existingCos,
                }); // return all members in JSON format





            });

        });
    });


    app.post('/api/addCo', function(req, res, next) {
        console.log("+++++++++");
        console.log(req.body);
        console.log(req.params);

        var q = req.query.query;
        query = Co.distinct('name');
        query.exec(function(err, cos) {
            coName = {
                name: req.body.name,
                status: req.body.status
            };

            if (cos.indexOf(coName.name) != -1) {

                res.send(coName.name + " already exists, please select it from the CO list.");
                return;
                //next();

            } else {
                var co = new Co(coName);
                co.save(function(err, co) {
                    if (err) {
                        return next(err)
                    }
                    res.json(201, co)
                });
            }

        });
        /* var co=new CO(coName);
         co.save(function(err,co){
             if(err){
                 return next(err)
             }
             res.json(201,co)
         });
         console.log(co);
         */
    });
    app.put('/api/cos/:co_id', isCOLoggedIn, function(req, res) {
        var q = req.query.query;
        query = Co.distinct('name');
        query.exec(function(err, cos) {
            if (cos.indexOf(req.body.name) != -1) {

                res.send(req.body.name + " already exists, please select it from the list above.");

            } else {
                Co.findOneAndUpdate({
                    _id: req.params.co_id
                }, req.body, function(err) {
                    if (!err) {

                        res.end('{"success" : "CO updated successfully", "status" : 200}');
                    } else {
                        console.log(err);
                        res.send(err);
                    }
                });
            }

        });


    });

    app.get('/api/downloadR/:par', function(req, res, next) {

        if (req.params.par === "allXML") {
            var query = Rosetta.find(null);
            query.exec(function(err, ros) {
                rosetta = ros;
            }).then(function() {
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
                fs.writeFile('./public/docs/rosetta_terms.xml', js2xmlparser("rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.xml');
                    var filestream = fs.createReadStream('./public/docs/rosetta_terms.xml');
                    filestream.pipe(res);
                });
            });
        } else if (req.params.par === "allCSV" || req.params.par === "allHTML") {
            var query = Rosetta.find(null);
            query.exec(function(err, ros) {
                console.log(ros);
                rosetta = ros;
            }).then(function() {
                //console.log(rosetta);
                rosettas = [];
                for (i = 0; i < rosetta.length; i++) {

                    if (rosetta[i].units !== undefined) {

                        unitsRef = '';
                        unitsCode = '';
                        unitsCFCode = '';
                        ucum = '';
                        for (j = 0; j < rosetta[i].units.length; j++) {

                            unitsRef = rosetta[i].units[j].term.refid + ' ' + unitsRef;
                            unitsCode = rosetta[i].units[j].term.code10 + ' ' + unitsCode;
                            unitsCFCode = rosetta[i].units[j].term.cfCode10 + ' ' + unitsCFCode;

                            if (rosetta[i].units[j].ucums !== undefined) {

                                //console.log( rosetta[i].units[j].ucums[0].ucum);
                                for (k = 0; k < rosetta[i].units[j].ucums.length; k++) {
                                    ucum = rosetta[i].units[j].ucums[k].ucum + ' ' + ucum;
                                }



                            }
                        };
                    }

                    if (rosetta[i].enums !== undefined || rosetta[i].enums.length > 0) {

                        enumsRef = '';
                        for (j = 0; j < rosetta[i].enums.length; j++) {


                            enumsRef = rosetta[i].enums[j].term.refid + ' ' + enumsRef;

                        };
                    }
                    if (rosetta[i].tags !== undefined) {
                        tags = '';
                        for (j = 0; j < rosetta[i].tags.length; j++) {


                            tags = rosetta[i].tags[j] + ' ' + tags;

                        };
                    }
                    if (rosetta[i].groups !== undefined) {
                        groups = '';
                        for (j = 0; j < rosetta[i].groups.length; j++) {


                            groups = rosetta[i].groups[j] + ' ' + groups;

                        };
                    }

                    rosettas[i] = {
                        Group: groups,
                        REFID: rosetta[i].term.refid,
                        CF_CODE10: rosetta[i].term.cfCode10,
                        'Systematic Name': rosetta[i].term.systematicName,
                        'Common Term': rosetta[i].term.commonTerm,
                        Acronym: rosetta[i].term.acronym,
                        'Term Description': rosetta[i].term.termDescription,
                        PART: rosetta[i].term.partition,
                        CODE10: rosetta[i].term.code10,
                        Description: rosetta[i].vendorDescription,
                        'Display Name': rosetta[i].displayName,
                        Vendor_UOM: rosetta[i].vendorUom,
                        UOM_MDC: unitsRef,
                        UCODE10: unitsCode,
                        CF_UCODE10: unitsCFCode,
                        UOM_UCUM: ucum,
                        Enum_Values: enumsRef,
                        'Contributing Organization': rosetta[i].contributingOrganization.name,
                        Vendor_VMD: rosetta[i].vendorVmd,
                        Tags: tags
                    };
                };
                if (req.params.par === "allCSV") {
                    fs.writeFile('./public/docs/rosetta_terms.csv', json2csv.convert(JSON.parse(JSON.stringify(rosettas))), function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.csv');
                        var filestream = fs.createReadStream('./public/docs/rosetta_terms.csv');
                        filestream.pipe(res);
                    });
                } else if (req.params.par === "allHTML") {
                    var html = '<html><head></head><body><h2>Rosetta terms</h2><table border="1"><tbody><tr bgcolor="#FFCC00"><th>#</th><th>Group</th><th>REFID</th><th>Systematic Name</th><th>Common Term</th><th>Acronym</th><th>Term Description</th><th>Part</th><th>CODE10</th><th>CF_CODE10</th><th>Description</th><th>Display Name</th><th>UOM_MDC</th><th>UCODE10</th><th>CF_UCODE10</th><th>UCUM</th><th>Vendor UOM</th><th>Enum_Values</th><th>Contributing Organization</th><th>Vendor VMD</th><th>Tags</th></tr>';
                    for (i = 0; i < rosettas.length; i++) {
                        html = html + '<tr>';
                        html = html + "<td>" + (i + 1) + "</td>";
                        html = html + "<td>" + rosettas[i].Group + "</td>";
                        html = html + "<td>" + rosettas[i].REFID + "</td>";
                        html = html + "<td>" + rosettas[i]["Systematic Name"] + "</td>";
                        html = html + "<td>" + rosettas[i]["Common Term"] + "</td>";
                        html = html + "<td>" + rosettas[i].Acronym + "</td>";
                        html = html + "<td>" + rosettas[i]["Term Description"] + "</td>";
                        html = html + "<td>" + rosettas[i].PART + "</td>";
                        html = html + "<td>" + rosettas[i].CODE10 + "</td>";
                        html = html + "<td>" + rosettas[i].CF_CODE10 + "</td>";
                        html = html + "<td>" + rosettas[i].Description + "</td>";
                        html = html + "<td>" + rosettas[i]["Display Name"] + "</td>";
                        html = html + "<td>" + rosettas[i].UOM_MDC + "</td>";
                        html = html + "<td>" + rosettas[i].UCODE10 + "</td>";
                        html = html + "<td>" + rosettas[i].CF_UCODE10 + "</td>";
                        html = html + "<td>" + rosettas[i].UOM_UCUM + "</td>";
                        html = html + "<td>" + rosettas[i].Vendor_UOM + "</td>";
                        html = html + "<td>" + rosettas[i].Enum_Values + "</td>";
                        html = html + "<td>" + rosettas[i]["Contributing Organization"].name + "</td>";
                        html = html + "<td>" + rosettas[i].Vendor_VMD + "</td>";
                        html = html + "<td>" + rosettas[i].Tags + "</td>";



                        html = html + '</tr>';
                    }
                    html = html + '</tbody></table></body><html>'
                    fs.writeFile('./public/docs/rosetta_terms.html', html, function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.html');
                        var filestream = fs.createReadStream('./public/docs/rosetta_terms.html');
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

    app.get('api/down', function(req, res, next) {
        console.log(Rosetta.find(null));


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
    app.put('/api/rosettas/:rosetta_id', isSCRLoggedIn, function(req, res) {
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

        if (req.isAuthenticated() && (req.user.userTypes.id === 1 || req.user.userTypes.id === 2 || req.user.userTypes.id === 3)) {
            if (true) {
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.status(401).send("insufficient privileges");
    }


}