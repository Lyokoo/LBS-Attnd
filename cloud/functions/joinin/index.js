const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const groupCollection = db.collection('group');
  const { passWd } = event;
  const { openId: signinerOpenId } = event.userInfo;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd) {
    return { code: 4000 };
  }

  try {
    // 获取小组信息
    // res = { data:[], errMsg }
    const { data: groupData } = await groupCollection.where({
      passWd: _.eq(passWd)
    }).get();
    console.log('groupData', groupData);
    if (groupData.length <= 0) {
      throw new Error('找不到小组');
    }
    const { members } = groupData[0];

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
      if (!signinerName) {
        return { code: 3003 };
      }
    } else {
      return { code: 3003 };
    }

    // 加入小组
    const memberInfo = members[signinerOpenId];
    const reqData = memberInfo
    ? { signinerOpenId, signinerName, signinerStuId, updateTime: new Date() }
    : { signinerOpenId, signinerName, signinerStuId, createTime: new Date(), updateTime: new Date() }
    console.log(reqData);
    const updateKey = `members.${signinerOpenId}`;
    const { stats: { updated } } = await groupCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.neq(signinerOpenId),
      active: _.eq(true),
      groupStatus: _.eq(1)
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