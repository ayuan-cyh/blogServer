//这个文件用于统一管理所有的后端路由
const express = require('express')
const router = express.Router()

//注册接口
router.use('/reg', require('./reg/index'))

// 登录接口
router.use("/login", require("./login/index"))

// 修改用户信息接口
router.use("/user", require("./user/index"))

//留言信息接口
router.use("/msg", require("./msg/index"))

//admin相关接口
router.use("/admin", require("./admin/index"))

// 友链获取接口
router.use("/linkServer", require("./linkServer/index"))

//文章管理接口
router.use("/art", require("./art/index"))

//访客接口
router.use("/visitor", require("./visitor/index"))

//邮箱发送接口
router.use("/email", require("./email/index"))

module.exports = router
