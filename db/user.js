const mongoose = require("mongoose");
const Schema = mongoose.Schema

//用户Schema表
let userSchema = new Schema({
    //账号
    user: {
        type: String,
        require: true
    },
    //密码
    pass: {
        type: String,
        require: true
    },
    // 头像
    photo: {
        type: String,
        default: "/img/photo/default.jpg"
    },
    admin: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model("user", userSchema)
