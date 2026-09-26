let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ["HR", "EMPLOYEE"]
    }
});
let users=mongoose.model('users', userSchema);
module.exports=users;