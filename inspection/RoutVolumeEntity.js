class RoutVolumeEntity {

    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.heading = options.heading || 0;
        this.radius = options.radius || 10.0;
        this.color = options.color || "#ffff00";
        this.grphic = undefined;

    }


    /**
     * 创建航道
     */
    createRoutVolume(points) {

        let positions = []
        points.forEach(point => {
            let position = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt)
            positions.push({
                position: position,
                style: {
                    dimensions: new Cesium.Cartesian3(this.radius, this.radius, this.radius),
                    color: point.color || this.color,
                    opacity: 0.4,
                    heading: this.heading,
                }
            })
        });

        let graphic = new mars3d.graphic.BoxCombine({
            instances: positions,
        })
        this.graphicLayer.addGraphic(graphic)
        this.graphic = graphic;

    }


    /**
     * 清理
     */
    dispose() {

        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }
    }
}