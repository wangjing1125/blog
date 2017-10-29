/**
 * Created by 35488 on 2017/6/11.
 */
var express = require('express');
var router = express.Router();
var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');

router.use(function (req,res,next) {
   // console.log(req.userInfo.isAdmin);
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入到后台管理首页');
        return;
    }
    next();
})

router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

//用户管理
router.get('/user',function (req,res) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages=0;
    User.count().then(function (count) {
        //console.log(count);

        var ur='user';
        pages = Math.ceil(count / limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip = (page-1)*limit;
        //console.log(pages);

        User.find(User).limit(limit).skip(skip).then(function (users) {
             console.log(users);
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                ur:ur,
                page:page,
                limit:limit,
                pages:pages,
                count:count
            })
        })
    })
});

//分类管理

//分类首页
router.get('/category',function (req,res) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages=0;
    Category.count().then(function (count) {
        //console.log(count);

        var ur='category';
        pages = Math.ceil(count / limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip = (page-1)*limit;
        //console.log(pages);

        Category.find(User).sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            // console.log(users);
            res.render('admin/category',{
                userInfo:req.userInfo,
                categories:categories,
               ur:ur,
                page:page,
                limit:limit,
                pages:pages,
                count:count
            })
        })
    })

})
//添加分类
router.get('/category/add',function (req,res) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
});


//分类的保存
router.post('/category/add',function (req,res) {
    var name=req.body.name || '';
    if(name==''){
       res.render('admin/error',{
           userInfo:req.userInfo,
           message:'输入名称不能为空'
       });
       return;
    }
    
    //判断分类名称是否存在
    Category.findOne({
        name:name
        }).then(function (rs) {
        //如果名称存在
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名称已经存在'
            });
            return Promise.reject(); //返回被拒绝的原因
        }else {
            //分类名称中不存在，可以保存
            return new Category({
                name : name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })

});

//分类的修改
router.get('/category/edit',function (req,res) {
    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

//分类修改的保存
router.post('/category/edit',function (req,res) {
     var id = req.query.id || '';
     var name=req.body.name || '';

     Category.findOne({
         _id:id
     }).then(function (category) {
         if(!category){
             res.render('admin/error', {
                 userInfo: req.userInfo,
                 message: '分类信息不存在'
             });
             return Promise.reject();
         }else{
             if(name == category.name){
                 res.render('admin/success', {
                     userInfo: req.userInfo,
                     message: '保存成功',
                     url:'/admin/category'
                 });
                 return Promise.reject();
             }else{
                 return Category.findOne({
                     _id : {$ne:id},
                     name:name
                 })
             }
         }
     }).then(function (sameCategory) {
         if(sameCategory){
             res.render('admin/error', {
                 userInfo: req.userInfo,
                 message: '分类信息已经存在'
             });
             return Promise.reject();
         }else{
             return Category.update({
                 _id:id
             },{
                 name:name
             })
         }
     }).then(function () {
         res.render('admin/success', {
             userInfo: req.userInfo,
             message: '分类信息修改成功',
             url:'/admin/category'
         });
     })
})

//分类的删除
router.get('/category/delete',function (req,res) {
     var id=req.query.id || '';
     Category.remove({
         _id:id
     }).then(function () {
         res.render('admin/success', {
             userInfo: req.userInfo,
             message: '删除成功',
             url:'/admin/category'
         });
     })
});

//内容管理首页
router.get('/content',function (req,res) {
    var page = Number(req.query.page || 1);
    var limit = 3;
    var pages=0;
    Content.count().then(function (count) {
        //console.log(count);

        var ur='content';
        pages = Math.ceil(count / limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip = (page-1)*limit;
        //console.log(pages);

        Content.find().limit(limit).skip(skip).populate(['user','category']).sort({
            addTime:-1
        }).then(function (contents) {
            // console.log(contents);
            res.render('admin/content',{
                userInfo:req.userInfo,
                contents:contents,
                 ur:ur,
                page:page,

                limit:limit,
                pages:pages,
                count:count
            })
        })
    })

});

//内容添加
router.get('/content/add',function (req,res) {
    Category.find().then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })

});

//内容保存
router.post('/content/add',function (req,res) {
    //分类不能为空
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        });
        return;
    };

    //标题不能为空
    if(req.body.tittle==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类标题不能为空'
        });
        return;
    };

    new  Content({
        category:req.body.category,
        tittle:req.body.tittle,
        user:req.userInfo._id.toString(),
        descript:req.body.descript,
        content:req.body.content
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    })
});

//内容修改
router.get('/content/edit',function (req,res) {
   var id=req.query.id || '';
   var categories=[];
    Category.find().sort({_id:1}).then(function (rs) {
        categories=rs;
        return Content.findOne({
            _id:id
        }).populate('categories')

    }).then(function (content) {
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categories:categories
            })
        }

    })
});

//内容修改的保存
router.post('/content/edit',function (req,res) {
    var id=req.query.id || '';
    //分类不能为空
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        });
        return;
    };

    //标题不能为空
    if(req.body.tittle==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类标题不能为空'
        });
        return;
    };

    Content.update({
        _id:id
    },{
        category:req.body.category,
        tittle:req.body.tittle,
        descript:req.body.descript,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容修改成功',
            url:'/admin/content/edit?id='+id
        })
    })
});

//内容删除
router.get('/content/delete',function (req,res) {
    var id=req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容删除成功',
            url:'/admin/content'
        })
    })
})

module.exports=router;