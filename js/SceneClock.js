class SceneClock {


    /**
     *  时钟控制
     * @param {*} options.map  地图对象  
     * @description 最主要的配置是： start stop的起始点时间
     */
    constructor(options) {

        this.map = options.map;

        this.start = options.start;
        this.stop = Cesium.JulianDate.addSeconds(this.start, 100, new Cesium.JulianDate());


        if (this.map.controls.timeline) {
            this.map.controls.timeline.zoomTo(this.start, this.stop)
        }

        this.map.clock.startTime = this.start.clone();
        this.map.clock.stopTime = this.stop.clone();
        this.map.clock.currentTime = this.start.clone();
        this.map.clock.multiplier = 1; // 当前速度，默认为1
        this.map.clock.shouldAnimate = false; // 是否开启时钟动画，默认true
        this.map.clock.clockRange = Cesium.ClockRange.UNBOUNDED; // 到达终止时间后循环

    }

    /**
     * 开始动画效果
     */
    startAnimate() {
        this.map.clock.shouldAnimate = true;
        this.map.clock.currentTime = this.start.clone();
    }

    /**
     * 设置倍速
     * @param {*} multiplier 
     */
    setMultiplier(multiplier) {
        this.map.clock.multiplier = multiplier;
    }

    /**
     * 增加事件监听
     * @param {*} event 
     */
    addEventListener(event) {
        this.map.clock.onTick.addEventListener(event);
    }

    /**
     * 移除事件监听
     * @param {*} event 
     */
    removeEventListener(event) {
        this.map.clock.onTick.removeEventListener(event);
    }

}
