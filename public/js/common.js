let $ = require("jquery");
require("../scss/common.scss")

define(function (require, exports, module) {

    function setTopMenu() {
        var left = $(".ss-topmenu .active li").position().left;
        var width = $(".ss-topmenu .active li").innerWidth();

        $(".ss-topmenu .bottomLine").css("left", left);
        $(".ss-topmenu .bottomLine").css("width", width);

        $(".ss-topmenu .right a li").mouseenter(function () {//鼠标移入
            let left1 = $(this).position().left;
            let width1 = $(this).innerWidth();

            $(".bottomLine").stop().animate({
                left: left1,
                width: width1
            }, 300)

        });
        $(".ss-topmenu .right").mouseleave(function () {
            $(".bottomLine").stop();
            let move = $(".bottomLine").position().left - left;

            $(".bottomLine").animate({
                left: left,
                width: width
            }, 500);
        })
    }
    //把这个模块导出
    exports.setTopMenu = setTopMenu
})