/**
 * 电磁干扰无人机
 */
let InterferenceDrones = (function () {

    function InterferenceDrones(options) {
        this.map = undefined;
        this.graphicLayer = undefined;

        let defaultOptions = {
            length: 3000, // 攻击距离
            vehiclePosition: { // 汽车坐标
                lng: 117.1878,
                lat: 31.8189,
                height: 44,
                heading: 25
            },
            directions: [ // 方位
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
            ],
        }

        options = Object.assign(defaultOptions, options);
        Object.assign(this, options);

        this.droneTrack = undefined;
        this.coneTrack = undefined;
        this.label = undefined;

        this.create();
        if (!this.positions) { // 如果传递的不是positions，则计算positions
            this.positions = [];
            this.toPositions();
        }
        this.move();
    }

    InterferenceDrones.prototype.create = function () {
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

    InterferenceDrones.prototype.toPositions = function () {
        this.directions.map(direction => {
            let position = this.toPosition(direction);
            this.positions.push(position);
        });
    }

    InterferenceDrones.prototype.toPosition = function (direction) {
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

    InterferenceDrones.prototype.appendData = function (direction) {
        this.directions.push(direction);
        let position = this.toPosition(direction);
        this.positions.push(position);
    }

    InterferenceDrones.prototype.move = function () {
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

    InterferenceDrones.prototype.dispose = function () {
        if (this.droneTrack) {
            this.droneTrack.dispose();
        }
        if (this.label) {
            this.label.dispose();
        }
    }

    return InterferenceDrones;
})()
