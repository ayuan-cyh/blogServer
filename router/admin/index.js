const express = require("express");
const router = express.Router();
const linkDB = require("../../db/linkDB")
const multer = require("multer")
const path = require('path')
const fs = require("fs")
const articleDB = require("../../db/article")
//上传的准备
const upload = multer({
    //在磁盘中存储 而不是 内存
    storage: multer.diskStorage({
        //存储地址
        destination(req, file, cb) {
            cb(null, path.join(__dirname, "../../public/files/md"))
        },
        //存储时的文件名
        filename(req, file, cb) {
            let fileName = Date.now().toString(36) + ((Math.random() * 100000) | 0) + ".md"
            req.fileName = fileName
            cb(null, fileName)
        }
    })
}).array("file")

// 鉴权代码
router.use((req, res, next) => {
    if (!req.session.userInfo) {
        return res.send({
            code: 1,
            msg: "账号没有登录"
        })
    }
    if (!req.session.userInfo.admin) {
        return res.send({
            code: "1",
            msg: "用户非管理员用户"
        })
    }
    next()
})
// md文件上传
router.post("/upload", (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.send({
                code: 1,
                msg: "A Multer error occurred when uploading."
            })
        } else if (err) {
            return res.send({
                code: 2,
                msg: "An unknown error occurred when uploading."
            })
        }

        res.send({
            code: 0,
            msg: 'md上传成功',
            data: {
                fileName: req.fileName
            }
        })

    })
})

// 文件添加功能
router.post("/articleAdd", async (req, res) => {
    let { title, des, md } = req.body
    if (!title || !md) {
        return res.send({
            code: 1,
            msg: "数据格式验证不通过"
        })
    }
    // 添加数据到数据库
    await articleDB.create({
        title,
        md: "/files/md/" + md,
        des,
        author: req.session.userInfo._id
    })
    res.send({
        code: 0,
        msg: "上传完成"
    })
})

//文章删除
router.delete("/articleDelete", async (req, res) => {
    let { _id, md } = req.body

    // 删除文章数据
    await articleDB.findByIdAndDelete(_id)
    // 删除文件操作
    try {
        fs.unlinkSync(path.join(__dirname, "../../public" + md))
    } catch (error) {
        console.log(error);
        return res.send({
            code: 1,
            msg: "文件删除失败"
        })
    }
    res.send({
        code: 0,
        msg: "删除成功"
    })
})

// 添加友链操作
router.post("/linkAdd", async (req, res) => {
    let { name, home, logo, des } = req.body

    // 验证数据格式
    if (!name || !home || !logo || !des) {
        return res.send({
            code: 1,
            msg: "数据格式验证不通过"
        })
    }
    // 1.先查找是否有相同域名
    let doc = await linkDB.findOne({ home })
    // 如果存在则更新数据
    if (doc) {
        await linkDB.updateOne({ home }, req.body)
        return res.send({
            code: 0,
            msg: "更新完成"
        })
    }
    //如果不存在则进行新增
    await linkDB.create(req.body)
    res.send({
        code: 0,
        msg: "添加成功"
    })
})
// 删除友链操作
router.delete("/linkDelete", async (req, res) => {
    let { _id } = req.body
    await linkDB.findByIdAndDelete(_id)

    res.send({
        code: 0,
        msg: "删除成功"
    })
})



module.exports = router