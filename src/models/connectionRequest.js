const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
        fromUserId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",       //reference to the UserModel Collection
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

// COMPOUND INDEXING
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});


// The pre-function only runs whem save() is called / when 
// the collection is saved to the DB
// DETAILS: Even though the pre-function is a middleware, it is working at DB Model Level 
// Here we cannot use res.send() because this is not in the control flow of HTTP request
// tokenValidation.js is present inside the request-response cycle so it has 
// control over the res.send()

connectionRequestSchema.pre("save", function(next){
    // Here we have to initialise the schema through 'this' keyword
    const connectionRequest = this;

    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString())
    {
        throw new Error("Cannot send connection req to yourself!")
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;