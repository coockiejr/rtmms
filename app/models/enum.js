var mongoose = require('mongoose');


// define the schema for our enum model
var enumSchema = mongoose.Schema({
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
    enumGroups: [{
        _id: Number,
        groupName: String
    }],
    user: {
        _id: mongoose.Schema.ObjectId,
        name: String,
        suffix: String
    },
    tags: [String],
    createdAt: Date,
    updatedAt: Date
});

// keep track of when enum are updated and created
enumSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});




// create the model for enum and expose it to our app
module.exports = mongoose.model('Enum', enumSchema);
