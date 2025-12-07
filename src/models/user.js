const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,               // unique indexing
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase:true,
        trim: true,
        validate(value){
           if(!["male", "female"].includes(value)) 
           {
            throw new Error("Invalid Gender");
           }
        }
    },
    photoUrl: {
        type: String,
        trim: true,
        default: "https://image.winudf.com/v2/image1/Y29tLm1vYmVhc3lhcHAuYXBwOTA5MTk4Mjk4NzZfc2NyZWVuXzRfMTY1ODIyNzYzNF8wNTQ/screen-4.jpg?fakeurl=1&type=.jpg"
    },
    about: {
        type: String,
        default: 'You are awsome!'
    },
    skills: {
        type: [String],
        default: ["DSA", "C"],
        validate(value){
            if(value.length > 6)
            {
                throw new Error("Cannot enter more than 6 skills")
            }
        }
    }
}, {timestamps: true});


userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.createJWT = async function(){
    // console.log("CreateJWT function has EXECUTED!!");
    //Here instead of user.id, we use this.id because this refers to the current instance.
    // Also this funciton cannot be an ARROW FUNCTION because an arrow funcitons donot have their own 'this'. It references its PARENT SCOPE which here is the GLOBAL scope.
    const token = await jwt.sign({_id: this._id}, "secret", {expiresIn: '1d'});
    return token;
}

userSchema.methods.decryptPass = async function(password){
    // console.log("decryptPass function has EXECUTED!!");
    const decryptedPassword = bcrypt.compare(password, this.password)
    return decryptedPassword;
}

const UserModel = mongoose.model('UserModel', userSchema);
module.exports = UserModel;