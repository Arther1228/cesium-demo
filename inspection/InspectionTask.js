class InspectionTask {

  /**
    * 无人机巡检任务
    * @param {*} options.map 地图对象 
    * @param {*} options.graphicLayer 图层 
    * @param {*} options.DronePositions 坐标集合 
    * @param {*} options.droneSwarm 无人机对象 
    * @param {*} options.DroneInfo 无人机对象属性
    * @param {*} options.InspectTaskInfo 巡检任务配置信息
    */
  constructor(options) {

    this.map = map;
    this.graphicLayer = options.graphicLayer;
    this.DronePositions = options.DronePositions;
    this.droneSwarm = options.droneSwarm;
    this.DroneInfo = options.DroneInfo;
    
    this.onTickstate = false;

    this.InspectTaskInfo = options.InspectTaskInfo;
    this.speed = this.InspectTaskInfo.speed;      // 飞行速度
    this.timeAbs = this.InspectTaskInfo.timeAbs;   // 判断到达点的是时间差距阈值
    this.stayTime = this.InspectTaskInfo.stayTime;  // 停留时间

    this.taskCost = undefined  // 任务总耗时

    this.ComputeRoamingLineProperty();

  }

  /**
    * 初始化飞行路径和时间
    */
  ComputeRoamingLineProperty() {

    this.onTickstate = true;
    let startTime = Cesium.JulianDate.fromDate(new Date(2024, 0, 22, 12));  // 定时任务开始时间
    let stopTime;  // 最终结束时间
    let positionProperty = new Cesium.SampledPositionProperty();
    let startWaiting, endWaiting; // 开始等待时间、结束等待时间
    let Waiting = [];    // 等待节点信息
    let arriveTimeList = [];   // 到达节点时间列表

    for (let i = 0, t = 0; i < this.DronePositions.length; i++) {

      if (i == 0) {
        t = 0;
      } else {
        let p1 = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i - 1].lng, this.DronePositions[i - 1].lat, this.DronePositions[i - 1].height);
        let p2 = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i].lng, this.DronePositions[i].lat, this.DronePositions[i].height);
        let d = Cesium.Cartesian3.distance(p1, p2);

        t += d / this.speed;  // t 是总的时间  // d / this.speed 是当前节点到下一个节点需要的时间
      }

      let LinesIndex = new Cesium.Cartesian3.fromDegrees(this.DronePositions[i].lng, this.DronePositions[i].lat, this.DronePositions[i].height);
      let arriveTime = Cesium.JulianDate.addSeconds(startTime, t, new Cesium.JulianDate());
      positionProperty.addSample(arriveTime, LinesIndex);

      // 处理停顿
      if (this.DronePositions[i].isShoot == true) {
        startWaiting = arriveTime;
        t += this.stayTime || 4;
        endWaiting = Cesium.JulianDate.addSeconds(startTime, t, new Cesium.JulianDate())
        positionProperty.addSample(endWaiting, LinesIndex);

        Waiting.push({
          startWaiting,
          endWaiting,
          shootId: this.DronePositions[i].shootId
        });

        // 记录到达节点时间
        arriveTimeList.push({
          arriveTime: endWaiting,
          shootId: this.DronePositions[i].shootId
        });
      } else {
        arriveTimeList.push({
          arriveTime: arriveTime,
          shootId: this.DronePositions[i].shootId
        });
      }

      if (i == this.DronePositions.length - 1) {
        stopTime = arriveTime;
      }

      this.taskCost = t;
    }

    // 到达停顿点,只执行一次下列方法
    let k = true
    let index = 1;
    this.map.clock.onTick.addEventListener((e) => {

      // 到达航道判断
      if (this.onTickstate && index < arriveTimeList.length) {
        const timeDifference = Math.abs(arriveTimeList[index].arriveTime.secondsOfDay - e.currentTime.secondsOfDay);
        if (timeDifference < this.timeAbs) {
          let pointIndex = index + 1;
          const progress = Math.ceil((pointIndex / arriveTimeList.length) * 100);
          console.log("到达航点：" + arriveTimeList[index].shootId + " 进度：" + progress + "%");
          index++;
        }

        if (index == arriveTimeList.length) {
          this.finishTask();
        }
      }

      // 达到停顿点操作
      if (this.onTickstate) {
        let finds = false
        for (let i = 0; i < Waiting.length; i++) {
          if (Waiting[i].startWaiting.secondsOfDay < e.currentTime.secondsOfDay && Waiting[i].endWaiting.secondsOfDay > e.currentTime.secondsOfDay) {
            if (k) {
              this.shootCallback(Waiting[i].shootId);
            }
            finds = true;
            break;
          }
        }
        if (finds) {
          k = false;
        } else {
          k = true;
        }
      }

    });
    
    this.droneSwarm.graphic.position = positionProperty;
  }

  /**
   * 无人机开始巡检
   */
  startMove() {

    sceneClock.startAnimate();

  }



  /**
   * 到达停留点
   * @param {*} shootId 
   */
  shootCallback(shootId) {

    console.log("在" + shootId + "停留一会");

  }


  /**
   * 完成巡检任务的后续操作
   */
  finishTask() {

    console.log("inspection task finished, time cost: " + Math.ceil(this.taskCost) + "秒");
    let droneSwarmInstance = new DroneSwarm(this.DroneInfo);

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