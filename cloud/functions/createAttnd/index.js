const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c'
});

// 生成签到口令
const buildPassWd = (count) => {
  const digits = "0123456789abcdefghijk+mnopqrstuvwxyzABCDEFGH=JKLMNOPQRSTUVWXYZ";
  let passwd = '';

  // 返回 [min, max] 范围的整数
  const getRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
  }

  // 10 进制转 62 进制
  const to62 = (n) => {
    let ans = '';
    while (n !== 0) {
      ans += digits[n % 62];
      n = Math.floor(n / 62);
    }
    return ans;
  }

  passwd = digits[getRandomInt(0, 61)] + to62(Date.now()).slice(0, 2) + to62(count + 1);

  return passwd;
}

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const userCollection = db.collection('user');
  const { attndName, location } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  if (typeof attndName !== 'string'
    || !attndName
    || typeof location !== 'object'
    || typeof location.lng !== 'number'
    || typeof location.lat !== 'number') {
    return { code: 4000 };
  }

  try {
    let hostName = '';
    // 查询此用户是否存在
    const { data } = await userCollection.where({
      openId: _.eq(openId)
    }).get();
    console.log(data);
    if (Array.isArray(data) && data.length > 0) {
      hostName = data[0].name;
    } else {
      return { code: 3003 };
    }

    // 计算签到口令
    const countRes = await attndCollection.count();
    console.log('countRes', countRes);
    if (!Number.isInteger(countRes.total)) {
      throw new Error('获取记录数量出现错误');
    }
    let passWd = buildPassWd(countRes.total);

    // 查询是否存在与此口令相同的考勤
    // res = { data: [], errMsg }
    // while (true) {
    //   const { data } = await attndCollection.where({
    //     passWd: _.eq(passWd)
    //   }).get();
    //   // 不存在该记录，可插入
    //   if (Array.isArray(data) && data.length === 0) {
    //     break;
    //   }
    //   if (!Array.isArray(data)) {
    //     console.log('查询数据库错误');
    //     throw new Error('查询数据库错误');
    //   }
    //   passWd = buildPassWd();
    // }

    // 创建新的考勤
    const reqData = {
      hostName,
      attndName,
      location,
      passWd,
      hostOpenId: openId,
      attndStatus: 1, // 考勤状态 0-->已结束，1-->进行中
      createTime: new Date(),
      updateTime: new Date()
    }
    console.log(reqData);
    await attndCollection.add({
      data: reqData
    });
    return {
      code: 2000,
      data: { passWd }
    };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}