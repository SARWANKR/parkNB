
var mongoose =  require('mongoose')
var winston = require('./logger')

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      winston.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
});