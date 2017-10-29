/**
 * Created by 35488 on 2017/6/11.
 */
var express = require ('express');
var router = express.Router();
var User = require('../models/User');
var Content=require('../models/Content');
var responseData;
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    }
    next();
});

//注册
router.post('/user/register',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }

    if(password!=repassword){
        responseData.code=1;
        responseData.message='两次密码输入不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username
    }).then(function (userInfo) {
        if(userInfo){
            responseData.code=4;
            responseData.message="用户名已经被注册了";
            res.json(responseData);
            return;
        }
        var user=new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function (newUserInfo) {
       // console.log(newUserInfo);
        responseData.message='注册成功';
        res.json(responseData);
    })

});


//登陆
router.post('/user/login',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;

    if(username=='' || password == ''){
        responseData.code=2;
        responseData.message='用户名跟密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名跟密码输入错误';
            res.json(responseData);
            return;
        }

        responseData.message='登录成功';
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
       //console.log(req.cookies);
        res.json(responseData);
        return;
    })
});

//退出
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

//评论展示
router.get('/comment',function (req,res) {
    var contentid=req.query.contentid || '';
    Content.findOne({
        _id:contentid
    }).then(function (content) {
        responseData.data=content.comments;
        res.json(responseData);
    })
})

//评论
router.post('/comment/post',function (req,res) {
    var contentid=req.body.contentid || '';
    var postData={
          username:req.userInfo.username,
          postTime:new Date(),
          content:req.body.content
    };
    
    Content.findOne({
        _id:contentid
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message='评论成功';
        responseData.data=newContent;
        res.json(responseData);
    })
})

module.exports=router;