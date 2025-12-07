const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
        fromUserId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",       //reference to the UserModel Collection
            required: true
        },
        toUserId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        status: {
            type: String,
            enum:{
                values : ["ignored", "interested", "accepted", "rejected"],
                message: '{value} : Invalid status' 
            } 
        }
    },
    {timestamps: true}
) 

// COMPOUND INDEXING
connectionRequestSchema.index({fromUserId: 1, toUserId: 1}); 


// The pre-function only runs whem save() is called / when 
// the collection is saved to the DB
// DETAILS: Even though the pre-function is a middleware, it is working at DB Model Level 
// Here we cannot use res.send() because this is not in the control flow of HTTP request
// tokenValidation.js is present inside the request-response cycle so it has 
// control over the res.send()


connectionRequestSchema.pre('save', function(next){
    const connection = this;
    // here toString() is required because the MongoDB objects have different addresses even though the id is same
    if(connection.fromUserId.toString() === connection.toUserId.toString())
    {
        throw new Error("Canot send connection to yourself!")
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;