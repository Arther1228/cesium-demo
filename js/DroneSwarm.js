/**
 * 无人机
 */
let DroneSwarm = (function () {

    function DroneSwarm(options) {
        this.map = undefined;
        this.graphicLayer = undefined;

        let defaultOptions = {
            modelType: 1, // 模型
        }

        options = Object.assign(defaultOptions, options);
        Object.assign(this, options);

        this.graphic = undefined; // 生成的模型

        this.create();
    }

    DroneSwarm.prototype.create = function () {
        let modelEntity = this.createModelEntity(this.modelType);
        this.graphic = modelEntity;
        this.graphicLayer.addGraphic(this.graphic);
    }

    DroneSwarm.prototype.createModelEntity = function (modelType) {
        let modelEntity;

        let path = { //实时轨迹显示
            show: true,
            leadTime: 0, // 飞机将要经过的路径，路径存在的时间
            trailTime: 60, // 飞机已经经过的路径，路径存在的时间
            width: 1, // 线宽度
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.3, // 应该是轨迹线的发光强度
                color: Cesium.Color.PALEGOLDENROD // 颜色
            })
        };

        if (modelType == 1) {
            modelEntity = new mars3d.graphic.ModelEntity({
                position: [this.lng, this.lat, this.height], // 默认值
                style: {
                    url: 'gltf/wrj.glb',
                    scale: 0.1,
                    minimumPixelSize: 50,
                    heading: this.heading
                },
                path: path
            });
        } else if (modelType == 2) {
            modelEntity = new mars3d.graphic.ModelEntity({
                position: [this.lng, this.lat, this.height], // 默认值
                style: {
                    url: 'gltf/dajiang.gltf',
                    scale: 20,
                    minimumPixelSize: 50,
                    heading: this.heading
                },
                path: path
            });
        }

        return modelEntity;
    }

    DroneSwarm.prototype.dispose = function () {
        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }
    }

    return DroneSwarm;
})();

