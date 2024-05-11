class RouteChannel {

    /**
     * 飞行航道
     * toDegrees(getNextPosition(117.094839, 31.823180, 90, 170)) 获取下个点
    * @param {*} options.map 地图对象
    * @param {*} options.graphicLayer 图层
    * @param {*} options.DronePositions 航点坐标集合
    * @param {*} options.altitude 海拔（产业园海拔是28）
    * @param {*} options.radius 方框的高度（不是半径）
    * @param {*} options.color 方框的颜色
     */
    constructor(options) {

        this.map = map;
        this.graphicLayer = options.graphicLayer;
        this.DronePositions = options.DronePositions;
        this.altitude = options.altitude || 28;
        this.radius = options.radius || 10;
        this.color = options.color || "#00FF00";

        this.load();

    }

    /**
     * 加载航道
     * @returns
     */
    load() {

        if (this.DronePositions.length < 2) {
            console.error("Insufficient number of drone positions to build channels.");
            return;
        }

        for (let i = 0; i < this.DronePositions.length - 1; i++) {
            const point1 = [];
            point1[0] = this.DronePositions[i].lng;
            point1[1] = this.DronePositions[i].lat;
            point1[2] = this.DronePositions[i].height;

            const point2 = [];
            point2[0] = this.DronePositions[i + 1].lng;
            point2[1] = this.DronePositions[i + 1].lat;
            point2[2] = this.DronePositions[i + 1].height;

            this.buildChannelByTwoPoints(point1, point2);
        }


    }


    /**
     * 以两个点的坐标来生成航路
     * @param {*} point1 起点
     * @param {*} point2 终点
     */
    buildChannelByTwoPoints(point1, point2) {

        var pointList = [];

        var heading = getHeadingByLngLat(point1, point2);

        if (point1[0] == point2[0] && point1[1] == point2[1]) {   // 纵向航道
            var boxPoints = this.generateBoxByHeight(point1, point2, this.color, this.radius);
            pointList = pointList.concat(boxPoints);
        } else {
            var boxPoints = this.generateBox(point1, point2, this.radius, this.color, -heading);
            pointList = pointList.concat(boxPoints);
        }

        var routVolumeEntity = new RoutVolumeEntity({
            map: this.map,
            graphicLayer: this.graphicLayer,
            heading: heading,
            radius: this.radius
        })

        routVolumeEntity.createRoutVolume(pointList);

    }


    /**
     * 生成相同高度的航路
     */
    generateBox(posA, posB, radius, color, heading) {
        var positionA = Cesium.Cartesian3.fromDegrees(posA[0], posA[1], 0)
        var positionB = Cesium.Cartesian3.fromDegrees(posB[0], posB[1], 0)
        var distance = getSpaceDistance(positionA, positionB)
        var aa = []
        var count = 0
        while (distance >= radius * count) {
            var point = getNextPosition(posA[0], posA[1], heading, radius * count)
            var nextPoint = toDegrees(point)
            aa.push({
                lng: nextPoint.lng,
                lat: nextPoint.lat,
                alt: posA[2],
                color: color
            })
            count++
        }
        return aa
    }

    /**
     * 生成纵向的航道
     * @param {*} posA 
     * @param {*} posB 
     * @returns 
     */
    generateBoxByHeight(posA, posB, color, radius) {

        var heightDistance = Math.abs(posA[2] - posB[2]);
        var num = Math.ceil(heightDistance / (radius));

        var aa = []
        for (let index = 0; index <= num; index++) {
            aa.push({
                lng: posA[0],
                lat: posA[1],
                alt: index * radius + posA[2],
                color: color
            })
        }
        return aa
    }


    /**
     * 清理
     */
    dispose() {

        // 清理航道
        // this.routVolumeEntity.dispose();

        this.graphicLayer.clear(true);

    }

}



