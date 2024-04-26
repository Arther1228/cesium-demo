class DroneSwarm {

    /**
     * 无人机
     * @param {*} options.graphicLayer 图层 
     * @param {*} options.modelType 模型类型 
     */
    constructor(options) {

        this.modelType = options.modelType == undefined ? 1 : options.modelType;
        this.graphicLayer = options.graphicLayer;


        // 之前的演示任务因为抽样会设置坐标,所以并没有用到这里的参数
        this.lng = options.lng;
        this.lat = options.lat;
        this.height = options.height;

        this.graphic = undefined;

        this.createModelEntity(this.modelType);

    }


    /**
     * 创建模型
     * @param {*} modelType 模型类型
     */
    createModelEntity(modelType) {

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
        this.graphicLayer.addGraphic(modelEntity);
        
        this.graphic = modelEntity;
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