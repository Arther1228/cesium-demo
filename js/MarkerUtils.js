/**
 * 标记点工具类
 */
class MarkerUtils {
    constructor(map) {
        this.map = map;
        this.markers = []; // 存储所有标记点
    }

    /**
     * 添加标记点
     * @param {number} longitude - 经度
     * @param {number} latitude - 纬度
     * @param {number} height - 高度(米)
     * @param {object} options - 可选参数
     */
    addMarker(longitude, latitude, height = 0, options = {}) {
        const defaultOptions = {
            name: `标记点-${this.markers.length + 1}`,
            position: [longitude, latitude, height],
            style: {
                color: "#ff0000",
                opacity: 0.8,
                pixelSize: 10,
                outlineColor: "#ffffff",
                outlineWidth: 2
            },
            label: {
                text: `点${this.markers.length + 1}`,
                font_size: 18,
                color: "#ffffff",
                outline: true,
                outlineColor: "#000000",
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                visibleDepth: false
            },
            popup: `经度: ${longitude.toFixed(6)}<br/>纬度: ${latitude.toFixed(6)}<br/>高度: ${height}米`
        };

        const finalOptions = Object.assign({}, defaultOptions, options);
        const marker = new mars3d.graphic.PointEntity(finalOptions);
        this.map.graphicLayer.addGraphic(marker);
        
        this.markers.push(marker);
        return marker;
    }

    /**
     * 清除所有标记点
     */
    clearAllMarkers() {
        this.map.graphicLayer.clear();
        this.markers = [];
    }

    /**
     * 获取所有标记点
     */
    getAllMarkers() {
        return this.markers;
    }
}

// 全局变量
let markerUtils = null;

/**
 * 初始化标记工具
 * @param {object} map - Mars3D地图实例
 */
function initMarkerUtils(map) {
    markerUtils = new MarkerUtils(map);
}

/**
 * 从输入框添加标记点
 */
function addPointFromInput() {
    if (!markerUtils) {
        console.error("MarkerUtils未初始化!");
        return;
    }

    const longitude = parseFloat(document.getElementById("longitude").value);
    const latitude = parseFloat(document.getElementById("latitude").value);
    const height = parseFloat(document.getElementById("height").value) || 0;

    if (isNaN(longitude) || isNaN(latitude)) {
        alert("请输入有效的经度和纬度!");
        return;
    }

    markerUtils.addMarker(longitude, latitude, height);
}