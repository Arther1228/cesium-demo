/**
 * 驱离
 */
let DriveAway = (function () {

    function DriveAway(options) {
        this.map = undefined;
        this.graphicLayer = undefined;
        this.positionProperty = undefined;
        this.orientationProperty = undefined;

        let defaultOptions = {
            position: { // 驱离后无人机位置
                time: '2024-01-22 12:00:30.000',
                lng: 117.1450,
                lat: 31.8687,
                height: 1200,
            }
        }

        options = Object.assign(defaultOptions, options);
        Object.assign(this, options);

        this.create(this.position);
    }

    DriveAway.prototype.create = function (pos) {
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

    return DriveAway;
})()

