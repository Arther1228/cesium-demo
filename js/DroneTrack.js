/**
 * 追踪无人机
 */
let DroneTrack = (function () {

    function DroneTrack(options) {
        this.map = undefined;
        this.graphicLayer = undefined;

        let defaultOptions = {
            type: 1, // 1波纹纹理 2颜色纹理
            position: undefined,
            targetPosition: undefined,
            angle: 5,
        }

        options = Object.assign(defaultOptions, options);
        Object.assign(this, options);

        this.coneTrack = undefined;

        this.create();
    }

    DroneTrack.prototype.create = function () {
        let coneTrack;
        if (this.type == 1) {
            coneTrack = new mars3d.graphic.ConeTrack({
                position: this.position,
                targetPosition: this.targetPosition,
                style: {
                    // length: 4000, //targetPosition存在时无需传
                    angle: this.angle, // 半场角度
                    // 自定义扩散波纹纹理
                    materialType: mars3d.MaterialType.CylinderWave,
                    materialOptions: {
                        color: 'rgba(10,200,255,0.5)',
                        repeat: 30.0,
                        thickness: 0.2
                    }
                }
            });
        } else {
            coneTrack = new mars3d.graphic.ConeTrack({
                position: this.position,
                targetPosition: this.targetPosition,
                style: {
                    // length: 4000,
                    angle: this.angle, // 半场角度
                    materialType: mars3d.MaterialType.CircleWave,
                    materialOptions: {
                        color: "#0266ff",
                        speed: 50,
                    },
                    // color: "#02aaff",
                    // opacity: 0.2,
                }
            })
        }
        this.graphicLayer.addGraphic(coneTrack);
        this.coneTrack = coneTrack;
    }

    DroneTrack.prototype.dispose = function () {
        if (this.coneTrack) {
            this.graphicLayer.removeGraphic(this.coneTrack)
        }
    }

    return DroneTrack;
})()
