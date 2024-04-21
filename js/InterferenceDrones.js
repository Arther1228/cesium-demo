class InterferenceDrones {

    /**
     * 电磁干扰无人机
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层
     * @param {*} options.length 攻击距离 
     * @param {*} options.vehiclePosition 车辆坐标 
     */
    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.length = options.length;
        this.vehiclePosition = options.vehiclePosition;

        this.directions = [ // 方位
            {
                time: '2024-01-22 12:00:15.000',
                heading: 0,
                pitch: 30
            },
            {
                time: '2024-01-22 12:00:17.000',
                heading: 100,
                pitch: 40
            },
            {
                time: '2024-01-22 12:00:20.000',
                heading: 150,
                pitch: 70
            }
        ];

        this.create();

        if (!this.positions) { // 如果传递的不是positions，则计算positions
            this.positions = [];
            this.toPositions();
        }

        this.move();

    }


    /**
     * 创建扫描显示的圆锥追总体
     */
    create() {

        // 圆锥追踪体
        this.droneTrack = new DroneTrack({
            map: this.map,
            graphicLayer: this.graphicLayer,
            position: [0, 0, 0],
            targetPosition: [1, 1, 1],
        });

        this.coneTrack = this.droneTrack.coneTrack;

        // div信息
        this.label = new Label({
            map: this.map,
            graphicLayer: this.graphicLayer,
            type: 2,
            text: '电磁干扰',
            lng: undefined,
            lat: undefined,
            height: undefined,
        });
    }


    /**
     * 转化为坐标
     */
    toPositions() {

        this.directions.map(direction => {
            let position = this.toPosition(direction);
            this.positions.push(position);
        });

    }

    /**
     * 将方位转化为坐标
     */
    toPosition(direction) {

        let position = {
            time: direction.time
        };

        let length = this.length * Math.cos(direction.pitch * Math.PI / 180);
        let pos = getNextPosition(this.vehiclePosition.lng, this.vehiclePosition.lat, direction.heading, length);
        pos = toDegrees(pos);
        position.lng = pos.lng;
        position.lat = pos.lat;
        position.height = this.length * Math.sin(direction.pitch * Math.PI / 180);

        return position;

    }


    /**
     * 动态追加数据
     */
    appendData(direction) {

        this.directions.push(direction);
        let position = this.toPosition(direction);
        this.positions.push(position);

    }


    /**
     * 圆锥追踪体动态效果
     */
    move() {

        this.coneTrack.position = new Cesium.CallbackProperty((time, result) => {
            let datetime = dayjs(Cesium.JulianDate.toDate(time));
            let startTime = dayjs(string2Date(this.directions[0].time));
            let endTime = dayjs(string2Date(this.directions[this.directions.length - 1].time));
            if (datetime.valueOf() < startTime.valueOf() || datetime.valueOf() > endTime.valueOf()) {
                return undefined;
            }
            return Cesium.Cartesian3.fromDegrees(this.vehiclePosition.lng, this.vehiclePosition.lat, this.vehiclePosition.height);
        });

        this.coneTrack.targetPosition = new Cesium.CallbackProperty((time, result) => {
            let datetime = dayjs(Cesium.JulianDate.toDate(time));
            let position = findPosition(datetime, this.positions);
            if (!position) return undefined;
            return Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height);
        });

        this.label.graphic.position = new Cesium.CallbackProperty((time, result) => {
            let datetime = dayjs(Cesium.JulianDate.toDate(time));
            let position = findPosition(datetime, this.positions);
            if (!position) return undefined;
            return Cesium.Cartesian3.fromDegrees((this.vehiclePosition.lng + position.lng) / 2,
                (this.vehiclePosition.lat + position.lat) / 2,
                (this.vehiclePosition.height + position.height) / 2);
        });
    }


    /**
     * 清理
     */
    dispose() {

        if (this.droneTrack) {
            this.droneTrack.dispose();
        }
        if (this.label) {
            this.label.dispose();
        }

    }
}