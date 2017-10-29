/**
 * Created by 35488 on 2017/6/11.
 */
var mongoose = require ('mongoose');
var contentsSchema = require('../schemas/contents');
module.exports=mongoose.model('Content',contentsSchema);