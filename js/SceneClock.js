/**
 * 时钟控制
 */
let SceneClock = (function () {

    function SceneClock(options) {
        this.map = undefined;
        this.start = Cesium.JulianDate.fromDate(new Date(2024, 0, 22, 12));
        this.stop = Cesium.JulianDate.addSeconds(this.start, 100, new Cesium.JulianDate());

        let self = this;
        self = Object.assign(this, options);

        if (this.map.controls.timeline) {
            this.map.controls.timeline.zoomTo(this.start, this.stop)
        }

        this.map.clock.startTime = this.start.clone()
        this.map.clock.stopTime = this.stop.clone()
        this.map.clock.currentTime = this.start.clone()
        this.map.clock.multiplier = 1 // 当前速度，默认为1
        this.map.clock.shouldAnimate = false // 是否开启时钟动画，默认true
        this.map.clock.clockRange = Cesium.ClockRange.UNBOUNDED; // 到达终止时间后循环
    }

    SceneClock.prototype.startAnimate = function () {
        this.map.clock.shouldAnimate = true;
        this.map.clock.currentTime = this.start.clone();
    }

    return SceneClock;
})();
