class InspectionTask {

  /**
    * 无人机巡检任务
    * @param {*} options.map 地图对象 
    */
  constructor(options) {


    this.map = map;
    this.graphicLayer = options.graphicLayer;
    this.modelType = options.modelType;
    this.DronePositions = options.DronePositions;
    
    this.droneSwarm = new DroneSwarm(options);

    this.calcHeading();

    this.calcPitch();

    // this.calcRoll();

  }



  /**
   * 计算无人机的heading
   */
  calcHeading() {

    // 清空原有heading
    this.DronePositions.map(pos => {
      pos.heading = undefined;
    });

    for (let i = 0; i < this.DronePositions.length - 1; i++) {
      let pos1 = this.DronePositions[i];
      let pos2 = this.DronePositions[i + 1];
      let heading = -90 + getHeading(Cesium.Cartesian3.fromDegrees(pos1.lng, pos1.lat), Cesium.Cartesian3.fromDegrees(pos2.lng, pos2.lat));
      if (!pos1.heading) {
        pos1.heading = heading;
      }
      pos2.heading = heading;
    }

    let lastPos = this.DronePositions[this.DronePositions.length - 1];

    // if (lastPos.lng != this.quli.lng && lastPos.lat != this.quli.lat) {
    //   let heading = -90 + getHeading(Cesium.Cartesian3.fromDegrees(lastPos.lng, lastPos.lat), Cesium.Cartesian3.fromDegrees(this.quli.lng, this.quli.lat));
    //   this.quli.heading = heading;
    // } else {
    //   this.quli.heading = 0;
    // }

    // if (lastPos.lng != this.jiluo.lng && lastPos.lat != this.jiluo.lat) {
    //   let heading = -90 + getHeading(Cesium.Cartesian3.fromDegrees(lastPos.lng, lastPos.lat), Cesium.Cartesian3.fromDegrees(this.jiluo.lng, this.jiluo.lat));
    //   this.jiluo.heading = heading;
    // } else {
    //   this.jiluo.heading = 0;
    // }

  }


  /**
   * 计算无人机的pitch
   */
  calcPitch() {

    // 清空原有pitch
    this.DronePositions.map(pos => {
      pos.pitch = undefined;
    });

    for (let i = 0; i < this.DronePositions.length - 1; i++) {
      let pos1 = this.DronePositions[i];
      let pos2 = this.DronePositions[i + 1];
      let pitch = getPitch(Cesium.Cartesian3.fromDegrees(pos1.lng, pos1.lat, pos1.height), Cesium.Cartesian3.fromDegrees(pos2.lng, pos2.lat, pos2.height));
      if (!pos1.pitch) {
        pos1.pitch = pitch;
      }
      pos2.pitch = pitch;
    }
  }


  /**
   * 计算无人机的roll(不支持转弯大于90度)
   */
  calcRoll() {

    // 清空原有roll
    this.DronePositions.map(pos => {
      pos.roll = undefined;
    });

    for (let i = 1; i < this.DronePositions.length - 1; i++) {
      let pos1 = this.DronePositions[i];
      let pos2 = this.DronePositions[i + 1];
      let deltaHeading = pos2.heading - pos1.heading;
      pos2.roll = deltaHeading / 1.5;
    }

  }



  /**
    * 无人机开始飞行
    */
  startMove() {

    let droneGraphic = this.droneSwarm.graphic;

    // 运动
    let positionProperty = new Cesium.SampledPositionProperty();
    let orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);

    // 遍历位置集合
    this.DronePositions.map(dronePosition => {
      let dateTime = string2Date(dronePosition.time);
      let time = Cesium.JulianDate.fromDate(dateTime);

      let position = Cesium.Cartesian3.fromDegrees(dronePosition.lng, dronePosition.lat, dronePosition.height);
      positionProperty.addSample(time, position);
      orientationProperty.addSample(time, Cesium.Transforms.headingPitchRollQuaternion(
        Cesium.Cartesian3.fromDegrees(dronePosition.lng, dronePosition.lat, dronePosition.height),
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(dronePosition.heading),
          Cesium.Math.toRadians(dronePosition.pitch),
          Cesium.Math.toRadians(dronePosition.roll || 0)
        )
      ));
    });

    // 无人机位置
    droneGraphic.position = positionProperty;
    droneGraphic.orientation = orientationProperty;


    sceneClock.startAnimate();

  }

}