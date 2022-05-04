const {Schema, model} =require("mongoose");

const User = new Schema({
    email:{type:String, unique:true,required:true},
    username:{type:String, unique:true,required:true},
    password:{type:String, required:true},
    roles:[{type:String, ref:'Role'}],
    avatarUrl:{type:String, unique:false,required:false},
    description:{type:String, unique:false,required:false},
    fullname:{type:String, unique:false,required:false},
    phoneNumber:{type:String, unique:false,required:false},
    address:{type:String, unique:false,required:false},
    twitterUrl:{type:String, unique:false,required:false},
    instagramUrl:{type:String, unique:false,required:false},
    facebookUrl:{type:String, unique:false,required:false},

})

module.exports = model('User', User)