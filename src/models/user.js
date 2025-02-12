const mongoose = require('mongoose');

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
        unique: true,
        trim: true
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
}, {timestamps: true})

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = {UserModel};