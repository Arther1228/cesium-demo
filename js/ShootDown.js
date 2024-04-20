/**
 * 击落
 */
let ShootDown = (function () {

    function ShootDown(options) {
        this.map = undefined;
        this.graphicLayer = undefined;
        this.positionProperty = undefined;
        this.orientationProperty = undefined;

        let defaultOptions = {
            position: { // 击落后无人机位置
                time: '2024-01-22 12:00:21.000',
                lng: 117.1780,
                lat: 31.8200,
                height: 44,
            }
        }

        options = Object.assign(defaultOptions, options);
        Object.assign(this, options);

        this.create(this.position);
    }

    ShootDown.prototype.create = function (pos) {
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

    return ShootDown;
})()
