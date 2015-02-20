module.exports = function(mongoose) {

    // if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    //     url: process.env.OPENSHIFT_MONGODB_DB_URL + 'rtmms'; // connect to our database
    // } else {
    //     url: 'mongodb://127.0.0.1:27017/rtmms'; // connect to our database
    // }

    if (process.env.OPENSHIFT_MONGODB_DB_URL) {
        mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + 'rtmms');
    } else {
        mongoose.connect('mongodb://127.0.0.1:27017/rtmms'); // connect to our database
    }
}
