var app = angular.module('rtmms');

app.filter('secondsToTimeStringLong', function() {
    return function(sec) {
        var hours = Math.floor((sec % 86400) / 3600);
        var minutes = Math.floor(((sec % 86400) % 3600) / 60);
        var seconds = Math.floor(((sec % 86400) % 3600) % 60);
        var timeString = '';
        if (hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if (minutes > 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        if (seconds >= 0) timeString += (seconds > 1) ? (seconds + " seconds ") : (seconds + " second ");
        return timeString;
    };
});


function secondsToTimeString(sec) {
    var hours = Math.floor((sec % 86400) / 3600);
    var minutes = Math.floor(((sec % 86400) % 3600) / 60);
    var seconds = Math.floor(((sec % 86400) % 3600) % 60);
    var timeString = '';

    if (hours === 0) {
        if (seconds < 10) seconds = "0" + seconds;
        return minutes + ":" + seconds;

    } else {
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        return hours + ":" + minutes + ":" + seconds;
    }
}

app.filter('secondsToTimeString', function() {
    return function(sec) {
        var hours = Math.floor((sec % 86400) / 3600);
        var minutes = Math.floor(((sec % 86400) % 3600) / 60);
        var seconds = Math.floor(((sec % 86400) % 3600) % 60);
        var timeString = '';

        if (hours === 0) {
            if (seconds < 10) seconds = "0" + seconds;
            return minutes + ":" + seconds;

        } else {
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            return hours + ":" + minutes + ":" + seconds;
        }

    };
});





app.filter('secondsToTimeDiff', function() {
    return function(sec) {
        var hours = Math.floor((sec % 86400) / 3600);
        var minutes = Math.floor(((sec % 86400) % 3600) / 60);
        var seconds = Math.floor(((sec % 86400) % 3600) % 60);
        var timeString = '';
        if (seconds < 10) seconds = "0" + seconds;

        if (hours === 0) {
            return minutes + ":" + seconds;

        } else {
            return hours + ":" + minutes + ":" + seconds;
        }
    };
});


function resultToPace(result) {
    var seconds = result.time;
    var distance = result.racetype.miles;

    var m = Math.floor((seconds / 60) / distance);

    var s = Math.round(((((seconds / 60) / distance) % 1) * 60));

    if (s < 10) s = "0" + s;
    return m + ":" + s;
}

app.filter('resultToPace', function() {
    return function(result) {
        var seconds = result.time;
        var distance = result.racetype.miles;

        var m = Math.floor((seconds / 60) / distance);

        var s = Math.round(((((seconds / 60) / distance) % 1) * 60));

        if (s < 10) s = "0" + s;
        return m + ":" + s;
    };
});



app.filter('membersNamesFilter', function() {
    return function(members) {
        var res = "";
        members.forEach(function(member) {
            res += member.firstname + ' ' + member.lastname + ', ';

        });
        res = res.slice(0, -2);

        return res;
    };
});



// Options:
// wordwise (boolean) - if true, cut only by words bounds,
// max (integer) - max length of the text, cut to this number of chars,
// tail (string, default: ' …') - add this string to the input string if the string was cut.
app.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
});


app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});


app.filter('ageFilter', function() {
    function calculateAge(birthday) {
        var bd = new Date(birthday);
        var ageDifMs = Date.now() - bd.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return function(birthdate) {
        return calculateAge(birthdate);
    };
});

app.filter('categoryFilter', function() {
    function calculateCategory(birthday) {
        var bd = new Date(birthday);
        var ageDifMs = Date.now() - bd.getTime();
        var ageDate = new Date(ageDifMs);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return (age >= 40 ? "Master" : "Open");
    }

    return function(birthdate) {
        return calculateCategory(birthdate);
    };

});
app.filter('memberFilter', function(query) {
    return function(members, query) {
        var filtered = [];
        angular.forEach(members, function(member) {
            var name = member.firstname + ' ' + member.lastname;
            if (name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                filtered.push(member);
            }
        });
        return filtered;
    };
});
app.filter('resultSuperFilter', function(query) {
    return function(results, query) {
        if (undefined !== query) {
            var filtered = [];
            angular.forEach(results, function(result) {
                //race name
                if (result.racename.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    filtered.push(result);
                    return;
                }
                //racetype
                if (result.racetype.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    filtered.push(result);
                    return;
                }
                //racetype surface
                if (result.racetype.surface.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    filtered.push(result);
                    return;
                }

                //member name
                var foundname = false;
                result.member.forEach(function(member) {
                    name = member.firstname + ' ' + member.lastname + ', ';
                    if (name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                        filtered.push(result);
                        foundname = true;
                        return;
                    }
                });
                if (foundname) return;

                //time 
                var time = secondsToTimeString(result.time);
                if (time.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                    filtered.push(result);
                    return;
                }

                //pace
                var pace = resultToPace(result);
                if (pace.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                    filtered.push(result);
                    return;
                }
            });
            return filtered;
        } else {
            return results;
        }


    };
});



app.filter('ArrayAsString', function() {
    return function(input) {
        return input.join(', ');
    };
});

app.filter('UnitsAsString', function() {
    return function(units) {
        if(units){
            var res = '';
            units.forEach(function(u) {
                res += u.term.refid + ', ';
            });
            res = res.slice(0, -2);
            return res;
        }
    };
});


app.filter('EnumsAsString', function() {
    return function(enums) {
        if(enums){
            var res = '';

            enums.forEach(function(e) {
                if (e.term && e.term.refid) {
                    res += e.term.refid + ', ';
                }
                if (e.token) {
                    res += e.token + ', ';
                }
            });
            res = res.slice(0, -2);
            return res;
        }
    };
});

app.filter('UcumsAsString', function() {
    return function(ucums) {
        if(ucums){
            var res = '';

            ucums.forEach(function(u) {
                
                if (u.value) {
                    res += u.value + ', ';
                }
            });
            res = res.slice(0, -2);
            return res;
        }
    };
});



app.filter('EnumOrUnitGroupsAsString', function() {
    return function(groups) {
        if(groups){
            //console.log(groups);
            var res = '';
            if (groups !== undefined) {
                groups.forEach(function(eg) {
                   // console.log(eg);
                   if(eg.groupName!==undefined){
                        res += eg.groupName + ', ';
                   } 
                });
                res = res.slice(0, -2);
            }
                     //   console.log("res");

            return res;
        }
    };
});


app.filter('UcumsAsStringFromRosetta', function() {
    return function(rosetta) {
       // console.log(rosetta);
       
            
            var res = [];
            if(rosetta.units){
                rosetta.units.forEach(function(u) {
                    u.ucums.forEach(function(ucum) {
                        if(ucum!==null){
                            res.push(ucum.ucum);

                        }
                    });
                });
            }

            if(rosetta.unitGroups){

                rosetta.unitGroups.forEach(function(ug) {
                    ug.units.forEach(function(u) {
                        u.ucums.forEach(function(ucum) {
                             if(ucum!==null){
                                res.push(ucum.ucum);

                            }
                        });
                    });
                });
            }
            res = _.uniq(res);
            return res.join(', ');
        
    };
});




app.filter('UcumsAsStringFromUnit', function() {
    return function(unit) {
       // console.log(unit);

            var res = [];
            if(unit.ucums){
                unit.ucums.forEach(function(ucum) {
                    if(ucum!==null){
                       // console.log(ucum.ucum);
                    res.push(ucum.ucum);
                    }
                });
            }
        res = _.uniq(res);
        return res.join(', ');
        
    };
});


app.filter('showUnitRefidOrGroupName',['$filter', function($filter) {
    return function(u) { //unit or unit Group
        res ='';
        if (u.term !== undefined) { //unit
            res +='<span>'+u.term.refid+'</span><div class="listdetail"><small>type: Unit</small>';
            if (u.ucums !== undefined){
                res +='<br><small>UCUMS: '+$filter('UcumsAsStringFromUnit')(u) +'</small>';
            }
            res +='</div>';
        } else if (u.groupName !== undefined) { //unit group
            res += '<span class="bold">' + u.groupName + '</span><div class="listdetail"><small>type: Unit group</small>';
            if (u.groupDescription !== undefined){
                res +='<br><small>Description: '+u.groupDescription+'</small>';
            }
            res +='</div>';
        } 
        return res;
    };
}]);


app.filter('showUcumValue',['$filter', function($filter) {
    return function(u) { 
        res ='';
        if (u.value !== undefined) { //unit
            //console.log(u.ucums);
        
                res +='<span>'+u.value +'</span>';
           
        }
       
        return res;
    };
}]);



app.filter('showRosettaRefid',['$filter', function($filter) {
    return function(r) { 
        res ='';
        if (r.term.refid !== undefined) { //unit
            //console.log(u.ucums);
        
                res +='<div>'+r.term.refid +'</div>';
           
        }
        return res;
    };
}]);



app.filter('showEnumInfoOrGroupName', function() {
    return function(e) { //enum or enum Group
        res = '';
        hasref = false;
        if ((e.term !== undefined && e.term.refid !== undefined && e.term.refid !== "") || e.token !== undefined) { //enum
            if (e.term !== undefined && e.term.refid !== undefined && e.term.refid !== "") {
                res +='<span>'+e.term.refid;
                hasref = true;
            }      
            if (e.token !== undefined) {
                if (hasref) {
                    res += ", " + e.token;
                } else {
                    res += e.token;
                }
                res += '</span>';
            }        
            res +='<div class="listdetail"><small>type: Enum</small></div>';
        } else if (e.groupName !== undefined) { //enum group
            res += '<span class="bold">' + e.groupName + '</span><div class="listdetail"><small>type: Enum group</small>';
            if (e.groupDescription !== undefined){
                res +='<br><small>Description: '+e.groupDescription+'</small>';
            }
            res +='</div>';
        } 

        return res;

    };
});
