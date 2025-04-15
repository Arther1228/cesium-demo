// 起飞
function runFly() {

    clearTask();

    let takeOff = new AircraftTakeoffDemo(map, demoGraphicLayer);
    takeOff.load(117.2442, 31.8537, 1200, 25);

    taskArray.push(takeOff);

}


// 加载模型
function loadModel() {

    clearTask();

    let options = {
        map: map,
        graphicLayer: demoGraphicLayer,
        modelType: 1,
        lng: 117.2442,
        lat: 31.8537,
        height: 0
    }

    let droneSwarm = new DroneSwarm(options);

    console.log("模型加载完毕");

}