/**
 * 车辆模型
 */
let Vehicle = (function () {

    function Vehicle(options) {
        this.map = undefined;
        this.graphicLayer = undefined;
        this.lng = 60;
        this.lat = 80;
        this.height = 44;
        this.heading = 25;
        this.modelType = 1; // 模型类型

        let self = this;
        self = Object.assign(this, options);

        this.graphic = undefined;

        this.loadModel();
    }

    Vehicle.prototype.loadModel = function () {
        if (this.modelType == 1) {
            let graphic = new mars3d.graphic.ModelEntity({
                position: [this.lng, this.lat, this.height],
                style: {
                    url: 'gltf/汽车.glb',
                    scale: 0.3,
                    minimumPixelSize: undefined,
                    heading: this.heading
                },
                dataId: this.dataId,
            })
            this.graphicLayer.addGraphic(graphic)
            this.graphic = graphic;
            graphic.bindContextMenu([ //绑定右键菜单
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
    }

    Vehicle.prototype.dispose = function () {
        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }
    }

    Vehicle.prototype.menuClick = function (graphic) {
        alert(graphic.options.dataId);
    }

    return Vehicle;
})();
