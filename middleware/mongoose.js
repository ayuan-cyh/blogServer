// 连接数据库操作
const mongoose = require("mongoose");
const config = require("../config")
mongoose
    // .set("useFindAndModify", false)//旧版mongoose需要配置
    .connect(config.mongoURL, {
        //默认配置项
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("数据库连接成功");
    })
    .catch((e) => {
        console.log("数据库连接失败", e)
    })