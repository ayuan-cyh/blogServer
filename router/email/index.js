const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const config = require("../../config")
router.post("/", async (req, res) => {
    // 开启一个 SMTP 连接池
    let {
        name,
        email,
        subject,
        message
    } = req.body

    let transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        secureConnection: true, // use SSL
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: config.emailConfig
    });

    // 设置邮件内容（谁发送什么给谁）
    let mailOptions = {
        from: 'noifelsecyh@163.com', // 发件人
        to: '1654910676@qq.com', // 收件人
        subject: subject, // 主题
        // text: '这是一封来自 Node.js 的测试邮件', // plain text body
        html: `发送人${name}<br/>发送者邮箱地址${email}<br/>反馈内容:${message}`, // html body
        // 下面是发送附件，不需要就注释掉
        // attachments: [{
        //     filename: 'test.md',
        //     path: './test.md'
        // },
        // {
        //     filename: 'content',
        //     content: '发送内容'
        // }
        // ]
    };

    // 使用先前创建的传输器的 sendMail 方法传递消息对象
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send({
                code: 1,
                msg: "邮箱服务可能过期,请通过上方其他联系方式联系"
            })
            return console.log(error);
        }
        console.log(`Message: ${info.messageId}`);
        console.log(`sent: ${info.response}`);
        res.send({
            code: 0,
            msg: "邮箱发送成功感谢您的建议,会尽快答复您的邮箱"
        })
    });
})
module.exports = router