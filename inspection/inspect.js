// 起飞
function runFly() {

    clearTask();
    changeCameraView(3);

    let takeOff = new AircraftTakeoffDemo(map, demoGraphicLayer);
    takeOff.load(117.2442, 31.8537, 1200, 25);

    taskArray.push(takeOff);

}


// 加载模型
function loadModel() {

    clearTask();
    changeCameraView(3);

    let options = {
        map: map,
        graphicLayer: demoGraphicLayer,
        modelType: 1,
        lng: 117.2442,
        lat: 31.8537,
        height: 0
    }

    let droneSwarm = new DroneSwarm(options);

}

// 巡检任务
function goInspectionTask() {
    console.log('start inspection task...')

    clearTask();
    changeCameraView(3);

    //读取 config.json 配置文件
    let configUrl = "config/inspection.json";
    mars3d.Util.fetchJson({ url: configUrl })
        .then((inspectionOptions) => {
            // 加载无人机模型
            Object.assign(inspectionOptions.DroneInfo, { graphicLayer: demoGraphicLayer })
            let droneSwarmInstance = new DroneSwarm(inspectionOptions.DroneInfo);

            // 开始巡检任务
            let taskOptions = {
                map: map,
                graphicLayer: demoGraphicLayer,
                DronePositions: inspectionOptions.DronePositions,
                droneSwarm: droneSwarmInstance,
                DroneInfo: inspectionOptions.DroneInfo, 
                InspectTaskInfo: inspectionOptions.InspectTaskInfo
            }
            setTimeout(() => {
                let inspectionTask = new InspectionTask(taskOptions);
                inspectionTask.startMove();
                taskArray.push(inspectionTask);
            }, 3000);
        })
        .catch(function (error) {
            console.log("加载JSON出错", error);
            haoutil.alert(error?.message, "出错了");
        });




}