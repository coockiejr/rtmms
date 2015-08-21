var mongoose = require('mongoose');

// define the schema for our unit model
var userTypeSchema = mongoose.Schema({
   userTypes     : {
        id : Number,
        usertype:String
    }
});

// keep track of when units are updated and created
userTypeSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});




// create the model for units and expose it to our app
module.exports = mongoose.model('UserTypes', userTypeSchema);
