/**
 * Created by 35488 on 2017/6/11.
 */
var mongoose = require ('mongoose');
var categoriesSchema = require('../schemas/categories');
module.exports=mongoose.model('Category',categoriesSchema);