const mongoose=require('../../../index').mongoose;
const schema=mongoose.Schema;

const adminSchema=new schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    accessToken:{type:String,default:""}
})

const adminModel=mongoose.model('admin',adminSchema);

module.exports=adminModel;