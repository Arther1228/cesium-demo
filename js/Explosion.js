class Explosion {

    /**
     * 爆炸
     * @param {*} options.map 地图对象 
     * @param {*} options.graphicLayer 图层 
     * @param {*} options.startTime 开始时间
     * @param {*} options.endTime 结束时间 
     * @param {*} options.lng 经度 
     * @param {*} options.lat 维度 
     * @param {*} options.height 高度 
     */
    constructor(options) {

        this.map = options.map;
        this.graphicLayer = options.graphicLayer;
        this.startTime = options.startTime;
        this.endTime = options.endTime;
        this.lng = options.lng;
        this.lat = options.lat;
        this.height = options.height;

        this.viewer = this.map.viewer;
        this.scene = this.viewer.scene;

        this.create();

    }


    create() {

        this.viewModel = {
            emissionRate: 20,
            gravity: 9.0,//设置重力参数
            minimumParticleLife: 0.3,
            maximumParticleLife: 0.8,
            minimumSpeed: 20.0,//粒子发射的最小速度
            maximumSpeed: 100.0,//粒子发射的最大速度
            startScale: 0.5,
            endScale: 5.0,
        }
        this.emitterModelMatrix = new Cesium.Matrix4();
        this.translation = new Cesium.Cartesian3();
        this.rotation = new Cesium.Quaternion();
        this.hpr = new Cesium.HeadingPitchRoll();
        this.trs = new Cesium.TranslationRotationScale();
        this.entity = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(this.lng, this.lat, this.height) // 选择粒子放置的坐标
        });
        this.init();
    }

    init() {

        this.particleSystem = this.scene.primitives.add(
            new Cesium.ParticleSystem({
                image: 'img/explosion5.png',//生成所需粒子的图片路径
                imageSize: new Cesium.Cartesian2(50.0, 50.0), //粒子图像尺寸(以像素为单位)
                //粒子在生命周期开始时的颜色
                startColor: Cesium.Color.RED.withAlpha(0.7),
                //粒子在生命周期结束时的颜色
                endColor: Cesium.Color.YELLOW.withAlpha(0.3),
                //粒子在生命周期开始时初始比例
                startScale: this.viewModel.startScale,
                //粒子在生命周期结束时比例
                endScale: this.viewModel.endScale,
                //粒子发射的最小速度
                minimumParticleLife: this.viewModel.minimumParticleLife,
                //粒子发射的最大速度
                maximumParticleLife: this.viewModel.maximumParticleLife,
                //粒子质量的最小界限
                minimumSpeed: this.viewModel.minimumSpeed,
                //粒子质量的最大界限
                maximumSpeed: this.viewModel.maximumSpeed,
                //每秒发射的粒子数
                emissionRate: this.viewModel.emissionRate,
                //粒子系统发射粒子的时间（秒）
                lifetime: 5.0,
                //设置粒子的大小是否以米或像素为单位
                sizeInMeters: true,
                //系统的粒子发射器
                emitter: new Cesium.SphereEmitter(100.0),//BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器

            })
        );
        this.preUpdateEvent();
    }

    preUpdateEvent() {

        this.viewer.scene.preUpdate.addEventListener((scene, time) => {
            if (!this.particleSystem) return;

            //发射器地理位置
            this.particleSystem.modelMatrix = this.computeModelMatrix(this.entity, time);
            //发射器局部位置
            this.particleSystem.emitterModelMatrix = this.computeEmitterModelMatrix();
            // 将发射器旋转
            if (this.viewModel.spin) {
                this.viewModel.heading += 1.0;
                this.viewModel.pitch += 1.0;
                this.viewModel.roll += 1.0;
            }
        });

    }


    computeModelMatrix(entity, time) {

        return entity.computeModelMatrix(time, new Cesium.Matrix4());
    }

    computeEmitterModelMatrix() {

        let hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0);
        let trs = new Cesium.TranslationRotationScale();
        trs.translation = Cesium.Cartesian3.fromElements(0, 20, 0);
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr);
        let result = Cesium.Matrix4.fromTranslationRotationScale(trs);
        return result;
    }

    removeEvent() {

        this.viewer.scene.preUpdate.removeEventListener(this.preUpdateEvent, this);
    }

    dispose() {

        this.removeEvent(); //清除事件
        this.viewer.scene.primitives.remove(this.particleSystem); //删除粒子对象
        this.viewer.entities.remove(this.entity); //删除entity

        this.emitterModelMatrix = undefined;
        this.translation = undefined;
        this.rotation = undefined;
        this.hpr = undefined;
        this.trs = undefined;
        this.particleSystem = undefined;

    }
}