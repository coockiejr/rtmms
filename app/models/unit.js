var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// define the schema for our unit model
var unitSchema = mongoose.Schema({
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
        _id: Number,
        name: String
    },
    tags: [String],
    createdAt: Date,
    updatedAt: Date
});

// keep track of when units are updated and created
unitSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});




// create the model for units and expose it to our app
module.exports = mongoose.model('Unit', unitSchema);
