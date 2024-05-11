
// 全局变量
let inspectionTaskArray = [];
let inspectionRouteArray = [];
let taskTimeoutArray = [];


//初始化
function initGraphicLayer() {
    var inpsectionGraphicLayer = map.getLayerById("inpsectionGraphicLayer")
    if (inpsectionGraphicLayer) {
        return inpsectionGraphicLayer;
    }
    inpsectionGraphicLayer = new mars3d.layer.GraphicLayer({
        id: "inpsectionGraphicLayer"
    })
    map.addLayer(inpsectionGraphicLayer)
    return inpsectionGraphicLayer;
}

/**
 * 巡检任务
 */
function goInspectionTask() {
    console.log('start inspection task...')

    //读取 config.json 配置文件
    let configUrl = "config/inspectionTask.json";
    mars3d.Util.fetchJson({ url: configUrl })
        .then((inspectionOptions) => {
            let inpsectionGraphicLayer = initGraphicLayer();
            Object.assign(inspectionOptions.DroneInfo, { graphicLayer: inpsectionGraphicLayer })

            let taskStartTime = new Date();
            map.setCameraView(inspectionOptions.ViewPositions[inspectionOptions.ViewPositions.length - 1]);
            // updateTabContent('巡检任务下达', taskStartTime, 0);

            // 过滤不需要显示航道的点，避免重复画航道方格
            const routeChannelPositions = inspectionOptions.DronePositions.filter(position => position.isBoxShow === true);
            let routeChaennelOptions = {
                map: map,
                graphicLayer: inpsectionGraphicLayer,
                DronePositions: routeChannelPositions
            }
            // 加载航路
            addRouteChannel(routeChaennelOptions);

            // 加载无人机模型
            let droneSwarmInstance = new DroneSwarm(inspectionOptions.DroneInfo);

            // 开始巡检任务
            let taskOptions = {
                map: map,
                graphicLayer: inpsectionGraphicLayer,
                DronePositions: inspectionOptions.DronePositions,
                droneSwarm: droneSwarmInstance,
                DroneInfo: inspectionOptions.DroneInfo,
                InspectTaskInfo: inspectionOptions.InspectTaskInfo,
                ViewPositions: inspectionOptions.ViewPositions,
                FireInfo: inspectionOptions.FireInfo,
                taskStartTime: taskStartTime
            }

            let taskTimeout = setTimeout(() => {
                let inspectionTask = new InspectionTask(taskOptions);
                inspectionTask.startMove();
                inspectionTaskArray.push(inspectionTask);
                // playVideo();
            }, 6000);
            taskTimeoutArray.push(taskTimeout);

        })
        .catch(function (error) {
            console.log("加载JSON出错", error);
            haoutil.alert(error?.message, "出错了");
        });

}

/**
 * 清理历史任务
 */
function clearAheadInspectionTask() {

    inspectionTaskArray.map(inspectTask => {
        inspectTask.endTask();
        inspectTask.dispose();
        hideVideoDiv();
    });

    inspectionRouteArray.map(route => {
        route.dispose();
    });

    taskTimeoutArray.forEach(item => {
        clearTimeout(item);
    });

}

/**
 * 添加航道
 * @param {*} options 
 */
function addRouteChannel(options) {

    //addRouteLine(options);

    let routeChannelToAdd = new RouteChannel(options);

    inspectionRouteArray.push(routeChannelToAdd);

}

/**
 * 加载航线
 * @param {*} options 
 */
function addRouteLine(options) {

    const positions = options.DronePositions.map(position => [position.lng, position.lat, position.height]);

    var graphic = new mars3d.graphic.PolylineEntity({
        positions: positions,
        style: {
            width: 3,
            color: "#3388ff",
            // color: Cesium.CallbackProperty(function () {
            //   return Cesium.Color.BLUE
            // }, false),

            label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
            // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
            highlight: {
                color: "#ff0000"
            }
        },
        attr: { remark: "示例3" }
    })

    options.graphicLayer.addGraphic(graphic);

}


/**
 * 更新左侧内容
 * @param {*} shootName 
 * @param {*} currentTime 
 * @param {*} progress 
 */
function updateTabContent(shootName, currentTime, progress) {

    $("#xunjiantab").prepend('<tr><td class="cz-left">' + shootName + '</td><td class="cz-right">' + formatDateTime(currentTime, "yyyy-MM-dd HH:mm:ss") + '</td></tr>');

    $("#xjrwNum").text(progress);
}



/**
 * 清空左侧內容
 */
function clearTabContent() {

    $(".page-xj-task-cont").removeClass("xj-animation-start");

    $("#xunjiantab").empty();

    $("#xjrwNum").text(0);

}

/**
 * 设置进度条
 * @param {*} taskCost 
 * @param {*} clockMultiplier 
 */
function setTimeDuration(taskCost, clockMultiplier) {

    $(".page-xj-task-cont").addClass("xj-animation-start");
    $('.xj-animation-start').css('animation-duration', Math.ceil(taskCost / clockMultiplier) + 's');
    var animationDuration = $('.xj-animation-start').css('animation-duration');
    console.log('设置进度条时长：' + animationDuration);

}


/**
 * 更新告警内容
 * @param {*} alarmName 
 * @param {*} currentTime 
 */
function updateAlarmContent(currentTime) {

    const alarmName = "园区内部烟火告警";
    $("#inspectionAlarmTab").prepend('<tr class="jctr"><td class="cz-left">' + alarmName + '</td><td class="cz-right">' + formatDateTime(currentTime, "yyyy-MM-dd HH:mm:ss") + '</td></tr>');

}


/**
 * 提示告警
 */
function showAlarmTips(text, delayTime) {

    $("#inspectionAlarmText")[0].innerHTML = text
    $("#inspectionAlarmTip").fadeIn(500);

    var timer = setTimeout(() => {
        $("#inspectionAlarmTip").fadeOut(500);
    }, delayTime);

    taskTimeoutArray.push(timer);
}


var video = document.getElementById("inspectionVideo");

/**
 * 播放视频相关
 */

function playVideo() {

    $("#inspectionTitle").show();
    $("#xunjian_window").show();
    document.getElementById("inspectionVideo").style.display = "block";

    video.play();
}

/**
 * 重新播放
 */
function replayVideo() {

    video.pause();
    
    video.currentTime = 0;

    playVideo();

}


/**
 * 隐藏控件
 */
function hideVideoDiv() {

    video.pause();
    video.currentTime = 0;

    $("#inspectionTitle").hide();
    $("#xunjian_window").hide();

    document.getElementById("inspectionVideo").style.display = "none";
}