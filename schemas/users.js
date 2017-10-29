/**
 * Created by 35488 on 2017/6/11.
 */
var mongoose = require ('mongoose');
module.exports=new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
       type:Boolean,
        default:false
    }
});