require('dotenv').config();
const mongoose=require('../index').mongoose;
const winston=require('./logger')
const env=require('../env')
var url;
let database = '';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
let port;
// let link=""
// console.log(env.instance,"vvvv")
if(env.instance=="local"){
database = process.env.DB_PROD;
  options.user = process.env.DB_PROD_USER;
  options.pass = process.env.DB_PROD_PASS;
  port = process.env.DB_LIVE_HOST;
}else if(env.instance=="dev"){
  database = process.env.DB_PROD;
  options.user = process.env.DB_PROD_USER;
  options.pass = process.env.DB_PROD_PASS;
  port = process.env.DB_LIVE_HOST;
}
url =`mongodb://${port}/${database}`;

mongoose.connect(url,options).then((client,err)=>{
    if(err){
        winston.error(err)
    }
    else{
        const obj = {
            DB_NAME: client.connections[0].name,
            HOST: client.connections[0].host,
            PORT: client.connections[0].port,
          };
          winston.debug(`Connected to db`);
          winston.info(obj);
    }
}).catch((err)=>{
    winston.error(err);
});