class InspectionTask {

  /**
    * 无人机巡检任务
    * @param {*} options.map 地图对象 
    * @param {*} options.graphicLayer 图层 
    * @param {*} options.DronePositions 坐标集合 
    * @param {*} options.droneSwarm 无人机对象 
    */
  constructor(options) {

    this.map = map;
    this.graphicLayer = options.graphicLayer;
    this.DronePositions = options.DronePositions;
    this.droneSwarm = options.droneSwarm;

    this.init();

  }

  /**
    * 初始化飞行路径和时间
    */
  init() {

    let droneGraphic = this.droneSwarm.graphic;

    // 运动
    let positionProperty = new Cesium.SampledPositionProperty();

    // 遍历位置集合
    this.DronePositions.map(dronePosition => {
      let dateTime = string2Date(dronePosition.time);
      let time = Cesium.JulianDate.fromDate(dateTime);

      let position = Cesium.Cartesian3.fromDegrees(dronePosition.lng, dronePosition.lat, dronePosition.height);

      positionProperty.addSample(time, position);

    });

    // 无人机位置
    droneGraphic.position = positionProperty;

  }

  /**
   * 无人机开始巡检
   */
  startMove() {
    sceneClock.startAnimate();
  }


  /**
   * 清理
   */
  dispose() {

    if (this.droneSwarm) {
      this.graphicLayer.removeGraphic(this.droneSwarm.graphic);
    }

  }

}