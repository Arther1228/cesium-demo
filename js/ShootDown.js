class ShootDown {

    /**
     * 击落
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层
     * @param {*} options.positionProperty 位置property
     * @param {*} options.orientationProperty 姿态property
     * @param {*} options.position 击落后的位置
     */
    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.positionProperty = options.positionProperty;
        this.orientationProperty = options.orientationProperty;
        this.position = options.position;

        this.create(this.position);

    }

    /**
     * 击落动画效果
     * @param {*} pos 
     */
    create(pos) {

        let dateTime = string2Date(pos.time);
        let time = Cesium.JulianDate.fromDate(dateTime)
        let targetPosition = Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height);
        this.positionProperty.addSample(time, targetPosition);
        this.orientationProperty.addSample(time, Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.height),
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(pos.heading || 0),
                Cesium.Math.toRadians(pos.pitch || 0),
                Cesium.Math.toRadians(pos.roll || 0)
            )
        ));

    }
}