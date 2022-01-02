const express = require("express");
const app = express() //实例化express
const path = require("path"); //引入核心模块path用于拼接地址
const cors = require("cors"); // 引入跨域中间件
const compression = require("compression") //gzip中间件

//启动服务器
require("./middleware/mongoose")

//监听端口信息
app.listen(4000, () => {
    console.log("服务器开启成功监听本地4000端口");
}) //监听4000端口

//允许页面的跨域请求中间件 编译静态页放到服务器中就不会存在此问题
app.use(cors({
    //当axios配置了withCredentials，需要设置具体的地址，以及credentials
    origin: ["http://localhost:8082", "http://localhost:8080", "http://eb91qpql.dnat.tech", "http://124.70.189.147:4000"],
    // 是否允许携带cookie
    credentials: true
}))
// session中间件的配置
app.use(require("./middleware/session"))

// 处理数据的中间件
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(compression()) //开启gzip压缩
//静态资源库
app.use(express.static(path.join(__dirname, "./public")))
// 端口监听
app.use("/", require("./router/index"))

//解决history模式的问题固定代码
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})