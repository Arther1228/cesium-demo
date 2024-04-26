
/**
 * 切换地图视角
 */
function changeCameraView(type) {


    switch (type) {

        case 0:   // mars3d-demo 默认视角
            map.setCameraView({
                lat: 31.77873,
                lng: 117.159108,
                alt: 3146.7,
                heading: 29.4,
                pitch: -28.9
            });
            break;
        case 1:  // 切换到二维
            map.setCameraView({
                lat: 31.8187,
                lng: 117.1808,
                alt: 10000
            }, {
                complete: () => {
                    map.scene.mode = Cesium.SceneMode.SCENE2D;
                }
            });
            break;
        case 2:   // 切换到三维
            map.setCameraView({
                lat: 31.686288,
                lng: 117.229619,
                alt: 11333.9,
                heading: 359.2,
                pitch: -39.5
            });
            break;
        case 3:   // 巡检任务 视角
            map.setCameraView({
                lat: 31.819611,
                lng: 117.093499,
                alt: 133.1,
                heading: 1.7,
                pitch: -11.2
            });
    }

}