// 起飞
function runFly() {

    taskArray.map(detectsDronesTask => {
        detectsDronesTask.dispose();
    });

    let takeOff = new AircraftTakeoffDemo(map, demoGraphicLayer);
    takeOff.load(117.2442, 31.8537, 1200, 25);

    taskArray.push(takeOff);

}


// 加载模型
function loadModel() {

    taskArray.map(detectsDronesTask => {
        detectsDronesTask.dispose();
    });

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

    taskArray.map(detectsDronesTask => {
        detectsDronesTask.dispose();
    });

    console.log('start inspection task...')

    map.setCameraView({
        lat: 31.819611,
        lng: 117.093499,
        alt: 133.1,
        heading: 1.7,
        pitch: -11.2
    });

    Object.assign(InspectionOptions.DroneAttr, { graphicLayer: demoGraphicLayer })
    let droneSwarmInstance = new DroneSwarm(InspectionOptions.DroneAttr);


    let taskOptions = {
        map: map,
        DronePositions: InspectionOptions.DronePositions,
        droneSwarm: droneSwarmInstance,
        graphicLayer: demoGraphicLayer
    }


    setTimeout(() => {

        let inspectionTask = new InspectionTask(taskOptions);
        inspectionTask.startMove();

        taskArray.push(inspectionTask);

    }, 4000);

}