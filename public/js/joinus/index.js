let $ = require("jquery");
require("../../scss/joinus/index.scss")
let common = require("../common.js")

$(function () {
    //为顶部导航添加激活状态
    $("#ss-topmenu .list").children().eq(4).addClass("active");
    common.setTopMenu();
    //为底部导航添加激活状态
    $("#footmenu ul").children().eq(4).addClass("active");

    var map = new AMap.Map('container', {
        zoom: 15,
        center: [114.35805, 30.608446], //初始化地图中心点
        viewMode: '3D'//使用3D视图
    });
    var marker = new AMap.Marker({
        title: '武汉理工大学物流工程学院',   //标滑过点标记时的文字提示，不设置则鼠标滑过点标无文字提示
        // icon: 'img/biaodian.png',
        position: [114.35805, 30.608446]//位置
    })
    map.add(marker);//添加到地图

})