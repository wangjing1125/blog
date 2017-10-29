/**
 * Created by 35488 on 2017/6/11.
 */
var mongoose = require ('mongoose');
var usersSchema = require('../schemas/users');
module.exports=mongoose.model('User',usersSchema);