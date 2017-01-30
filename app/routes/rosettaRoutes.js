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
    var libxslt = require('libxslt');
    var libxmljs = libxslt.libxmljs;
    var columnNumberSearch = ['term.code10', 'term.cfCode10', 'term.partition'];

    //get all rosetta
    app.get('/api/rosettas', function(req, res) {
        var filters = req.query.filters;
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip;
        var contributingOrganization = req.query.contributingOrganization;

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
        if (contributingOrganization) {
            query = query.where("contributingOrganization").equals(contributingOrganization);
            queryCount = queryCount.where("contributingOrganization").equals(contributingOrganization);
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

    app.post('/api/downloadR/:par', function(req, res, next) {

        if (req.params.par === "allXML") {
            var query = Rosetta.find(null);
            query.exec(function(err, ros) {
                rosetta = ros;
            }).then(function() {

                rosettas = {
                    rosetta: rosetta
                };

                var options = {
                    arrayMap: {
                        group: "groupName",
                        term: "term",
                        unitGroups: "unitGroup",
                        units: "unit",
                        ucums: "ucum",
                        comments: "comment",
                        tags: "tag",
                        enumGroups: "enumGroup",
                        enums: "enum",
                        externalSiteGroups: "externalSiteGroup",
                        externalSites: "externalSite"

                    },
                    valueString: "_id"
                };
                // var xmlObject = js2xmlparser("Rosetta", JSON.parse(JSON.stringify(rosettas)), options);
                // fs.readFile('/Users/inm1/Documents/rtmms/app/routes/stylesheet.xsl', 'utf8', function(err, data) {
                //     if (err) {
                //         return console.log(err);
                //     }

                //     var stylesheetString = data;
                //     var stylesheet = libxslt.parse(stylesheetString);

                //     var result = stylesheet.apply(xmlObject);
                //     fs.writeFile('./public/docs/rosetta_terms.html', result, function(err) {
                //         //res.download('test.xml');
                //         if (err) {
                //             return console.log(err);
                //         }
                //         res.setHeader('Content-disposition', 'attachment; filename=rosetta.html');
                //         var filestream = fs.createReadStream('./public/docs/rosetta_terms.html');
                //         filestream.pipe(res);
                //     });
                // });


                fs.writeFile('./public/docs/rosetta_terms.xml', js2xmlparser("Rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                    //res.download('test.xml');
                    if (err) {
                        return console.log(err);
                    }
                    res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.xml');
                    var filestream = fs.createReadStream('./public/docs/rosetta_terms.xml');
                    filestream.pipe(res);
                });
            });
        } else if (req.params.par === "XMLinView") {
            var options = {
                arrayMap: {
                    group: "groupName",
                    term: "term",
                    unitGroups: "unitGroup",
                    units: "unit",
                    ucums: "ucum",
                    comments: "comment",
                    tags: "tag",
                    enumGroups: "enumGroup",
                    enums: "enum",

                },
                valueString: "_id"
            };
            rosettas = {
                rosetta: req.body
            };


            fs.writeFile('./public/docs/rosetta_terms.xml', js2xmlparser("Rosettas", JSON.parse(JSON.stringify(rosettas)), options), function(err) {
                //res.download('test.xml');
                if (err) {
                    return console.log(err);
                }
                res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.xml');
                var filestream = fs.createReadStream('./public/docs/rosetta_terms.xml');
                filestream.pipe(res);
            });
        } else if (req.params.par === "CSVinView" || req.params.par === "HTMLinView") {
            rosettas = {
                rosetta: req.body
            };
            if (req.params.par === "HTMLinView") {
                var options = {
                    arrayMap: {
                        group: "groupName",
                        term: "term",
                        unitGroups: "unitGroup",
                        units: "unit",
                        ucums: "ucum",
                        comments: "comment",
                        tags: "tag",
                        enumGroups: "enumGroup",
                        enums: "enum",
                        externalSiteGroups: "externalSiteGroup",
                        externalSites: "externalSite"

                    },
                    valueString: "_id"
                };


                var xmlString = js2xmlparser("Rosettas", JSON.parse(JSON.stringify(rosettas)), options);
                fs.readFile('./ressources/stylesheet.xsl', 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }

                    var stylesheetString = data;
                    var stylesheet = libxslt.parse(stylesheetString);

                    var result = stylesheet.apply(xmlString);
                    fs.writeFile('./public/docs/rosetta_terms.html', result, function(err) {
                        //res.download('test.xml');
                        if (err) {
                            return console.log(err);
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.html');
                        var filestream = fs.createReadStream('./public/docs/rosetta_terms.html');
                        filestream.pipe(res);
                    });
                });
            }

        } else if (req.params.par === "allCSV" || req.params.par === "allHTML") {
            var query = Rosetta.find(null);
            query.exec(function(err, ros) {
                rosetta = ros;
            }).then(function() {
                //console.log(rosetta);
                rosettas = {
                    rosetta: rosetta
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

                    var options = {
                        arrayMap: {
                            group: "groupName",
                            term: "term",
                            unitGroups: "unitGroup",
                            units: "unit",
                            ucums: "ucum",
                            comments: "comment",
                            tags: "tag",
                            enumGroups: "enumGroup",
                            enums: "enum",
                            externalSiteGroups: "externalSiteGroup",
                            externalSites: "externalSite"

                        },
                        valueString: "_id"
                    };


                    var xmlString = js2xmlparser("Rosettas", JSON.parse(JSON.stringify(rosettas)), options);
                    fs.readFile('./ressources/stylesheet.xsl', 'utf8', function(err, data) {
                        if (err) {
                            return console.log(err);
                        }

                        var stylesheetString = data;
                        var stylesheet = libxslt.parse(stylesheetString);

                        var result = stylesheet.apply(xmlString);
                        fs.writeFile('./public/docs/rosetta_terms.html', result, function(err) {
                            //res.download('test.xml');
                            if (err) {
                                return console.log(err);
                            }
                            res.setHeader('Content-disposition', 'attachment; filename=rosetta_terms.html');
                            var filestream = fs.createReadStream('./public/docs/rosetta_terms.html');
                            filestream.pipe(res);
                        });
                    });




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
            rosetta.customField('term.test', 'tesssttttt')
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
    app.delete('/api/myrosettas/:rosetta_id', isCOLoggedIn, function(req, res) {
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