class Label {

    /**
     * 标签
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层 
     * @param {*} options.type 标签类型
     * @param {*} options.lng 经度 
     * @param {*} options.lat 维度 
     * @param {*} options.height 标签高度 
     * @param {*} options.text 文本 
     */
    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer,
        this.type = options.type;
        this.lng = options.lng;
        this.lat = options.lat,
        this.height = options.height,
        this.text = options.text;

        this.createLabel();

    }


    /**
     * 创建标签
     */
    createLabel() {

        let labelGraphic;

        if (this.type == 1) {
            let html = `<div class="marsTiltPanel marsTiltPanel-theme-red">
                            <div class="marsTiltPanel-wrap">
                                <div class="area">
                                    <div class="arrow-lt"></div>
                                    <div class="b-t"></div>
                                    <div class="b-r"></div>
                                    <div class="b-b"></div>
                                    <div class="b-l"></div>
                                    <div class="arrow-rb"></div>
                                    <div class="label-wrap">
                                        <div class="title">无人机入侵</div>
                                        <div class="label-content">
                                            <div class="data-li">
                                                <div class="data-label">速度：</div>
                                                <div class="data-value"><span id="lablLiuliang" class="label-num">12</span><span class="label-unit">m/s</span>
                                                </div>
                                            </div>
                                            <div class="data-li">
                                                <div class="data-label">高度：</div>
                                                <div class="data-value"><span id="lablYeWei"  class="label-num">1200</span><span class="label-unit">m</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="b-t-l"></div>
                                <div class="b-b-r"></div>
                            </div>
                            <div class="arrow" ></div>
                        </div>`;
            labelGraphic = new mars3d.graphic.DivGraphic({
                position: [this.lng, this.lat, this.height],
                style: {
                    html: html,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
                    clampToGround: false
                },
                pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
            });

        } else if (this.type == 2) {
            let html = `<div class="marsBluePanel">
                            <div class="marsBluePanel-text">{text}</div>
                        </div>`;
            html = html.replace('{text}', this.text);
            labelGraphic = new mars3d.graphic.DivGraphic({
                position: [this.lng, this.lat, this.height],
                style: {
                    html: html,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
                    clampToGround: false,
                },
                pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
            });
        }

        this.graphicLayer.addGraphic(labelGraphic);

        this.graphic =  labelGraphic;
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