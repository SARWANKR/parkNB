const toad=require('toad-scheduler')
const scheduler=new toad.ToadScheduler()
const bookingModel= require('./models/booking')
const mongoose = require('mongoose');
const cancelbookingAuto= new toad.Task('simple task', async () => {
  const data= await bookingModel.updateMany({status:'1'},{$set:{status:'2'}})
  console.log(data,"data")
})

const job = new toad.SimpleIntervalJob({ seconds: 1000, runImmediately: true}, cancelbookingAuto)

scheduler.addSimpleIntervalJob(job)

// scheduler.start()