var mongoose = require('mongoose');


// define the schema for our enum model
var contributingOrgSchema = mongoose.Schema({
    name: String
    
});

// keep track of when enum are updated and created
contributingOrgSchema.pre('save', function(next, done) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});




// create the model for enum and expose it to our app
module.exports = mongoose.model('CO', contributingOrgSchema);
