"use script"; //开发环境建议开启严格模式

//判断webgl支持
if (!mars3d.Util.webglreport()) {
    mars3d.Util.webglerror();
}

//读取 config.json 配置文件
let configUrl = "config/config.json";
mars3d.Util.fetchJson({ url: configUrl })
    .then((data) => {
        initMap(data.map3d); //构建地图
    })
    .catch(function (error) {
        console.log("加载JSON出错", error);
        haoutil.alert(error?.message, "出错了");
    });

let map;

function initMap(mapOptions) {
    mapOptions.control.clockAnimate = true; // 时钟动画控制(左下角)
    mapOptions.control.timeline = true;
    mapOptions.control.compass = { top: "10px", left: "5px" };

    // 创建三维地球场景
    map = new mars3d.Map("mars3dContainer", mapOptions);

    map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

    // 限制镜头高度
    map.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000;
    map.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;

    // 以下为演示代码

    // 只演示雷达扫描
    runTask1(false);

    // let aircraftTakeoffDemo = new AircraftTakeoffDemo(map);
    // aircraftTakeoffDemo.load(117.1812, 31.8185, 44, 25);
}
