class Vehicle {

    /**
     * 车辆模型
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层
     * @param {*} options.lng 经度 
     * @param {*} options.map 维度 
     * @param {*} options.map 高度 
     * @param {*} options.map 朝向 
     * @param {*} options.map 数据ID 
     */
    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.lng = options.lng;
        this.lat = options.lat;
        this.height = options.height;
        this.heading = options.heading;
        this.dataId = options.dataId;
        
        this.modelType = 1; // 模型类型
        this.graphic = this.loadModel();

    }

    /**
     * 创建模型
     */
    loadModel() {

        let vehicleGraphic;

        if (this.modelType == 1) {
            vehicleGraphic = new mars3d.graphic.ModelEntity({
                position: [this.lng, this.lat, this.height],
                style: {
                    url: 'gltf/汽车.glb',
                    scale: 0.3,
                    minimumPixelSize: undefined,
                    heading: this.heading
                },
                dataId: this.dataId,
            })

            vehicleGraphic.bindContextMenu([ //绑定右键菜单
                {
                    text: "目标模拟器对抗状态测试及显控设备载车&nbsp;&nbsp;",
                    icon: "fa fa-trash-o",
                    children: [
                        {
                            text: "设备参数",
                            icon: "fa fa-trash-o",
                            show: true,
                            callback: e => {
                                this.menuClick(e.graphic);
                            },
                        },
                    ]
                },
                {
                    text: "光电探测跟踪测距设备",
                    icon: "fa fa-trash-o",
                    callback: e => {
                        this.menuClick(e.graphic);
                    }
                },
            ])
        } else if (this.modelType == 2) {

        }

        this.graphicLayer.addGraphic(vehicleGraphic)

        return vehicleGraphic;
    }


    /**
     * 清理
     */
    dispose(){

        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }

    }

    /**
     * 响应鼠标事件
     * @param {*} graphic 
     */
    menuClick(graphic){

        alert(graphic.options.dataId);

    }
}