const express = require("express");
const router = express.Router();
const linkDB = require("../../db/linkDB")

router.get("/", async (req, res) => {
    //查询所有的友链信息返回前端
    let data = await linkDB.find({})
    res.send({
        code: 0,
        msg: "获取数据成功",
        data
    })
})

module.exports = router