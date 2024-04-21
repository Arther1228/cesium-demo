class DetectsDrones {

    /**
     * 车载雷达探测无人机
     * @param {*} options.disposalType 处置类型 1干扰 2打击
     * @param {*} options.modelType 模型类型 
     * @param {*} options.vehicle1Position 汽车1坐标 
     * @param {*} options.vehicle2Position 汽车2坐标
     * @param {*} options.vehicle3Position 汽车3坐标
     * @param {*} options.radarRadius 雷达搜索半径(单位:米)
     * @param {*} options.radarCenter 雷达中心点坐标 
     * @param {*} options.DronePositions 无人机飞行路线时间点及坐标集合
     * @param {*} options.interfereStart 干扰驱离 开始时间 
     * @param {*} options.interfereEnd 干扰驱离 结束时间  
     * @param {*} options.shootdownStart 击落开始 开始时间
     * @param {*} options.shootdownEnd 击落开始 结束时间 
     * @param {*} options.quli 驱离对象{时间、坐标}
     * @param {*} options.jiluo 击落对象{时间、坐标}
     * @param {*} options.explosionData 爆炸对象{开始时间、结束时间、坐标}
     * @param {*} options.attackView 攻方视角
     * @param {*} options.defendView 守方视角
     */
    constructor(options) {

        this.map = map;

        this.disposalType = options.disposalType; 
        this.modelType = options.modelType; 
        this.vehicle1Position = options.vehicle1Position; 
        this.vehicle2Position = options.vehicle2Position; 
        this.vehicle3Position = options.vehicle3Position; 
        this.vehicle3Position = options.vehicle3Position; 
        this.radarRadius = options.radarRadius; 
        this.radarCenter = options.radarCenter; 
        this.DronePositions = options.DronePositions; 
        this.interfereStart = options.interfereStart; 
        this.interfereEnd = options.interfereEnd; 
        this.shootdownStart = options.shootdownStart; 
        this.shootdownEnd = options.shootdownEnd; 
        this.quli = options.quli; 
        this.jiluo = options.jiluo; 
        this.explosionData = options.explosionData; 
        this.attackView = options.attackView; 
        this.defendView = options.defendView; 

        this.sameple(); // 重新采样this.DronePositions

        this.calcHeading(); // 计算无人机的heading
        this.calcPitch(); // 计算无人机的pitch
        this.calcRoll(); // 计算无人机的roll

        this.graphicLayer = new mars3d.layer.GraphicLayer()
        this.map.addLayer(this.graphicLayer)


        this.moving = false; // 正在演示

    }



    /**
     * 加载图形和模型
     */
    load() {

        this.createEllipsoidEntity();
        this.addEllipsoidEntity(1);

        // 雷达半球Label
        this.ellipsoidLabel = new Label({
            map: this.map,
            graphicLayer: this.graphicLayer,
            type: 2,
            lng: this.radarCenter.lng,
            lat: this.radarCenter.lat,
            height: this.radarRadius,
            text: '探测范围'
        });

        // 汽车1
        this.vehicle1 = new Vehicle({
            map: this.map,
            graphicLayer: this.graphicLayer,
            lng: this.vehicle1Position.lng,
            lat: this.vehicle1Position.lat,
            height: this.vehicle1Position.height,
            heading: this.vehicle1Position.heading,
            dataId: 1,
        });

        // 汽车2
        this.vehicle2 = new Vehicle({
            map: this.map,
            graphicLayer: this.graphicLayer,
            lng: this.vehicle2Position.lng,
            lat: this.vehicle2Position.lat,
            height: this.vehicle2Position.height,
            heading: this.vehicle2Position.heading,
            dataId: 2,
        });

        // 汽车3
        this.vehicle3 = new Vehicle({
            map: this.map,
            graphicLayer: this.graphicLayer,
            lng: this.vehicle3Position.lng,
            lat: this.vehicle3Position.lat,
            height: this.vehicle3Position.height,
            heading: this.vehicle3Position.heading,
            dataId: 3,
        });

        // 无人机
        this.droneSwarm = new DroneSwarm({
            map: this.map,
            graphicLayer: this.graphicLayer,
            modelType: this.modelType,
        });

        // div信息
        this.divLabel = new Label({
            map: this.map,
            graphicLayer: this.graphicLayer,
            type: 1,
            lng: 0,
            lat: 0,
            height: 0,
            text: ''
        });

        if (this.disposalType == 1) { // 干扰
            this.interferenceDrones = new InterferenceDrones({
                map: this.map,
                graphicLayer: this.graphicLayer,
                length: 3000, // 攻击距离
                vehiclePosition: this.vehicle2Position,
            });
        } else if (this.disposalType == 2) {  // 激光
            this.attackDrones = new AttackDrones({
                map: this.map,
                graphicLayer: this.graphicLayer,
                length: 3000, // 攻击距离
                vehiclePosition: this.vehicle2Position,
            });
        }

    }

    /**
     * 创建雷达扫描半球
     */
    createEllipsoidEntity() {

        // 带雷达扫描的半球
        const ellipsoidEntity1 = new mars3d.graphic.EllipsoidEntity({
            position: new mars3d.LngLatPoint(this.radarCenter.lng, this.radarCenter.lat, this.radarCenter.height),
            style: {
                radii: new Cesium.Cartesian3(this.radarRadius, this.radarRadius, this.radarRadius),
                maximumConeDegree: 90,
                color: Cesium.Color.BLUE.withAlpha(0.0),
                outline: true,
                outlineColor: "rgba(0,255,0,0.5)",
                stackPartitions: 16,
                slicePartitions: 16,
            },
            scanPlane: {
                step: 5.0, // 步长
                min: -180.0, // 最小值
                max: 180.0, // 最大值
                style: {
                    innerRadii: 500,
                    outline: true,
                    color: "rgba(0, 204, 10, 0.2)",
                    outlineColor: "rgba(0, 204, 10, 0.1)",
                    minimumClockDegree: 90.0,
                    maximumClockDegree: 120.0,
                    minimumConeDegree: 20.0,
                    maximumConeDegree: 70.0
                }
            }
        });
        this.graphicLayer.addGraphic(ellipsoidEntity1);
        this.ellipsoidEntity1 = ellipsoidEntity1;

        // 不带雷达扫描的半球
        const ellipsoidEntity2 = new mars3d.graphic.EllipsoidEntity({
            position: new mars3d.LngLatPoint(this.radarCenter.lng, this.radarCenter.lat, this.radarCenter.height),
            style: {
                radii: new Cesium.Cartesian3(this.radarRadius, this.radarRadius, this.radarRadius),
                maximumConeDegree: 90,
                color: Cesium.Color.BLUE.withAlpha(0.0),
                outline: true,
                outlineColor: "rgba(0,255,0,0.5)",
                stackPartitions: 16,
                slicePartitions: 16,
            },
        });
        this.graphicLayer.addGraphic(ellipsoidEntity2);
        this.ellipsoidEntity2 = ellipsoidEntity2;

    }

    /**
     * 添加半球
     * @param {*} ellipsoidType 1:带雷达扫描的半球 2:不带雷达扫描的半球
     */
    addEllipsoidEntity(ellipsoidType) {

        this.removeEllipsoidEntity();

        if (ellipsoidType == 1) {
            this.graphicLayer.addGraphic(this.ellipsoidEntity1);
        } else if (ellipsoidType == 2) {
            this.graphicLayer.addGraphic(this.ellipsoidEntity2);
        }

    }


    /**
     * 移除半球
     */
    removeEllipsoidEntity() {

        if (this.ellipsoidEntity1) {
            this.graphicLayer.removeGraphic(this.ellipsoidEntity1);
        }
        if (this.ellipsoidEntity2) {
            this.graphicLayer.removeGraphic(this.ellipsoidEntity2);
        }

    }


    /**
     * 无人机开始飞行
     */
    startMove() {

        this.moving = true;
        let droneGraphic = this.droneSwarm.graphic;

        // 运动
        let positionProperty = new Cesium.SampledPositionProperty();
        let targetProperty = new Cesium.SampledPositionProperty();
        let orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);

        // 遍历位置集合
        this.DronePositions.map(dronePosition => {
            let dateTime = string2Date(dronePosition.time);
            let time = Cesium.JulianDate.fromDate(dateTime);

            let position = new Cesium.Cartesian3.fromDegrees(this.vehicle2Position.lng, this.vehicle2Position.lat, this.vehicle2Position.height);
            let targetPosition = Cesium.Cartesian3.fromDegrees(dronePosition.lng, dronePosition.lat, dronePosition.height);
            positionProperty.addSample(time, position);
            targetProperty.addSample(time, targetPosition);
            orientationProperty.addSample(time, Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(dronePosition.lng, dronePosition.lat, dronePosition.height),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(dronePosition.heading),
                    Cesium.Math.toRadians(dronePosition.pitch),
                    Cesium.Math.toRadians(dronePosition.roll || 0)
                )
            ));
        });

        // 驱离和击落
        if (this.disposalType == 1) {
            let driveAway = new DriveAway({
                map: this.map,
                graphicLayer: this.graphicLayer,
                positionProperty: targetProperty,
                orientationProperty: orientationProperty,
                position: {
                    time: this.quli.time,
                    lng: this.quli.lng,
                    lat: this.quli.lat,
                    height: this.quli.height,
                }
            });
        }
        else if (this.disposalType == 2) {
            let shootDown = new ShootDown({
                map: this.map,
                graphicLayer: this.graphicLayer,
                positionProperty: targetProperty,
                orientationProperty: orientationProperty,
                position: {
                    time: this.jiluo.time,
                    lng: this.jiluo.lng,
                    lat: this.jiluo.lat,
                    height: this.jiluo.height,
                    heading: this.jiluo.heading,
                }
            });
        }

        // 无人机入侵标签位置
        this.divLabel.graphic.position = new Cesium.CallbackProperty((time, result) => {
            let datetime = dayjs(Cesium.JulianDate.toDate(time));
            let startTime = dayjs(string2Date(this.interfereStart));
            let endTime = dayjs(string2Date(this.interfereEnd));

            // 处理一下trackedEntity
            if (this.disposalType == 1) {
                if (datetime.valueOf() > dayjs(string2Date(this.interfereEnd))) { // 到达某个时间点  
                    map.trackedEntity = undefined;
                }
            } else {
                if (datetime.valueOf() > dayjs(string2Date(this.shootdownEnd))) { // 到达某个时间点  
                    map.trackedEntity = undefined;
                }
            }

            // 演示汽车旁边爆炸效果
            if (!this.explosionData) return; // 没有数据时不显示爆炸效果
            let explosionStartTime = dayjs(string2Date(this.explosionData.startTime));
            let explosionEndTime = dayjs(string2Date(this.explosionData.endTime));
            if (datetime.valueOf() >= explosionStartTime.valueOf() && datetime.valueOf() <= explosionEndTime.valueOf()) {
                if (!this.explosion) {
                    this.explosion = new Explosion({
                        map: this.map,
                        graphicLayer: this.graphicLayer,
                        startTime: this.explosionData.startTime,
                        endTime: this.explosionData.endTime,
                        lng: this.explosionData.lng,
                        lat: this.explosionData.lat,
                        height: this.explosionData.height,
                    });
                }
            }
            if (datetime.valueOf() > explosionEndTime.valueOf()) {
                if (this.explosion) {
                    this.explosion.dispose();
                    this.explosion = undefined;
                }
            }

            if (datetime.valueOf() < startTime.valueOf() || datetime.valueOf() > endTime.valueOf()) {
                return undefined;
            }
            let position = findPosition(datetime, this.DronePositions);
            if (!position) return undefined;
            return Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height);
        });

        // 无人机位置
        droneGraphic.position = targetProperty;
        droneGraphic.orientation = orientationProperty;

    }


    /**
     * 重新采样this.DronePositions
     */
    sameple() {

        for (let i = 0; i < 3; i++) {
            this.samepleOnce();
        }

    }


    /**
     * 重新采样this.DronePositions
     */
    samepleOnce() {

        for (let i = 0; i < this.DronePositions.length - 1; i += 2) {
            let pos1 = this.DronePositions[i];
            let pos2 = this.DronePositions[i + 1];
            let time1 = dayjs(pos1.time, 'YYYY-MM-DD HH:mm:ss');
            let time2 = dayjs(pos2.time, 'YYYY-MM-DD HH:mm:ss');
            let time = time1.add(time2.diff(time1) / 2.0, 'millisecond');
            let lng = (pos1.lng + pos2.lng) / 2.0;
            let lat = (pos1.lat + pos2.lat) / 2.0;
            let height = (pos1.height + pos2.height) / 2.0;
            let pos = {
                time: time.format('YYYY-MM-DD HH:mm:ss.SSS'),
                lng: lng,
                lat: lat,
                height: height,
            }
            this.DronePositions.splice(i + 1, 0, pos);
        }
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

        if (lastPos.lng != this.quli.lng && lastPos.lat != this.quli.lat) {
            let heading = -90 + getHeading(Cesium.Cartesian3.fromDegrees(lastPos.lng, lastPos.lat), Cesium.Cartesian3.fromDegrees(this.quli.lng, this.quli.lat));
            this.quli.heading = heading;
        } else {
            this.quli.heading = 0;
        }

        if (lastPos.lng != this.jiluo.lng && lastPos.lat != this.jiluo.lat) {
            let heading = -90 + getHeading(Cesium.Cartesian3.fromDegrees(lastPos.lng, lastPos.lat), Cesium.Cartesian3.fromDegrees(this.jiluo.lng, this.jiluo.lat));
            this.jiluo.heading = heading;
        } else {
            this.jiluo.heading = 0;
        }

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
     * 清理
     */
    dispose() {

        this.moving = false;

        // 移除实体
        this.ellipsoidEntity1 && this.graphicLayer.removeGraphic(this.ellipsoidEntity1); // 带雷达扫描的半球
        this.ellipsoidEntity2 && this.graphicLayer.removeGraphic(this.ellipsoidEntity2);// 不带雷达扫描的半球
        this.ellipsoidLabel && this.graphicLayer.removeGraphic(this.ellipsoidLabel); // 雷达半球Label
        this.vehicle1 && this.vehicle1.dispose();// 汽车1
        this.vehicle2 && this.vehicle2.dispose(); // 汽车2
        this.vehicle3 && this.vehicle2.dispose(); // 汽车3
        this.droneSwarm && this.droneSwarm.dispose(); // 无人要群
        this.divLabel && this.divLabel.dispose(); // div信息
        this.attackDrones && this.attackDrones.dispose();  // 激光
        this.interferenceDrones && this.interferenceDrones.dispose(); // 干扰
        this.explosion && this.explosion.dispose(); //爆炸

        // 移除图层
        this.graphicLayer && this.map.removeLayer(this.graphicLayer);

    }


    /**
     * TWEEN动画
     */
    moveVehicle3() {

        this.tween && TWEEN.remove(this.tween);
        this.tween = new TWEEN.Tween({
            x: this.vehicle3Position.lng,
            y: this.vehicle3Position.lat,
            z: this.vehicle3.graphic.point.alt,
            heading: this.vehicle3Position.heading
        }).to({
            x: 117.1830,
            y: 31.8331,
            z: this.vehicle3.graphic.point.alt,
            heading: this.vehicle3Position.heading
        }, 10000).start().onUpdate(e => {
            this.vehicle3.graphic.position = Cesium.Cartesian3.fromDegrees(e.x, e.y, e.z);
            this.vehicle3.graphic.heading = e.heading
        }).onComplete(() => {
            TWEEN.remove(this.tween);
        });

    }


}