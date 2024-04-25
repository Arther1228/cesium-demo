class AircraftTakeoffDemo {

    /**
     * 模拟飞机起飞，测试用
     * @param {*} map 地图对象 
     */
    constructor(map) {

        this.map = map;
        this.graphicLayer = new mars3d.layer.GraphicLayer();
        this.map.addLayer(this.graphicLayer);

        // 在图层绑定Popup弹窗
        this.graphicLayer.bindPopup(function (event) {
            const attr = {}
            attr["名称"] = event.graphic.attr.remark

            return mars3d.Util.getTemplateHtml({ title: "信息提示", template: "all", attr })
        })

        let start = Cesium.JulianDate.fromDate(new Date(2024, 0, 22, 12));
        let stop = Cesium.JulianDate.addSeconds(start, 100, new Cesium.JulianDate());
        this.start = start;
        this.stop = stop;

    }


    /**
     * 加载
     */
    load(lng, lat, height, heading) {

        let start = this.start;
        let stop = this.stop;

        const modelGraphic = new mars3d.graphic.ModelEntity({
            position: [lng, lat, height],
            style: {
                url: 'gltf/wrj.glb',
                scale: 0.5,
                minimumPixelSize: 30,
                heading: 140
            },
            attr: { remark: "无人机" },
            //实时轨迹显示
            path: {
                show: true,
                leadTime: 0,//飞机将要经过的路径，路径存在的时间
                trailTime: 60,//飞机已经经过的路径，路径存在的时间
                width: 1,//线宽度
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.3,//应该是轨迹线的发光强度
                    color: new Cesium.Color(255, 255, 255, 180) //颜色
                })
            }
        });

        this.graphicLayer.addGraphic(modelGraphic);

        let timePosArr = [];
        timePosArr.push({
            time: Cesium.JulianDate.addSeconds(start, 0, new Cesium.JulianDate()), //时间递增
            position: Cesium.Cartesian3.fromDegrees(lng, lat, height), //位置变化
            headingPitchRollQuaternion: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(lng, lat, height),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(heading),
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(0)
                )
            )
        });
        timePosArr.push({
            time: Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()), //时间递增
            position: Cesium.Cartesian3.fromDegrees(117.1843, 31.8173, height + 10), //位置变化
            headingPitchRollQuaternion: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(117.1843, 31.8173, height + 10),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(heading),
                    Cesium.Math.toRadians(6),
                    Cesium.Math.toRadians(0)
                )
            )
        });
        timePosArr.push({
            time: Cesium.JulianDate.addSeconds(start, 80, new Cesium.JulianDate()), //时间递增
            position: Cesium.Cartesian3.fromDegrees(117.1853, 31.8170, height + 20), //位置变化
            headingPitchRollQuaternion: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(117.1853, 31.8170, height + 20),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(heading),
                    Cesium.Math.toRadians(10),
                    Cesium.Math.toRadians(0)
                )
            )
        });
        timePosArr.push({
            time: Cesium.JulianDate.addSeconds(start, 100, new Cesium.JulianDate()), //时间递增
            position: Cesium.Cartesian3.fromDegrees(117.1863, 31.8166, height + 40), //位置变化
            headingPitchRollQuaternion: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(117.1863, 31.8166, height + 40),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(heading),
                    Cesium.Math.toRadians(25),
                    Cesium.Math.toRadians(0)
                )
            )
        });

        let property = new Cesium.SampledPositionProperty();
        let orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);
        for (let i = 0; i < timePosArr.length; i++) {
            let timePos = timePosArr[i];
            property.addSample(timePos.time, timePos.position);
            orientationProperty.addSample(timePos.time, timePos.headingPitchRollQuaternion);
        }

        this.graphic = modelGraphic;

        this.graphic.position = property;
        this.graphic.orientation = orientationProperty;

        this.startMove();
    }


    /**
     * 飞行
     */
    startMove() {

        let sceneClock = new SceneClock({
            map: this.map,
        });
        sceneClock.startAnimate();

    }


    /**
     * 清理
     */
    dispose() {

        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic)
        }

    }
}