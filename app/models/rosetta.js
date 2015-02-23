var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our rosetta model
var rosettaSchema = mongoose.Schema({
    _id: Number,
    refid: String,
    code10: Number,
    cfCode10: Number,
    partition: Number,
    groups: [String],
    vendorUom: String,
    vendorDescription: String,
    displayName: String,
    vendorVmd :String,
    unitGroups: [{
        _id: Number,
        groupName: String,
        groupDescription: String,
        units: [{
            _id: Number,
            refid: String,
            ucode10: Number,
            cfUcode10: Number,
            partition: Number,
            description: String,
            dimension: String,
            dim: String,
            dimC: String,
            symbol: String,
            unitOfMeasure: String,
            ucums: [{
                _id: Number,
                value: String
            }],
            display_name: String,
            comments: [{
                author: {
                    _id: Number,
                    name: String
                },
                text: String,
                date: Date
            }],
            systematicName: String,
            commonTerm: String,
            acronym: String,
            termDescription: String,
            user: {
                _id: mongoose.Schema.ObjectId,
                name: String,
                suffix: String
            },
            tags: [String],
            createdAt: Date,
            updatedAt: Date
        }],
        createdAt: Date,
        updatedAt: Date
    }],
    units: [{
        _id: Number,
        refid: String,
        ucode10: Number,
        cfUcode10: Number,
        partition: Number,
        description: String,
        dimension: String,
        dim: String,
        dimC: String,
        symbol: String,
        unitOfMeasure: String,
        ucums: [{
            _id: Number,
            value: String
        }],
        display_name: String,
        comments: [{
            author: {
                _id: Number,
                name: String
            },
            text: String,
            date: Date
        }],
        systematicName: String,
        commonTerm: String,
        acronym: String,
        termDescription: String,
        user: {
            _id: mongoose.Schema.ObjectId,
            name: String,
            suffix: String
        },
        tags: [String],
        createdAt: Date,
        updatedAt: Date
    }],
    enumGroups: [{
        _id: Number,
        groupName: String,
        groupDescription: String,
        enums: [{
            _id: Number,
            refid: String,
            ecode10: Number,
            cfEcode10: Number,
            partition: Number,
            token: String,
            description: String,
            comments: [{
                author: {
                    _id: Number,
                    name: String
                },
                text: String,
                date: Date
            }],
            systematicName: String,
            commonTerm: String,
            acronym: String,
            termDescription: String,
            user: {
                _id: mongoose.Schema.ObjectId,
                name: String,
                suffix: String
            },
            tags: [String],
            createdAt: Date,
            updatedAt: Date
        }],
        createdAt: Date,
        updatedAt: Date
    }],
    enums: [{
        _id: Number,
        refid: String,
        ecode10: Number,
        cfEcode10: Number,
        partition: Number,
        token: String,
        description: String,
        comments: [{
            author: {
                _id: Number,
                name: String
            },
            text: String,
            date: Date
        }],
        systematicName: String,
        commonTerm: String,
        acronym: String,
        termDescription: String,
        user: {
            _id: mongoose.Schema.ObjectId,
            name: String,
            suffix: String
        },
        tags: [String],
        createdAt: Date,
        updatedAt: Date
    }],
    systematicName: String,
    commonTerm: String,
    acronym: String,
    termDescription: String,
    contributingOrganization: String,
    // contributingOrganization: {
    //     _id: Number,
    //     name: String
    // },
    comments: [{
        author: {
            _id: Number,
            name: String
        },
        text: String,
        date: Date
    }],
    approved: Boolean,
    deprecated: Boolean,
    tags: [String],
    createdAt: Date,
    updatedAt: Date

});

// keep track of when rosettas are updated and created
rosettaSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});



// create the model for rosetta and expose it to our app
module.exports = mongoose.model('Rosetta', rosettaSchema);
