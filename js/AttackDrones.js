/**
 * 激光攻击无人机
 */
let AttackDrones = (function () {

    function AttackDrones(options) {
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
                    time: '2024-01-22 12:00:18.000',
                    heading: 0,
                    pitch: 30
                },
                {
                    time: '2024-01-22 12:00:19.000',
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

        this.entity = undefined;

        this.create();
        if (!this.positions) { // 如果传递的不是positions，则计算positions
            this.positions = [];
            this.toPositions();
        }
        this.move();
    }

    AttackDrones.prototype.create = function () {
        // 激光
        this.entity = new mars3d.graphic.PolylineEntity({
            positions: [
                Cesium.Cartesian3.fromDegrees(0, 0, 0),
                Cesium.Cartesian3.fromDegrees(1, 1, 1)
            ],
            style: {
                width: 5,
                clampToGround: false,
                materialType: mars3d.MaterialType.LineFlow,
                materialOptions: {
                    color: Cesium.Color.CHARTREUSE,
                    image: "img/textures/line-color-yellow.png",
                    speed: 100
                }
            }
        });
        this.graphicLayer.addGraphic(this.entity);

        // div信息
        this.label = new Label({
            map: this.map,
            graphicLayer: this.graphicLayer,
            type: 2,
            text: '激光攻击',
            lng: undefined,
            lat: undefined,
            height: undefined,
        });
    }

    AttackDrones.prototype.toPositions = function () {
        this.directions.map(direction => {
            let position = this.toPosition(direction);
            this.positions.push(position);
        });
    }

    AttackDrones.prototype.toPosition = function (direction) {
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

    AttackDrones.prototype.appendData = function (direction) {
        this.directions.push(direction);
        let position = this.toPosition(direction);
        this.positions.push(position);
    }

    AttackDrones.prototype.move = function () {
        this.entity.positions = new Cesium.CallbackProperty((time, result) => {
            let datetime = dayjs(Cesium.JulianDate.toDate(time));
            let position = findPosition(datetime, this.positions);
            if (!position) return undefined;
            return [
                Cesium.Cartesian3.fromDegrees(this.vehiclePosition.lng, this.vehiclePosition.lat, this.vehiclePosition.height),
                Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height),
            ];
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

    AttackDrones.prototype.dispose = function () {
        if (this.entity) {
            this.graphicLayer.removeGraphic(this.entity)
        }
    }

    return AttackDrones;
})()
