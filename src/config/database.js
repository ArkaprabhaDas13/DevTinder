const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://arkaprabha31:ynhfuaXyXMQVasNn@namastenode.axwxn.mongodb.net/NamasteNode")
}

module.exports = connectDB;
