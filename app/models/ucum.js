var mongoose = require('mongoose');

// define the schema for our ucum model
var ucumSchema = mongoose.Schema({
    _id: Number,
    value: String,
    createdAt: Date,
    updatedAt: Date
});

// keep track of when ucum are updated and created
ucumSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});


// create the model for ucum and expose it to our app
module.exports = mongoose.model('Ucum', ucumSchema);
