var mongoose = require('mongoose');

// define the schema for our unitGroup model
var unitGroupSchema = mongoose.Schema({
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
            value: String
        }],
        display_name: String,
        comments: [{
            author: {
                _id: Number,
                name: String,
                co:String
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
}, {
    collection: 'unitGroups'
});

// keep track of when unitGroups are updated and created
unitGroupSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});



// create the model for unitGroups and expose it to our app
module.exports = mongoose.model('UnitGroup', unitGroupSchema);
