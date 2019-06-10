const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

// 计算两个经纬度坐标之间的距离
const getDistance = (lng1, lat1, lng2, lat2) => {
  if (lng1 === lng2 && lat1 === lat2) {
    return 0;
  }
  let radLat1 = lat1 * Math.PI / 180.0;
  let radLat2 = lat2 * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // 🌍 地球半径
  // s = s * 6371.393; // 🌍 真正地球半径
  s = Math.round(s * 10000) / 10000;
  return s * 1000;
};

/**
 * 1. 签到状态：已到、超出距离、迟到
 * 2. 只要考勤不是自己发布的都可签到
 * 3. 签到之后显示超出距离，可重复签到，其他状态不可
 */
exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const attndCollection = db.collection('attnd');
  const { passWd, location: signinerLocation, signinerSystemInfo, tmpLocation } = event;
  const { openId: signinerOpenId } = event.userInfo;
  const validDistance = 200;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd
    || typeof signinerLocation !== 'object'
    || typeof signinerLocation.lng !== 'number'
    || typeof signinerLocation.lat !== 'number') {
    return { code: 4000 };
  }

  try {
    // 获取该考勤信息
    // res = { data:[], errMsg }
    const { data: attndData } = await attndCollection.where({
      passWd: _.eq(passWd)
    }).get();
    console.log('attndData', attndData);
    if (attndData.length <= 0) {
      throw new Error('找不到考勤');
    }
    const {
      location: hostLocation,
      attndStatus,
      signinerList
    } = attndData[0];

    // 检查个人信息是否完善
    let signinerName = '';
    let signinerStuId = '';
    const { data: userData } = await userCollection.where({
      openId: _.eq(signinerOpenId)
    }).get();
    console.log('userData', userData);
    if (Array.isArray(userData) && userData.length > 0) {
      signinerName = userData[0].name;
      signinerStuId = userData[0].stuId;
      console.log('signinerName', signinerName);
      console.log('signinerStuId', signinerStuId);
    } else {
      return { code: 3003 };
    }

    // 获取签到信息
    // signinStatus: 0-->超出距离，1-->已到，2-->迟到
    // 如果存在签到记录且超出距离的，可重复签到
    const signinInfo = signinerList[signinerOpenId];
    if (signinInfo && signinInfo.signinerStatus !== 0) {
      return { code: 3002 };
    }

    // 计算发布考勤者与签到者的距离
    const distance = getDistance(hostLocation.lng, hostLocation.lat, signinerLocation.lng, signinerLocation.lat) || Number.MAX_SAFE_INTEGER;
    console.log('distance', distance);

    // 计算签到状态
    // attndStatus: 0-->已结束，1-->进行中
    // signinerStatus: 0-->超出距离，1-->已到，2-->迟到
    let signinerStatus = -1;
    switch (attndStatus) {
      case 1:
        if (distance >= 0 && distance <= validDistance) {
          signinerStatus = 1;
        } else {
          signinerStatus = 0;
        }
        break;
      case 0:
      default:
        signinerStatus = 2;
        break;
    }

    // 签到
    const reqData = signinInfo
      ? { signinerLocation, tmpLocation, signinerSystemInfo, signinerStatus, distance, updateTime: new Date() }
      : { signinerOpenId, signinerLocation, tmpLocation, signinerSystemInfo, signinerStatus, distance, signinerName, signinerStuId, createTime: new Date(), updateTime: new Date() }
    console.log(reqData);
    const updateKey = `signinerList.${signinerOpenId}`;
    const { stats: { updated } } = await attndCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.neq(signinerOpenId),
      active: true
    }).update({
      data: {
        [updateKey]: reqData
      }
    });
    if (updated !== 1) {
      throw new Error('更新记录异常');
    }
    return { code: 2000 };

  } catch (e) {
    // {"errCode":-502001,"errMsg":"云资源数据库错误：数据库请求失败 "}
    console.log(e);
    if (typeof e === 'object' && e.errCode === -502001) {
      return { code: 5001, msg: e };
    }
    return { code: 5000, msg: e };
  }
}