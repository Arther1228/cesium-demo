/**
 * 标签
 */
let Label = (function () {

    function Label(options) {
        this.map = undefined;
        this.graphicLayer = undefined;
        this.type = 1; // 标签类型
        this.lng = 60;
        this.lat = 80;
        this.height = 44;
        this.title = ""; // 标题
        this.content = ""; // 内容
        this.text = ""; //文本

        let self = this;
        self = Object.assign(this, options);

        this.graphic = undefined;

        this.createLabel();
    }

    Label.prototype.createLabel = function () {
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
            let graphic = new mars3d.graphic.DivGraphic({
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
            this.graphicLayer.addGraphic(graphic);
            this.graphic = graphic;
        } else if (this.type == 2) {
            let html = `<div class="marsBluePanel">
                            <div class="marsBluePanel-text">{text}</div>
                        </div>`;
            html = html.replace('{text}', this.text);
            let graphic = new mars3d.graphic.DivGraphic({
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
            this.graphicLayer.addGraphic(graphic);
            this.graphic = graphic;
        }
    }

    Label.prototype.dispose = function () {
        if (this.graphic) {
            this.graphicLayer.removeGraphic(this.graphic);
        }
    }

    return Label;
})();
