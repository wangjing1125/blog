/**
 * Created by 35488 on 2017/6/11.
 */
var mongoose = require ('mongoose');
module.exports=new mongoose.Schema({
   //关联字段
    category:{
        //类型
      type:mongoose.Schema.Types.ObjectId,
        //引用
      ref:'Category'
    },
    //关联字段 用户
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },

    //标题
    tittle:String,


    //添加时间
    time:{
        type:Date,
        default:new Date()
    },

    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    descript:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },

    //评论
    comments:{
        type:Array,
        default:[]
    }
});