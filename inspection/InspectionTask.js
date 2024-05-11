class InspectionTask {

  /**
    * 无人机巡检任务
    * @param {*} options.map 地图对象
    * @param {*} options.graphicLayer 图层
    * @param {*} options.DronePositions 航点坐标集合
    * @param {*} options.droneSwarm 无人机对象
    * @param {*} options.DroneInfo 无人机对象属性
    * @param {*} options.taskStartTime 巡检任务开始时间
    *
    * @param {*} options.InspectTaskInfo 巡检任务配置信息
    * @param {*} options.InspectTaskInfo.speed 飞行速度
    * @param {*} options.InspectTaskInfo.timeAbs 判断到达点的是时间差距阈值
    * @param {*} options.InspectTaskInfo.stayTime 停留时间
    * @param {*} options.InspectTaskInfo.clockMultiplier Clock 倍速
    *
    * @param {*} options.ViewPositions 视角点位
    *
    * @param {*} options.FireInfo 起火点配置信息
    * @param {*} options.FireInfo.startFireShootIndex 起火位于第几个停留点
    * @param {*} options.FireInfo.fireAlarmShootIndex 起火告警位于第几个停留点
    * @param {*} options.FireInfo.fireAlarmDelayTime 起火告警增加停留的时间
    */
  constructor(options) {

    this.map = map;
    this.graphicLayer = options.graphicLayer;
    this.DronePositions = options.DronePositions;
    this.positionIndex = 0;

    this.droneSwarm = options.droneSwarm;
    this.DroneInfo = options.DroneInfo;
    this.taskStartTime = options.taskStartTime;
    this.coneTrack = undefined;

    this.onTickstate = false;

    this.InspectTaskInfo = options.InspectTaskInfo;
    this.ViewPositions = options.ViewPositions;

    this.FireInfo = options.FireInfo;
    this.firePosition = Cesium.Cartesian3.fromDegrees(
      this.FireInfo.lng,
      this.FireInfo.lat,
      this.FireInfo.height,
    );

    this.taskCost = undefined;  // 任务总耗时
    this.Arrivals = [];    // 到达节点时间列表
    this.Leaves = [];    // 离开节点时间列表
    this.eventMethod = undefined;

    this.init();

  }

  /**
   * 初始化
   */
  init() {

    let clockStartTime = Cesium.JulianDate.fromDate(this.taskStartTime);  // Clock的演示开始时间
    let clock = new SceneClock({
      map: map,
      start: clockStartTime
    });

    clock.setMultiplier(this.InspectTaskInfo.clockMultiplier);

    this.sceneClock = clock;

    // Clock 事件监听
    this.eventMethod = this.handleTickEvent.bind(this);
    this.sceneClock.addEventListener(this.eventMethod);

    this.ComputeRoamingLineProperty();
    this.configCameraViewList();



  }

  /**
   * 初始化飞行路径和时间
   */
  ComputeRoamingLineProperty() {

    this.onTickstate = true;
    let startTime = Cesium.JulianDate.fromDate(this.taskStartTime); // 定时任务开始时间
    let positionProperty = new Cesium.SampledPositionProperty();
    let arrivalStopTime;  // 到达时间
    let leaveStopTime; // 离开时间

    for (let i = 0, t = 0; i < this.DronePositions.length; i++) {

      if (i == 0) {
        t = 0;
      } else {
        let p1 = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i - 1].lng, this.DronePositions[i - 1].lat, this.DronePositions[i - 1].height);
        let p2 = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i].lng, this.DronePositions[i].lat, this.DronePositions[i].height);
        let d = Cesium.Cartesian3.distance(p1, p2);

        t += d / this.InspectTaskInfo.speed;  // t 是总的时间  // d / this.InspectTaskInfo.speed 是当前节点到下一个节点需要的时间
      }

      let LinesIndex = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i].lng, this.DronePositions[i].lat, this.DronePositions[i].height);
      arrivalStopTime = Cesium.JulianDate.addSeconds(startTime, t, new Cesium.JulianDate());
      leaveStopTime = Cesium.JulianDate.addSeconds(startTime, t, new Cesium.JulianDate());
      positionProperty.addSample(leaveStopTime, LinesIndex);

      // 处理停顿
      if (this.DronePositions[i].isShoot == true) {
        t += this.InspectTaskInfo.stayTime || 4;
        if (i == this.FireInfo.fireAlarmShootIndex) {
          t += this.FireInfo.fireAlarmDelayTime
        }
        leaveStopTime = Cesium.JulianDate.addSeconds(startTime, t, new Cesium.JulianDate());
        positionProperty.addSample(leaveStopTime, LinesIndex);
      }

      this.Arrivals.push({
        arrivalStopTime,
        shootId: this.DronePositions[i].shootId
      });

      this.Leaves.push({
        leaveStopTime,
        shootId: this.DronePositions[i].shootId
      });

      this.taskCost = t;
    }

    this.droneSwarm.graphic.position = positionProperty;

    // setTimeDuration(this.taskCost, this.InspectTaskInfo.clockMultiplier);

    this.createConeTrack(positionProperty);

  }


  /**
   * 事件监听处理方法
   * @param {*} e
   */
  handleTickEvent(e) {

    if (this.onTickstate) {
      const timeDifference = Math.abs(this.Arrivals[this.positionIndex].arrivalStopTime.secondsOfDay - e.currentTime.secondsOfDay);
      // 倍速越快,阈值越大
      let threshold = this.InspectTaskInfo.timeAbs * this.InspectTaskInfo.clockMultiplier;
      if (timeDifference < threshold) {
        this.shootCallback(this.Arrivals[this.positionIndex].shootId, e.currentTime);    // 第一个点是0点
        this.positionIndex++;
      }
    }

  }


  /**
   * 到达停留点
   * @param {*} shootId
   */
  shootCallback(shootId, currentTime) {

    const progress = Math.ceil(((shootId + 1) / this.DronePositions.length) * 100);
    console.log("到达：" + this.DronePositions[this.positionIndex].shootName + " 进度：" + progress + "%");

    // updateTabContent(this.DronePositions[this.positionIndex].shootName, Cesium.JulianDate.toDate(currentTime), progress);

    // 起火
    if (shootId == this.FireInfo.startFireShootIndex) {
      if (!this.particleSystem) {
        this.startFire();
      }
    }

    // 告警
    if (shootId == this.FireInfo.fireAlarmShootIndex) {
      this.showConeTrack(2);
      // 巡更点停留时间 + 告警停留时间
      let coneChangeDelayTime = (this.InspectTaskInfo.stayTime + this.FireInfo.fireAlarmDelayTime) * 1000 / this.InspectTaskInfo.clockMultiplier;
      let coneTrackTimeout = setTimeout(() => {
        this.showConeTrack(1);
      }, coneChangeDelayTime);
      taskTimeoutArray.push(coneTrackTimeout);

      // showAlarmTips("发现烟火", this.FireInfo.fireAlarmDelayTime * 1000 / this.InspectTaskInfo.clockMultiplier);
      // updateAlarmContent(Cesium.JulianDate.toDate(currentTime));
    }

    if (shootId == this.DronePositions.length - 1) {
      this.finishTask();
    }
  }

  /**
   * 设置视角
   */
  configCameraViewList() {

    const multiplier = this.InspectTaskInfo.clockMultiplier;

    // 处理Clock倍速
    this.ViewPositions.forEach(point => {
      point.duration = point.duration / multiplier;
      point.stop = point.stop / multiplier;
    });

    this.map.setCameraViewList(this.ViewPositions);

  }

  /**
   * 无人机开始巡检
   */
  startMove() {

    this.sceneClock.startAnimate();

  }


  /**
   * 完成巡检任务的后续操作
   */
  finishTask() {

    this.onTickstate = false;

    console.log("inspection task finished, time cost: " + Math.ceil(this.taskCost / this.InspectTaskInfo.clockMultiplier) + "秒");

    // 避免过早加载无人机
    let droneLoadTimeout = setTimeout(() => {
      let droneSwarmInstance = new DroneSwarm(this.DroneInfo);
      // 还原倍速
      this.sceneClock.setMultiplier(1);

    }, this.InspectTaskInfo.stayTime * 1000 / this.InspectTaskInfo.clockMultiplier);
    taskTimeoutArray.push(droneLoadTimeout);

    this.sceneClock.removeEventListener(this.eventMethod);

    // hideVideoDiv();

  }

  /**
   * 中断任务
   */
  endTask() {

    this.onTickstate = false;

    // 还原倍速
    this.sceneClock.setMultiplier(1);

    this.sceneClock.removeEventListener(this.eventMethod);

    this.resetCameraView();

  }

  /**
   * 清理
   */
  dispose() {

    if (!this.graphicLayer) {
      return;
    }

    if (this.droneSwarm) {
      this.droneSwarm.dispose();
      this.droneSwarm = undefined;
    }

    if (this.coneTrack) {
      this.coneTrack.destroy();
      this.coneTrack = undefined;
    }

    this.stopFire();
  }


  /**
   * 重置开始视角
   */
  resetCameraView() {

    // 暂停视角
    this.map.pauseCameraViewList();

    this.map.setCameraViewList([]);

    this.map.setCameraView(this.ViewPositions[this.ViewPositions.length - 1]);

    // clearTabContent();

  }



  /**
   * 起火效果
   */
  startFire() {

    this.particleSystem = new mars3d.graphic.ParticleSystem({
      position: Cesium.Cartesian3.fromDegrees(this.FireInfo.lng, this.FireInfo.lat, this.FireInfo.height), // 位置
      style: {
        image: "img/fire/smoke.png",
        particleSize: 5, // 粒子大小（单位：像素）
        emissionRate: 50, // 发射速率 （单位：次/秒）
        maxHeight: 500, // 超出该高度后不显示粒子效果

        startColor: new Cesium.Color(1, 1, 1, 1), // 开始颜色
        endColor: new Cesium.Color(0.5, 0.5, 0.5, 0), // 结束颜色
        startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
        endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
        minimumSpeed: 7.0, // 最小速度（单位：米/秒）
        maximumSpeed: 9.0 // 最大速度（单位：米/秒）
      },
      attr: { remark: "火焰粒子效果" }
    })

    // 烟火 Label
    this.fireLabel = new Label({
      id: "fireLabel",
      map: map,
      graphicLayer: this.graphicLayer,
      type: 2,
      lng: this.FireInfo.lng,
      lat: this.FireInfo.lat,
      height: this.FireInfo.height,
      text: '烟火'
    });

    this.graphicLayer.addGraphic(this.particleSystem);
    this.graphicLayer.addGraphic(this.fireLabel);

  }


  /**
   * 关闭起火
   */
  stopFire() {

    if (this.particleSystem) {
      this.particleSystem.destroy();
    }
    if (this.fireLabel) {
      this.fireLabel.dispose();
    }
  }


  /**
   * 增加无人机照射范围
   */
  createConeTrack(positionProperty) {

    this.coneTrack1 = new mars3d.graphic.ConeTrack({
      position: positionProperty,
      style: {
        length: 50,
        angle: 20, // 半场角度
        color: "#ffffff",
        opacity: 0.3
      }
    });
    this.graphicLayer.addGraphic(this.coneTrack1);

    this.coneTrack2 = new mars3d.graphic.ConeTrack({
      position: positionProperty,
      targetPosition: this.firePosition,
      style: {
        length: 50,
        angle: 20, // 半场角度
        color: "#ffffff",
        opacity: 0.3
      }
    });

    this.coneTrack2.show = false;
    this.graphicLayer.addGraphic(this.coneTrack2);
  }


  /**
   * 切换照射范围
   * @param {*} index
   */
  showConeTrack(index) {

    if (index == 1) {
      this.coneTrack1.show = true;
      this.coneTrack2.show = false;
    } else if (index == 2) {
      this.coneTrack1.show = false;
      this.coneTrack2.show = true;
    }
  }

}
