/**
 * 航道
 */
var RoutVolumeEntity = (function () {

    function RoutVolumeEntity(options) {
        this.map = undefined;
        this.graphicLayer = undefined;
        this.color = "#ffff00"
        this.radius = 10.0;
        this.heading = 0;
        let self = this;
        self = Object.assign(this, options);
        this.graphic = undefined
    }

    RoutVolumeEntity.prototype.createRoutVolume = function (points) {
        var positions = []
        points.forEach(point => {
            let position = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt)
            positions.push({
                position: position,
                style: {
                    dimensions: new Cesium.Cartesian3(this.radius, this.radius, this.radius),
                    color: point.color||this.color,
                    opacity: 0.4,
                    heading:this.heading,
                }
            })
        });

        var graphic = new mars3d.graphic.BoxCombine({
            instances: positions,
        })
        this.graphicLayer.addGraphic(graphic)
        this.graphic= graphic;
    }

    RoutVolumeEntity.prototype.dispose = function () {
        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }
    }

    return RoutVolumeEntity;
})();
