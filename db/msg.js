const mongoose = require("mongoose");

const Schema = mongoose.Schema

let msgSchema = new Schema({
    // 留言内容
    msg: {
        type: String,
        required: true
    },
    // 数据库时间
    date: {
        type: Number,
        default: Date.now
    },

    // 用户信息
    user: {
        //模糊
        type: Schema.Types.ObjectId,
        //进行表关联
        ref: "user",
        require: true

    },
    // 点赞的数据
    likes: [Schema.Types.ObjectId],

    // 子留言数据
    children: [{
        //子留言的内容
        msg: { type: String, required: true },
        //回复时间
        date: { type: Number, default: Date.now },
        // 回复人
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        // 点赞数
        likes: [Schema.Types.ObjectId],
        // 被回复人
        replyUser: { type: Schema.Types.ObjectId, ref: "user", required: true }
    }]

})

module.exports = mongoose.model("msg", msgSchema)