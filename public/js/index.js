let $ = require("jquery");
require("../scss/index.scss")
let common=require("./common.js")
$(function (){
    //为顶部导航添加激活状态
    $("#ss-topmenu .list").children().eq(0).addClass("active");
     //为底部导航添加激活状态
    $("#footmenu ul").children().eq(0).addClass("active");
    //必须要先设置激活状态才能使用这个
    common.setTopMenu();

    $(".s5 .list a").mouseenter(function(){
        var index=$(this).index();
        $(".s5 .detail-list").children().eq(index).addClass("active");
        $(".s5 .detail-list").children().eq(index).siblings().removeClass("active");
    })

    $(".s4 .indicator .li").hover(function () {
        $(this).siblings().removeClass("active")
        $(this).addClass("active");
        let index = $(".s4 .indicator .li").index(this);
        let marginLeft = -index*1200;
        $(".s4 .list").stop().animate({
                marginLeft: marginLeft,
        }, 300)
    })
})
