const winston= require('../index').winston;
const {format}=winston;
const {combine, timestamp, label, printf} =format;
const appRoot=require('app-root-path')

// define the custom settings for each transport (file, console)
const options={
    file:{
        level:'info',
        filename:`${appRoot}/logs/app.log`,
        handleExceptions:true,
        json:true,
        colorize:true
    },
    console:{
        level:'debug',
        handleExceptions:true,
        json:true,
        colorize:true
    }
};
const logformat=printf(({level,message,label,timestamp}) => {
    return `${timestamp} [${label}] ${level} : ${message}`
});
winston.addColors({info: 'cyan', error: 'red', warn: 'yellow', debug: 'green'});
// To create new winston logger with the settings defined above
const logger=winston.createLogger({
    format:combine(
        label({label:"log"}),
        timestamp(),
        winston.format.colorize({all:true}),
        logformat,
    ),
    transports:[
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError:false,
});
logger.stream={
    write:(message,encoding)=>{
        logger.info(message)
    },
};
module.exports= logger;