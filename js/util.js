  /**
   * 二三维切换
   * @returns 
   */
  function switch2D3D() {
    if (!map) return;
    let switchControl = $('#switch2D3D');
    if (switchControl.val() == '切换到二维') {
        map.setCameraView({
            lat: 31.8187,
            lng: 117.1808,
            alt: 10000
        }, {
            complete: () => {
                map.scene.mode = Cesium.SceneMode.SCENE2D;
            }
        });
        switchControl.val('切换到三维')
    } else {
        map.scene.mode = Cesium.SceneMode.SCENE3D;
        map.setCameraView({
            lat: 31.686288,
            lng: 117.229619,
            alt: 11333.9,
            heading: 359.2,
            pitch: -39.5
        });
        switchControl.val('切换到二维')
    }
}