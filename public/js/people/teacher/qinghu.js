let $ = require("jquery");
require("../../../scss/people/teacher/qinghu.scss")
let common=require("../../common.js")

$(function(){
    //为顶部导航添加激活状态
    $("#ss-topmenu .list").children().eq(2).addClass("active");
    common.setTopMenu();
     //为底部导航添加激活状态
    $("#footmenu ul").children().eq(2).addClass("active");

})