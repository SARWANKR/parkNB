const mongoose = require('mongoose');
const schema=mongoose.Schema;

const reportSchema=new schema({
    userId:{type:schema.Types.ObjectId,refer:"users"},
    reportedBy:[
        {
            reportedBy_id:{type:schema.Types.ObjectId,refer:"users"},
            reportedText:{type:String}
        }
    ],
    reportedTo:[
        {
            reported_id:{type:schema.Types.ObjectId,refer:"users"},
            reportedText:{type:String}
        }
    ]
})

const reportModel=mongoose.model("reportUser",reportSchema);
module.exports=reportModel;