const express = require("express");
const router = express.Router();
const userDB = require('../../db/user')
const visitorDB = require("../../db/visitor")
router.post("/", async (req, res) => {
    let { user, pass } = req.body
    // console.log(req.body);
    // 检查用户名是否存在
    let doc = await userDB.findOne({ user })
    //根据用户名查找如果用户名不存在
    if (!doc) {
        return res.send({
            code: 3,
            msg: "用户名不存在"
        })
    }
    //用户名正确密码不正确的情况下
    if (doc.pass != pass) {
        return res.send({
            code: 5,
            msg: "密码错误"
        })
    }
    // 登录成功的情况下
    // 处理返回给前端的数据
    let data = {
        _id: doc._id,
        user: doc.user,
        photo: doc.photo,
        admin: doc.admin
    }
    req.session.userInfo = data
    //添加当前用户到访问列表
    let visitorDOC = await visitorDB.findOne({ visitor: doc._id })
    if (visitorDOC) {
        await visitorDB.updateOne({ visitor: doc._id }, { date: Date.now() })
    } else {
        await visitorDB.create({ visitor: doc._id })
    }
    res.send({
        code: 0,
        msg: "登录成功",
        data
    })
})

router.post("/check", async (req, res) => {
    if (req.session.userInfo) {
        res.send({
            code: 0,
            msg: "已登录",
            data: req.session.userInfo
        })
        //添加当前用户到访问列表
        let _id = req.session.userInfo._id
        let visitorDOC = await visitorDB.findOne({ visitor: _id })
        if (visitorDOC) {
            await visitorDB.updateOne({ visitor: _id }, { date: Date.now() })
        } else {
            await visitorDB.create({ visitor: _id })
        }
    } else {
        res.send({
            code: 1,
            msg: "未登录",
            data: {}
        })
    }
})

router.post("/logout", async (req, res) => {
    req.session.destroy()
    res.send({
        code: 0,
        msg: "退出成功"
    })
})

module.exports = router