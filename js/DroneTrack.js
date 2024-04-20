class DroneTrack{

    /**
     * 追踪无人机
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层
     * @param {*} options.position position属性
     * @param {*} options.targetPosition targetPosition属性
     */
    constructor(options){

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.position = options.position;
        this.targetPosition = options.targetPosition;

        this.coneTrack = this.create();
    }


    /**
     * 扫描效果
     * @returns 
     */
    create(){

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

        return coneTrack;

    }


    dispose(){

        if (this.coneTrack) {
            this.graphicLayer.removeGraphic(this.coneTrack)
        }

    }
}