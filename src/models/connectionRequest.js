const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
        fromUserId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum:{
                values : ["ignored", "interested", "accepted", "rejected"],
                message: "Invalid status"
            } 
        }
    },
    {timestamps: true}
)

// connectionRequestSchema.method(selfValidator, function(){
//     if(this.fromUserId === this.toUse)
// })

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;