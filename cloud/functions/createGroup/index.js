const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

// 生成考勤组口令
const buildGroupPassWd = () => {
  // 返回 [min, max] 范围的整数
  const getRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
  }

  // 毫秒时间戳转成 62 进制
  const getTimeIn62 = (timeInLong) => {
    let timeIn62 = '';
    while (timeInLong !== 0) {
      timeIn62 += digits[timeInLong % 62];
      timeInLong = Math.floor(timeInLong / 62);
    }
    return timeIn62;
  }

  const digits = "0123456789abcdefghijk+mnopqrstuvwxyzABCDEFGH=JKLMNOPQRSTUVWXYZ";
  let passwd = '';

  passwd = '#'
    + getTimeIn62(Date.now()).slice(0, 3)
    + digits[getRandomInt(0, 61)] + digits[getRandomInt(0, 61)];

  return passwd;
}

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const groupCollection = db.collection('group');
  const userCollection = db.collection('user');
  const { groupName } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  if (typeof groupName !== 'string' || !groupName) {
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
      return { code: 3003, msg: '个人信息不完整' };
    }

    // 文字内容合法性检测
    const { errCode } = await cloud.openapi.security.msgSecCheck({
      content: groupName
    });
    if (errCode === 87014) {
      throw new Error('内容含有违法违规内容');
    }

    // 计算考勤组口令
    let passWd = buildGroupPassWd();

    // 查询是否存在与此口令相同的考勤组
    // res = { data: [], errMsg }
    while (true) {
      const { data } = await groupCollection.where({
        passWd: _.eq(passWd)
      }).get();
      // 不存在该记录，可插入
      if (Array.isArray(data) && data.length === 0) {
        break;
      }
      if (!Array.isArray(data)) {
        console.log('查询数据库错误');
        throw new Error('查询数据库错误');
      }
      passWd = buildPassWd();
    }

    // 创建新的考勤组
    const reqData = {
      groupName,
      hostName,
      hostOpenId: openId,
      passWd,
      groupStatus: 1,
      active: true,
      createTime: new Date(),
      updateTime: new Date(),
      members: {}
    };
    console.log(reqData);

    await groupCollection.add({
      data: reqData
    });
    return {
      code: 2000,
      data: { passWd }
    };
  } catch (e) {
    // {"errCode":-502001,"errMsg":"云资源数据库错误：数据库请求失败 "}
    console.log(e);
    if (typeof e === 'object' && e.errCode === -502001) {
      return { code: 5001, msg: e };
    }
    return { code: 5000, msg: e };
  }
}