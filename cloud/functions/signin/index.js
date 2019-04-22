const cloud = require('wx-server-sdk');
cloud.init();

// 计算两个经纬度坐标之间的距离
const getDistance = (lng1, lat1, lng2, lat2) => {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // 🌍 地球半径
  s = Math.round(s * 10000) / 10000;
  return Math.floor(s);
};

/**
 * 1. 签到状态：已到、超出距离、迟到
 * 2. 只要考勤不是自己发布的都可签到
 * 3. 签到之后显示超出距离，可重复签到，其他状态不可
 */
exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const signinCollection = db.collection('signin');
  const attndCollection = db.collection('attnd');
  const { passWd, location: signinerLocation } = event;
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
    const attndRes = await attndCollection.where({
      passWd: _.eq(passWd)
    }).get();
    if (attndRes.data.length <= 0) {
      throw new Error('找不到考勤');
    }
    const {
      location: hostLocation,
      hostOpenId,
      attndStatus
    } = attndRes.data[0];
    console.log('attndInfo', attndRes.data[0]);

    // 如果考勤是自己发布的，无法签到
    if (hostOpenId === signinerOpenId) {
      throw new Error('无法在自己发布的考勤上签到');
    }

    // 获取签到信息
    // res = { data:[], errMsg }
    let signinRes = await signinCollection.where({
      passWd: _.eq(passWd),
      signinerOpenId: _.eq(signinerOpenId)
    }).get();

    // 若存在该记录
    if (signinRes.data.length > 0) {
      // signinStatus: 0-->超出距离，1-->已到，2-->迟到
      // 如果存在签到记录且超出距离的，可重复签到
      const { signinerStatus } = signinRes.data[0];
      if (signinerStatus !== 0) {
        return { code: 3002 };
      }
    }

    // 计算发布考勤者与签到者的距离
    const distance = getDistance(hostLocation.lng, hostLocation.lat, signinerLocation.lng, signinerLocation.lat) || Number.MAX_SAFE_INTEGER;

    // 计算签到状态
    // attndStatus: 0-->已结束，1-->进行中
    // signinerStatus: 0-->超出距离，1-->已到，2-->迟到
    var signinerStatus = 1;
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

    // 获取签到信息
    // res = { data:[], errMsg }
    let signinRes2 = await signinCollection.where({
      passWd: _.eq(passWd),
      signinerOpenId: _.eq(signinerOpenId)
    }).get();

    if (signinRes2.data.length > 0) {
      const reqData = {
        passWd, signinerOpenId, signinerLocation, signinerStatus, distance, updateTime: new Date()
      };
      console.log(reqData);
      await signinCollection.where({
        passWd: _.eq(passWd),
        signinerOpenId: _.eq(signinerOpenId)
      }).update({
        data: reqData
      });
      return { code: 2000 };
    } else if (signinRes2.data.length === 0) {
      // 第一次签到获取考勤名称
      const attndRes = await attndCollection.where({
        passWd: _.eq(passWd)
      }).get();
      const { attndName } = attndRes.data[0];
      
      const reqData = {
        passWd, attndName, signinerOpenId, signinerLocation, signinerStatus, distance, createTime: new Date(), updateTime: new Date()
      };
      console.log(reqData);
      await signinCollection.add({
        data: reqData
      });
      return { code: 2000 };
    } else {
      throw new Error('数据库错误');
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}