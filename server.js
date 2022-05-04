const express=require('express')
const lib =require('./index');
require('./config/processOn')
const app=lib.express();
const server=lib.http.createServer(app);
const bodyParser = require('body-parser');
const env= require('./env');
const hbs = require('express-handlebars');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDocs = require('swagger-jsdoc');
const logger=require('./config/logger');
const appCred= require('./config/appCredentials')[env.instance]
const userRoute= require('./components/user/routes')
const adminRoute = require('./components/admin/routes')
const cors=require('cors');
const path= require('path')

//swagger setup
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"ParkNb APP",
            version:"1.0.0",
            description:"Simple ui for parknb app"
        },
        servers:[{url:appCred.baseUrl}],
    },
    apis:['./components/user/routes.js', './components/admin/routes.js']
};
const swaggerSpecification=swaggerJsDocs(options)
console.log(swaggerSpecification)
//app.use
app.use(lib.morgan('combined', {stream: logger.stream}));
app.use(cors());
app.use(lib.express.json());
app.use(userRoute);
app.use(adminRoute);

app.use(bodyParser.urlencoded({
    extended: true
    
  }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/')));
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpecification,{explorer:true}));
app.get("/apc",(req,res)=>{
    res.send("nnnnn")
})

server.listen(appCred.port,(err)=>{
    if(err){
        logger.error(err)
    }
    else{
        require('./config/dbConfig')
        require('./components/user/userCron')
    }
    logger.debug('Server running on port '+ appCred.port)
});
process.on('uncaughtException', (err) =>{
    console.error('There was an uncaught error', err);
    process.exit(1);
  });