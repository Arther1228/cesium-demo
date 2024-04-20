// 调用项目的消息提示（自动消失）
function globalMsg(content) {
    if (window.layer) {
        window.layer.msg(content) // 此方法需要引用layer.js
    } else if (window.toastr) {
        window.toastr.info(content) // 此方法需要引用toastr
    } else {
        window.alert(content)
    }
}

/**
 * 字符串转日期时间对象
 * @param { string } stringDate 格式: YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD HH:mm:ss.SSS
 * @returns { Date }
 */
function string2Date(stringDate) {
    let parts = stringDate.split(/\s|\./);
    let dateParts = parts[0].split('-');
    let timeParts = parts[1].split(':');
    let milliseconds = 0;
    if (parts.length > 2) {
        milliseconds = parseInt(parts[2]);
    }
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]),
        parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]),
        milliseconds);
}

/**
 * 字符串转dayjs对象
 * @param { string } value 格式: YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD HH:mm:ss.SSS
 * @returns { dayjs }
 */
function string2Dayjs(value) {
    return dayjs(string2Date(value));
}

/**
 * 根据两个坐标点,获取Heading(朝向)
 * @param { Cesium.Cartesian3 } pointA 
 * @param { Cesium.Cartesian3 } pointB 
 * @returns 
 */
function getHeading(pointA, pointB) {
    //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
    //向量AB
    const positionvector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
    //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
    //AB为世界坐标中的向量
    //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
    const vector = Cesium.Matrix4.multiplyByPointAsVector(
        Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()),
        positionvector,
        new Cesium.Cartesian3()
    );
    //归一化
    const direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
    //heading
    let heading = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
    heading = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(heading);
    return Cesium.Math.toDegrees(heading);
}

/**
 * 根据两个坐标点,获取Pitch(仰角)
 * @param { Cesium.Cartesian3 } pointA 
 * @param { Cesium.Cartesian3 } pointB 
 * @returns 
 */
function getPitch(pointA, pointB) {
    let transfrom = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
    const vector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
    let direction = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transfrom, transfrom), vector, vector);
    Cesium.Cartesian3.normalize(direction, direction);
    //因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
    let pitch = Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
    return Cesium.Math.toDegrees(pitch);
}

/**
 * 世界坐标转经纬度
 * @param { Cesium.Cartesian3 } cartesian3 
 */
function toDegrees(cartesian3) {
    // 世界坐标转换为弧度
    let ellipsoid = map.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(cartesian3);

    // 弧度转换为经纬度
    let lng = Cesium.Math.toDegrees(cartographic.longitude);  // 经度
    let lat = Cesium.Math.toDegrees(cartographic.latitude);   // 纬度
    let alt = cartographic.height;	// 高度

    return { lng, lat, alt }
}

/**
 * 根据经纬度、方向、距离，计算另一个点的经纬度坐标
 * @param { number } lng 经度
 * @param { number } lat 纬度
 * @param { number } angle 方向角度
 * @param { number } length 距离(单位：米)
 * @returns 
 */
function getNextPosition(lng, lat, angle, length) {
    let cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat);
    let transform = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian3);
    let matrix3 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle || 0));
    let rotationZ = Cesium.Matrix4.fromRotationTranslation(matrix3);
    Cesium.Matrix4.multiply(transform, rotationZ, transform);
    let result = Cesium.Matrix4.multiplyByPoint(transform, new Cesium.Cartesian3(0, length, 0), new Cesium.Cartesian3());
    return result;
}

/**
 * 二分查找并计算position
 * @param { string } time 时间 格式: YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD HH:mm:ss.SSS
 * @param { { time:string, lng:number, lat:number, height:number } } positions 坐标集合
 * @returns { { time:string, lng:number, lat:number, height:number } }
 */
function findPosition(time, positions) {
    let left = 0;
    let right = positions.length - 1;
    let leftPosition = positions[left];
    let rightPosition = positions[right];
    let leftTime = string2Dayjs(leftPosition.time);
    let rightTime = string2Dayjs(rightPosition.time);

    if (time.valueOf() < leftTime.valueOf() || time.valueOf() > rightTime.valueOf()) {
        return undefined;
    }

    while (left <= right) {
        let middle = Math.floor((left + right) / 2);
        let middlePosition = positions[middle];
        let middleTime = string2Dayjs(middlePosition.time);

        if (time.valueOf() === leftTime.valueOf()) {
            return leftPosition;
        } else if (time.valueOf() === middleTime.valueOf()) {
            return middlePosition;
        }
        else if (time.valueOf() === rightTime.valueOf()) {
            return rightPosition;
        }
        else {
            if (time.valueOf() < middleTime.valueOf()) {
                right = middle;
                rightPosition = positions[right];
                rightTime = string2Dayjs(rightPosition.time);

            } else {
                left = middle;
                leftPosition = positions[left];
                leftTime = string2Dayjs(leftPosition.time);
            }

            if (right - left == 1) {
                let ratio = (time.valueOf() - leftTime.valueOf()) / (rightTime.valueOf() - leftTime.valueOf());
                let lng = leftPosition.lng + (rightPosition.lng - leftPosition.lng) * ratio;
                let lat = leftPosition.lat + (rightPosition.lat - leftPosition.lat) * ratio;
                let height = leftPosition.height + (rightPosition.height - leftPosition.height) * ratio;
                return {
                    time: time.format('YYYY-MM-DD HH:mm:ss.SSS'),
                    lng,
                    lat,
                    height,
                }
            } else if (right - left == 0) {
                return undefined;
            }
        }
    }
}
