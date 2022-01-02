const mongoose = require("mongoose")
const Schema = mongoose.Schema

//访客信息表
let visitorSchema = new Schema({
    // 访客id
    visitor: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // 时间
    date: {
        type: Number,
        default: Date.now
    }

})

module.exports = mongoose.model("visitor", visitorSchema)