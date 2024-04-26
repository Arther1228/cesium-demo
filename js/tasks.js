// 执行车载雷达探测无人机驱离或击落仿真任务

let taskArray = [];

let taskOptions = {
    
    //汽车参数
    vehicle1Position: { // 汽车1坐标
        lng: 117.1808,
        lat: 31.8187,
        height: 44,
        heading: 25
    },
    vehicle2Position: { // 汽车2坐标
        lng: 117.1878,
        lat: 31.8189,
        height: 44,
        heading: -60
    },
    vehicle3Position: { // 汽车3坐标
        lng: 117.1829,
        lat: 31.8278,
        height: 44,
        heading: -90
    },

    radarRadius: 1500, // 雷达搜索半径(单位:米)
    radarCenter: { // 雷达中心点坐标
        lng: 117.1808,
        lat: 31.8187,
        height: 44
    },

    // 无人机飞行路线时间点及坐标集合
    DronePositions: [
        { // 时间点1
            time: '2024-01-22 12:00:00',
            lng: 117.2442,
            lat: 31.8537,
            height: 1200,
        },
        { // 时间点2
            time: '2024-01-22 12:00:10',
            lng: 117.1950,
            lat: 31.8187,
            height: 1200,
        },
        { // 时间点3
            time: '2024-01-22 12:00:20',
            lng: 117.183,
            lat: 31.8177,
            height: 1200,
        }
    ],

    // 干扰驱离或击落
    interfereStart: '2024-01-22 12:00:15', // 干扰开始
    interfereEnd: '2024-01-22 12:00:20', // 干扰结束
    shootdownStart: '2024-01-22 12:00:17', // 击落开始
    shootdownEnd: '2024-01-22 12:00:20', // 击落结束
    quli: { // 时间点3 驱离后位置
        time: '2024-01-22 12:00:30',
        lng: 117.1450,
        lat: 31.8687,
        height: 1200,
    },
    jiluo: { // 时间点3 击落后位置
        time: '2024-01-22 12:00:21',
        lng: 117.1780,
        lat: 31.8200,
        height: 44,
    },

    // 爆炸
    explosionData: {
        startTime: '2024-01-22 12:00:21.000',
        endTime: '2024-01-22 12:00:23.000',
        lng: 117.1780,
        lat: 31.8200,
        height: 44,
    },

    attackView: { // 攻方视角
        lat: 31.795365,
        lng: 117.216844,
        alt: 4337.6,
        heading: 328.5,
        pitch: -45.4
    },
    defendView: { // 守方视角
        lat: 31.784195,
        lng: 117.171364,
        alt: 423,
        heading: 17.4,
        pitch: 3.5
    }
};

/**
 * 开始模拟演示任务
 * @param {*} startMove 
 * @param {*} options 
 */
function runTask(startMove, options) {

    try {
        
        clearTask();
        
        Object.assign(options, { map: map });
        let detectsDrones = window.detectsDrones = new DetectsDrones(options);
        detectsDrones.load();
        startMove && detectsDrones.startMove();
        taskArray.push(detectsDrones);

        sceneClock.startAnimate();

    } catch (error) {
        console.error(error);
    }

}

/**
 * 清理历史任务
 */
function clearTask(){

    taskArray.map(detectsDronesTask => {
        detectsDronesTask.dispose();
    });

}
