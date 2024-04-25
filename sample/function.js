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

    let options = {
        map: map,
        graphicLayer: demoGraphicLayer,
        modelType: 1,
        lng: 117.2442,
        lat: 31.8537,
        height : 1200
    }

    let droneSwarm = new DroneSwarm(options);

}

// 巡检任务
function goInspectionTask(){
    console.log('start inspection task...')

    map.setCameraView({
        lat: 31.819611,
        lng: 117.093499,
        alt: 133.1,
        heading: 1.7,
        pitch: -11.2
    });

    let options = {
        map: map,
        graphicLayer: demoGraphicLayer,
        modelType: 2,
        DronePositions: InspectionOptions.DronePositions
    }

    let inspectionTask = new InspectionTask(options);

    inspectionTask.startMove();

}