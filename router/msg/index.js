// 留言信息路由
const express = require("express");
const router = express.Router();
const msgDB = require("../../db/msg")
const mongoose = require("mongoose")

//留言发表
router.post("/report", async (req, res) => {
    // 验证用户是否登录
    if (!req.session.userInfo) {
        return res.send({
            code: 1,
            msg: "用户未登录"
        })
    }

    let { msg } = req.body
    // 验证数据
    if (!msg) {
        return res.send({
            code: 2,
            msg: "留言内容不能为空"
        })
    }

    // 存储数据到数据库
    await msgDB.create({
        msg,
        user: req.session.userInfo._id
    })

    // 返回内容给前端
    res.send({
        code: 0,
        msg: "留言完成"
    })

})

// 留言获取
router.get("/get", async (req, res) => {

    // 获取数据库中的留言
    let data = await msgDB
        .find({}, {}, { sort: { date: -1 } })
        .populate("user", { pass: 0 })

        .populate("children.user", { pass: 0 })
        .populate("children.replyUser", { pass: 0 })

    // 返回数据给前端
    res.send({
        code: 0,
        msg: "留言成功",
        data
    })
})

// 子留言提交的路由
router.post("/reply", async (req, res) => {
    // 验证用户登录状态
    if (!req.session.userInfo) {
        return res.send({
            code: 1,
            msg: "用户未登录"
        })
    }
    // 验证数据
    let { msg, _id, replyUserId } = req.body
    console.log(msg, _id, replyUserId)
    if (!msg || !_id || !replyUserId) {
        return res.send({
            code: 1,
            msg: "数据格式验证不通过"
        })
    }
    // 存储子留言数据
    try {
        await msgDB.findByIdAndUpdate(_id, {
            $push: {
                children: {
                    msg,
                    user: req.session.userInfo._id,
                    replyUser: replyUserId
                }
            }
        })
        res.send({
            code: 0,
            msg: "留言回复成功"
        })
    } catch (error) {
        res.send({
            code: 4,
            msg: error
        })
    }



})

// 点赞的接口地址\
router.post("/like", async (req, res) => {
    //验证用户是否登录
    if (!req.session.userInfo) {
        return res.send({
            code: 2,
            msg: "用户未登录"
        })
    }
    let { item, childItem } = req.body
    // console.log(childItem);
    let replyUserId = req.session.userInfo._id
    try {
        // 子留言的点赞
        if (childItem) {
            //需要用大括号包裹查询体后续进行子留言内容的提取
            let doc = (await msgDB.findById(item._id)).children.id(childItem._id)
            let likes = [...doc.likes].map(item => mongoose.Types.ObjectId(item).toString())
            let index = likes.indexOf(replyUserId)
            if (index !== -1) {
                likes.splice(index, 1)
            } else {
                likes.push(replyUserId)
            }

            await msgDB.updateOne({ _id: item._id, "children._id": childItem._id }, { $set: { 'children.$.likes': likes } }
            )
            return res.send({
                code: 0,
                msg: "点赞完成"
            })



        }
        // 父留言的点赞
        let doc = await msgDB.findById(item._id)
        let likes = [...doc.likes].map(item => mongoose.Types.ObjectId(item).toString())
        let index = likes.indexOf(replyUserId)
        if (index !== -1) {
            likes.splice(index, 1)
        } else {
            likes.push(replyUserId)
        }

        await msgDB.updateOne({ _id: item._id }, {
            $set: { likes }
        })
        return res.send({
            code: 0,
            msg: "点赞完成"
        })
    } catch (error) {
        console.log(error);
        res.send({
            code: 1,
            msg: error
        })
    }
})



module.exports = router
