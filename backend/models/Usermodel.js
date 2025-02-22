const mongoose = require("mongoose")
const bcrypt = require(`bcrypt`)
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const UserSchema  = new mongoose.Schema({
    userId:{
        type:String,
        unique:true,
        default:uuidv4
    },
    
    
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    Isonline:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User",UserSchema)
