var mongoose = require('mongoose');

// define the schema for our rosetta model
var hRosettaSchema = mongoose.Schema({
    _id: String,
    term: {
        refid: String,
        code10: Number,
        cfCode10: Number,
        partition: Number,
        systematicName: String,
        commonTerm: String,
        acronym: String,
        termDescription: String,
        status: String
    },
    groups: [String],
    vendorUom: [String],
    displayName: [String],
    vendorVmd: [String],
    vendorDescription: [String],
    unitGroups: [{
        _id: Number,
        groupName: String,
        groupDescription: String,
        units: [{
            _id: Number,
            term: {
                refid: String,
                code10: Number,
                cfCode10: Number,
                partition: Number,
                systematicName: String,
                commonTerm: String,
                acronym: String,
                termDescription: String,
                status: String
            },
            description: String,
            dimension: String,
            dim: String,
            dimC: String,
            symbol: String,
            unitOfMeasure: String,
            ucums: [{
                _id: Number,
                ucum: String
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
        term: {
            refid: String,
            code10: Number,
            cfCode10: Number,
            partition: Number,
            systematicName: String,
            commonTerm: String,
            acronym: String,
            termDescription: String,
            status: String
        },
        description: String,
        dimension: String,
        dim: String,
        dimC: String,
        symbol: String,
        unitOfMeasure: String,
        ucums: [{
            _id: Number,
            ucum: String
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
            term: {
                refid: String,
                code10: Number,
                cfCode10: Number,
                partition: Number,
                systematicName: String,
                commonTerm: String,
                acronym: String,
                termDescription: String,
                status: String
            },
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
        term: {
            refid: String,
            code10: Number,
            cfCode10: Number,
            partition: Number,
            systematicName: String,
            commonTerm: String,
            acronym: String,
            termDescription: String,
            status: String
        },
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
        user: {
            _id: mongoose.Schema.ObjectId,
            name: String,
            suffix: String
        },
        tags: [String],
        createdAt: Date,
        updatedAt: Date
    }],
   
     contributingOrganization: {
         name: String
     },
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
hRosettaSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});



// create the model for rosetta and expose it to our app
module.exports = mongoose.model('HRosetta', hRosettaSchema);
